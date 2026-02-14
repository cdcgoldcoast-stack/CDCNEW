import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import {
  buildCorsHeaders,
  createServiceClient,
  enforceRateLimit,
  getClientHash,
  jsonResponse,
  requireJsonBody,
  requireMethod,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

// Function to calculate GCD for aspect ratio
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Function to simplify aspect ratio
function getAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

const DAILY_LIMIT = Number(Deno.env.get("DESIGN_DAILY_LIMIT") ?? "8");
const BURST_LIMIT = Number(Deno.env.get("DESIGN_BURST_LIMIT") ?? "4");
const BURST_WINDOW_SECONDS = Number(Deno.env.get("DESIGN_BURST_WINDOW_SECONDS") ?? "900");
const LAYOUT_SAMPLE_SIZE = 64;
const LAYOUT_SIMILARITY_THRESHOLD = 0.84;
const LAYOUT_ANCHOR_THRESHOLD = 0.56;
const LAYOUT_BOUNDARY_THRESHOLD = 0.68;
const LAYOUT_SHIFT_THRESHOLD = 2.2;
const LAYOUT_MAX_SHIFT_SEARCH = 4;
const CHANGE_INTENSITY_THRESHOLD = 10; // average per-channel diff (0-255)
const MAX_ATTEMPTS = 2;

interface GenerateDesignRequest {
  imageBase64?: string;
  prompt?: string;
  spaceType?: string;
  designStyle?: string | null;
  colorTone?: string | null;
  materialFeel?: string | null;
  fixtureFinish?: string | null;
  imageWidth?: number;
  imageHeight?: number;
}

const STRICT_LAYOUT_SUFFIX = `

STRICT LAYOUT LOCK:
- Do NOT remove, add, or move any walls or partitions.
- Do NOT remove openings or add new openings.
- Do NOT move or alter doors, door frames, windows, or window frames.
- Do NOT change room boundaries in any way.
- Keep all fixtures present and in the SAME positions (you may update their style/finish).
- You may add subtle lighting accents attached to existing surfaces.
- If you cannot comply, respond with: NEED_CLEARER_PHOTO: layout preservation required.
`;

const STRONG_RENOVATION_SUFFIX = `

RENOVATION IMPACT: CLEAR AND REALISTIC
- The result must look like a real renovation, not a minor color tweak.
- Update finishes and modernize fixtures, but keep geometry untouched.
- Refresh vanity/joinery fronts and handles, basin style, and fixture finishes.
- Add visible modern mood lighting (mirror backlight, under-vanity toe-kick glow, or subtle wall sconce).
- Keep layout identical. Do NOT move walls, windows, doors, or fixtures.
- Preserve all doors and windows exactly in place (frames, handles, openings unchanged).
`;

const FINAL_LAYOUT_SUFFIX = `

FINAL GEOMETRY GUARDRAIL (NON-NEGOTIABLE):
- Keep room dimensions EXACTLY the same. Do NOT widen, deepen, stretch, or expand any area.
- Keep wall intersection lines, corners, ceiling lines, and floor boundary lines aligned to the original.
- Keep all doors and windows in exact position and perspective. Do not alter opening size or angle.
- Keep all major fixtures locked to the same footprint and placement.
- If any of the above cannot be preserved, respond with: NEED_CLEARER_PHOTO: geometry lock failed.
`;

const SYSTEM_PROMPT = `CRITICAL INSTRUCTION - READ FIRST
THIS IS PHOTO EDITING, NOT IMAGE GENERATION.
You MUST edit the provided photo. The output must be the EXACT SAME ROOM with upgraded finishes only.

ABSOLUTE RULES (VIOLATION = FAILURE):
1. SAME camera angle, lens, and viewpoint. No zoom, no crop, no perspective change.
2. SAME layout. All windows, doors, walls, partitions, toilets, sinks, showers, cabinets stay in EXACT same positions.
3. SAME room shape and geometry. Walls, corners, ceiling height unchanged.
4. KEEP ALL FIXTURES PRESENT. You may UPDATE their style/finish, but do NOT remove, move, or resize them.
5. You MAY add subtle lighting accents and small decorative details that do not change layout.
6. NO new furniture or storage. No text overlays.
7. NO rotation, flip, crop, resize, or aspect-ratio change.

DIMENSIONS & ORIENTATION:
- Output image MUST match input width, height, aspect ratio, and orientation EXACTLY.
- Portrait stays portrait. Landscape stays landscape. Square stays square.

If you overlay before/after, everything must align pixel-perfectly. Only surfaces and fixture styles can change.

RENOVATION IMPACT REQUIREMENT:
The changes must be clearly visible. Do not make subtle edits only.
Update multiple surfaces and fixture styles, modernize the vanity/basin/toilet/tapware, and add modern mood lighting accents.
Ambient lighting is REQUIRED: include at least one visible LED feature (mirror backlight, under-vanity strip, or subtle wall sconce).

WHAT YOU CAN EDIT (SURFACES + FIXTURES IN PLACE + LIGHTING ACCENTS):
- Wall paint colors
- Tiles (wall and floor)
- Flooring materials
- Benchtop/countertop materials
- Fixture finishes and styles (toilet, vanity, basin, tapware, shower head, bath, lighting) - SAME position and size
- Cabinet door colors or textures ONLY (same position, same size)
- Add modern mood lighting: LED strips (mirror backlight, vanity toe-kick, under-cabinet), subtle wall sconces, warm ambient glow
- Add small decorative accents attached to surfaces (mirror frame, towel rail, minimal artwork) without changing layout
- Modernize fixtures and joinery in-place: updated basin shape, modern toilet seat/lid, new vanity/drawer fronts and handles (same footprint)
- Ambient LED lighting is required (mirror backlight and/or under-vanity strip).

WHAT YOU MUST NEVER DO:
- Move or remove walls, windows, doors, or partitions
- Remove, relocate, or resize fixtures (toilet, basin, shower, bath, vanity, etc.)
- Add new furniture or storage
- Change perspective or camera angle
- Rotate or flip the image
- Change the image dimensions or aspect ratio
- Redesign the layout
- Create a different room

FAILSAFE:
If the photo is unclear or you cannot preserve the exact structure, respond with text only:
"NEED_CLEARER_PHOTO: [reason]"
Do not generate an image in this case.

OUTPUT:
Return the edited photo. The room structure, layout, camera angle, orientation, and dimensions must be IDENTICAL to the original.`;

// Build dimension constraint text to inject into prompts
function buildDimensionConstraint(width: number, height: number): string {
  const isPortrait = height > width;
  const isLandscape = width > height;
  const orientation = isPortrait ? "PORTRAIT (vertical/tall)" : isLandscape ? "LANDSCAPE (horizontal/wide)" : "SQUARE";
  const aspectRatio = getAspectRatio(width, height);
  
  return `
MANDATORY INPUT IMAGE SPECIFICATIONS - YOU MUST MATCH THESE EXACTLY:
═══════════════════════════════════════════════════════════════════
• Input Width: ${width} pixels
• Input Height: ${height} pixels  
• Input Orientation: ${orientation}
• Input Aspect Ratio: ${aspectRatio}

YOUR OUTPUT IMAGE MUST BE:
• EXACTLY ${width} x ${height} pixels (same as input)
• EXACTLY ${orientation} orientation (same as input)
• EXACTLY ${aspectRatio} aspect ratio (same as input)

ABSOLUTE PROHIBITION:
• DO NOT rotate the image
• DO NOT flip the image
• DO NOT crop the image
• DO NOT change dimensions
• DO NOT change aspect ratio
• A ${isPortrait ? "portrait" : isLandscape ? "landscape" : "square"} input MUST produce a ${isPortrait ? "portrait" : isLandscape ? "landscape" : "square"} output
═══════════════════════════════════════════════════════════════════
`;
}

// Build user prompt for "style" method
function buildStylePrompt(
  spaceLabel: string,
  designStyle: string,
  colorTone: string | null,
  materialFeel: string | null,
  fixtureFinish: string | null,
  dimensionConstraint: string
): string {
  const colorInstruction = colorTone ? `Use a ${colorTone.toLowerCase()} color palette.` : "";
  const materialInstruction = materialFeel ? `Feature ${materialFeel.toLowerCase()} materials.` : "";
  const fixtureInstruction = fixtureFinish ? `Use ${fixtureFinish.toLowerCase()} fixtures.` : "";

  return `${dimensionConstraint}

PHOTO EDITING TASK:
Space Type: ${spaceLabel}

DESIGN BRIEF:
- Style: ${designStyle}
- Color Tone: ${colorTone || "Not specified"}
- Materials: ${materialFeel || "Not specified"}
- Fixtures: ${fixtureFinish || "Not specified"}

EDIT this photo only. Keep the exact same room, angle, and layout.
Apply the ${designStyle} aesthetic. ${colorInstruction} ${materialInstruction} ${fixtureInstruction}

ABSOLUTE REQUIREMENT:
- Same room, same geometry, same objects.
- Do NOT add or remove structural elements or change layout.
- Only update surface materials and fixture styles.
- Keep all fixtures in the same positions.
- Modernize fixtures and joinery in place (basin/toilet/vanity/drawers/handles).
- Add visible ambient LED lighting (mirror backlight and/or under-vanity strip) without changing layout.`;
}

// Build user prompt for "describe" method
function buildDescribePrompt(spaceLabel: string, userDescription: string, dimensionConstraint: string): string {
  return `${dimensionConstraint}

PHOTO EDITING TASK:
Space Type: ${spaceLabel}

EDIT this photo only. Keep the exact same room, angle, and layout. Change finishes only.
Do NOT add or remove anything. Do NOT change geometry.

USER DESCRIPTION:
${userDescription}

REMINDER:
- Same room, same geometry, same objects.
- Only update surface materials and fixture styles.
- Keep all fixtures in the same positions.
- Modernize fixtures and joinery in place (basin/toilet/vanity/drawers/handles).
- Add visible ambient LED lighting (mirror backlight and/or under-vanity strip) without changing layout.`;
}

function decodeBase64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function decodeImageFromDataUrl(dataUrl: string): Promise<Image | null> {
  try {
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    const bytes = decodeBase64ToBytes(base64);
    return await Image.decode(bytes);
  } catch (err) {
    console.error("Failed to decode input image:", err);
    return null;
  }
}

async function decodeImageFromUrl(url: string): Promise<Image | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const bytes = new Uint8Array(await resp.arrayBuffer());
    return await Image.decode(bytes);
  } catch (err) {
    console.error("Failed to decode output image:", err);
    return null;
  }
}

function sampleLuma(image: Image, size: number): Float32Array {
  const lumas = new Float32Array(size * size);
  const { width, height, bitmap: data } = image;
  for (let y = 0; y < size; y++) {
    const srcY = Math.floor((y / size) * height);
    for (let x = 0; x < size; x++) {
      const srcX = Math.floor((x / size) * width);
      const idx = (srcY * width + srcX) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      lumas[y * size + x] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
  }
  return lumas;
}

function edgeMap(luma: Float32Array, size: number): Float32Array {
  const edges = new Float32Array(size * size);
  for (let y = 1; y < size; y++) {
    for (let x = 1; x < size; x++) {
      const idx = y * size + x;
      const dx = Math.abs(luma[idx] - luma[idx - 1]);
      const dy = Math.abs(luma[idx] - luma[idx - size]);
      edges[idx] = dx + dy;
    }
  }
  return edges;
}

function edgeSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;
  let sumDiff = 0;
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    sumDiff += Math.abs(a[i] - b[i]);
    count++;
  }
  const maxEdge = 510; // max per-pixel (dx+dy) for 8-bit channels
  const avgDiff = sumDiff / count;
  const similarity = 1 - Math.min(avgDiff / maxEdge, 1);
  return similarity;
}

function edgeSimilarityWithShift(
  inputEdges: Float32Array,
  outputEdges: Float32Array,
  size: number,
  shiftX: number,
  shiftY: number
): number {
  let sumDiff = 0;
  let count = 0;

  for (let y = 0; y < size; y++) {
    const outputY = y + shiftY;
    if (outputY < 0 || outputY >= size) continue;
    for (let x = 0; x < size; x++) {
      const outputX = x + shiftX;
      if (outputX < 0 || outputX >= size) continue;
      const inputIdx = y * size + x;
      const outputIdx = outputY * size + outputX;
      sumDiff += Math.abs(inputEdges[inputIdx] - outputEdges[outputIdx]);
      count++;
    }
  }

  if (count === 0) return 0;
  const maxEdge = 510;
  const avgDiff = sumDiff / count;
  return 1 - Math.min(avgDiff / maxEdge, 1);
}

function findBestEdgeShift(
  inputEdges: Float32Array,
  outputEdges: Float32Array,
  size: number,
  maxShift: number
): { similarity: number; shiftX: number; shiftY: number } {
  let bestSimilarity = edgeSimilarityWithShift(inputEdges, outputEdges, size, 0, 0);
  let bestShiftX = 0;
  let bestShiftY = 0;

  for (let shiftY = -maxShift; shiftY <= maxShift; shiftY++) {
    for (let shiftX = -maxShift; shiftX <= maxShift; shiftX++) {
      const similarity = edgeSimilarityWithShift(inputEdges, outputEdges, size, shiftX, shiftY);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestShiftX = shiftX;
        bestShiftY = shiftY;
      }
    }
  }

  return { similarity: bestSimilarity, shiftX: bestShiftX, shiftY: bestShiftY };
}

function collectStrongAnchors(
  edges: Float32Array,
  size: number,
  maxAnchors: number
): Array<{ x: number; y: number; strength: number }> {
  const ranked: Array<{ x: number; y: number; strength: number }> = [];
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const strength = edges[y * size + x];
      if (strength > 18) {
        ranked.push({ x, y, strength });
      }
    }
  }

  ranked.sort((a, b) => b.strength - a.strength);
  const anchors: Array<{ x: number; y: number; strength: number }> = [];
  const minDistance = Math.max(4, Math.floor(size * 0.07));
  const minDistanceSquared = minDistance * minDistance;

  for (const candidate of ranked) {
    if (anchors.length >= maxAnchors) break;
    const tooClose = anchors.some((anchor) => {
      const dx = anchor.x - candidate.x;
      const dy = anchor.y - candidate.y;
      return dx * dx + dy * dy < minDistanceSquared;
    });
    if (!tooClose) {
      anchors.push(candidate);
    }
  }

  return anchors;
}

function localEdgeMax(
  edges: Float32Array,
  size: number,
  centerX: number,
  centerY: number,
  radius: number
): number {
  let maxValue = 0;
  const startY = Math.max(0, centerY - radius);
  const endY = Math.min(size - 1, centerY + radius);
  const startX = Math.max(0, centerX - radius);
  const endX = Math.min(size - 1, centerX + radius);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const value = edges[y * size + x];
      if (value > maxValue) {
        maxValue = value;
      }
    }
  }

  return maxValue;
}

function anchorConsistencyScore(inputEdges: Float32Array, outputEdges: Float32Array, size: number): number {
  const anchors = collectStrongAnchors(inputEdges, size, 24);
  if (anchors.length === 0) return 1;

  let scoreSum = 0;
  for (const anchor of anchors) {
    const outputStrength = localEdgeMax(outputEdges, size, anchor.x, anchor.y, 2);
    const ratio = outputStrength / Math.max(anchor.strength, 1);
    const clamped = Math.max(0, Math.min(ratio, 1));
    scoreSum += clamped;
  }

  return scoreSum / anchors.length;
}

function estimateEdgeThreshold(edges: Float32Array): number {
  let sum = 0;
  let sumSquares = 0;
  const total = edges.length;

  for (let i = 0; i < total; i++) {
    const value = edges[i];
    sum += value;
    sumSquares += value * value;
  }

  const mean = sum / total;
  const variance = Math.max(sumSquares / total - mean * mean, 0);
  const stdDev = Math.sqrt(variance);
  return Math.max(16, mean + stdDev * 0.8);
}

function buildBoundaryProfile(edges: Float32Array, size: number, threshold: number) {
  const left = new Array<number>(size).fill(-1);
  const right = new Array<number>(size).fill(-1);
  const top = new Array<number>(size).fill(-1);
  const bottom = new Array<number>(size).fill(-1);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (edges[y * size + x] > threshold) {
        left[y] = x;
        break;
      }
    }
    for (let x = size - 1; x >= 0; x--) {
      if (edges[y * size + x] > threshold) {
        right[y] = x;
        break;
      }
    }
  }

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (edges[y * size + x] > threshold) {
        top[x] = y;
        break;
      }
    }
    for (let y = size - 1; y >= 0; y--) {
      if (edges[y * size + x] > threshold) {
        bottom[x] = y;
        break;
      }
    }
  }

  return { left, right, top, bottom };
}

function averageNormalizedDistance(a: number[], b: number[], size: number): number {
  let sum = 0;
  let count = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] < 0 || b[i] < 0) continue;
    sum += Math.abs(a[i] - b[i]) / size;
    count++;
  }

  return count > 0 ? sum / count : 0;
}

function boundaryConsistencyScore(inputEdges: Float32Array, outputEdges: Float32Array, size: number): number {
  const inputThreshold = estimateEdgeThreshold(inputEdges);
  const outputThreshold = estimateEdgeThreshold(outputEdges);

  const inputProfile = buildBoundaryProfile(inputEdges, size, inputThreshold);
  const outputProfile = buildBoundaryProfile(outputEdges, size, outputThreshold);

  const inputWidths = inputProfile.right.map((right, i) =>
    right >= 0 && inputProfile.left[i] >= 0 ? right - inputProfile.left[i] : -1
  );
  const outputWidths = outputProfile.right.map((right, i) =>
    right >= 0 && outputProfile.left[i] >= 0 ? right - outputProfile.left[i] : -1
  );
  const inputHeights = inputProfile.bottom.map((bottom, i) =>
    bottom >= 0 && inputProfile.top[i] >= 0 ? bottom - inputProfile.top[i] : -1
  );
  const outputHeights = outputProfile.bottom.map((bottom, i) =>
    bottom >= 0 && outputProfile.top[i] >= 0 ? bottom - outputProfile.top[i] : -1
  );

  const leftDiff = averageNormalizedDistance(inputProfile.left, outputProfile.left, size);
  const rightDiff = averageNormalizedDistance(inputProfile.right, outputProfile.right, size);
  const topDiff = averageNormalizedDistance(inputProfile.top, outputProfile.top, size);
  const bottomDiff = averageNormalizedDistance(inputProfile.bottom, outputProfile.bottom, size);
  const widthDiff = averageNormalizedDistance(inputWidths, outputWidths, size);
  const heightDiff = averageNormalizedDistance(inputHeights, outputHeights, size);

  const averageDiff = (leftDiff + rightDiff + topDiff + bottomDiff + widthDiff + heightDiff) / 6;
  return Math.max(0, Math.min(1, 1 - averageDiff * 1.8));
}

function computeColorChange(inputImage: Image, outputImage: Image, size: number): number {
  const { width: inW, height: inH, bitmap: inData } = inputImage;
  const { width: outW, height: outH, bitmap: outData } = outputImage;
  let sum = 0;
  let count = 0;
  for (let y = 0; y < size; y++) {
    const inY = Math.floor((y / size) * inH);
    const outY = Math.floor((y / size) * outH);
    for (let x = 0; x < size; x++) {
      const inX = Math.floor((x / size) * inW);
      const outX = Math.floor((x / size) * outW);
      const inIdx = (inY * inW + inX) * 4;
      const outIdx = (outY * outW + outX) * 4;
      const dr = Math.abs(inData[inIdx] - outData[outIdx]);
      const dg = Math.abs(inData[inIdx + 1] - outData[outIdx + 1]);
      const db = Math.abs(inData[inIdx + 2] - outData[outIdx + 2]);
      sum += (dr + dg + db) / 3;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

type LayoutFailureReason =
  | "structural_edges_changed"
  | "camera_or_geometry_shifted"
  | "fixtures_or_openings_moved"
  | "room_boundaries_expanded_or_compressed";

type LayoutMetrics = {
  directEdgeSimilarity: number;
  alignedEdgeSimilarity: number;
  shiftX: number;
  shiftY: number;
  shiftMagnitude: number;
  anchorConsistency: number;
  boundaryConsistency: number;
  changeScore: number;
};

async function verifyLayoutIntegrity(
  inputDataUrl: string,
  outputUrl: string
): Promise<{
  ok: boolean;
  metrics: LayoutMetrics | null;
  reasons: LayoutFailureReason[];
  changeTooSubtle: boolean;
}> {
  const inputImage = await decodeImageFromDataUrl(inputDataUrl);
  // Output is now a data URL from native Gemini API (base64 inline), not an HTTP URL
  const outputImage = outputUrl.startsWith("data:")
    ? await decodeImageFromDataUrl(outputUrl)
    : await decodeImageFromUrl(outputUrl);

  if (!inputImage || !outputImage) {
    return { ok: true, metrics: null, reasons: [], changeTooSubtle: false };
  }

  const inputLuma = sampleLuma(inputImage, LAYOUT_SAMPLE_SIZE);
  const outputLuma = sampleLuma(outputImage, LAYOUT_SAMPLE_SIZE);
  const inputEdges = edgeMap(inputLuma, LAYOUT_SAMPLE_SIZE);
  const outputEdges = edgeMap(outputLuma, LAYOUT_SAMPLE_SIZE);
  const directEdgeSimilarity = edgeSimilarity(inputEdges, outputEdges);
  const bestShift = findBestEdgeShift(inputEdges, outputEdges, LAYOUT_SAMPLE_SIZE, LAYOUT_MAX_SHIFT_SEARCH);
  const shiftMagnitude = Math.hypot(bestShift.shiftX, bestShift.shiftY);
  const anchorConsistency = anchorConsistencyScore(inputEdges, outputEdges, LAYOUT_SAMPLE_SIZE);
  const boundaryConsistency = boundaryConsistencyScore(inputEdges, outputEdges, LAYOUT_SAMPLE_SIZE);
  const changeScore = computeColorChange(inputImage, outputImage, LAYOUT_SAMPLE_SIZE);

  const reasons: LayoutFailureReason[] = [];
  if (bestShift.similarity < LAYOUT_SIMILARITY_THRESHOLD) {
    reasons.push("structural_edges_changed");
  }
  if (shiftMagnitude > LAYOUT_SHIFT_THRESHOLD) {
    reasons.push("camera_or_geometry_shifted");
  }
  if (anchorConsistency < LAYOUT_ANCHOR_THRESHOLD) {
    reasons.push("fixtures_or_openings_moved");
  }
  if (boundaryConsistency < LAYOUT_BOUNDARY_THRESHOLD) {
    reasons.push("room_boundaries_expanded_or_compressed");
  }

  return {
    ok: reasons.length === 0,
    metrics: {
      directEdgeSimilarity,
      alignedEdgeSimilarity: bestShift.similarity,
      shiftX: bestShift.shiftX,
      shiftY: bestShift.shiftY,
      shiftMagnitude,
      anchorConsistency,
      boundaryConsistency,
      changeScore,
    },
    reasons,
    changeTooSubtle: changeScore < CHANGE_INTENSITY_THRESHOLD,
  };
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  const methodResponse = requireMethod(req, ["POST", "OPTIONS"]);
  if (methodResponse) return methodResponse;

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const clientHash = await getClientHash(req);
    console.log("Client hash prefix:", clientHash.slice(0, 12));

    try {
      const burstRateLimit = await enforceRateLimit({
        req,
        endpoint: "generate-design",
        limit: BURST_LIMIT,
        windowSeconds: BURST_WINDOW_SECONDS,
        clientHash,
      });

      if (!burstRateLimit.allowed) {
        return jsonResponse(
          req,
          429,
          {
            error: "Too many generation attempts. Please wait and try again.",
            remaining: burstRateLimit.remaining,
            resetAt: burstRateLimit.resetAt,
          },
          { "Retry-After": String(BURST_WINDOW_SECONDS) },
        );
      }
    } catch (error) {
      console.error("Rate limit check failed (burst). Continuing with daily limit only.", error);
    }

    // Initialize Supabase client with service role for bypassing RLS
    const supabase = createServiceClient();
    
    // Check current usage for this IP today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: usageData, error: usageError } = await supabase
      .from('design_generation_usage')
      .select('generation_count')
      .eq('ip_address', clientHash)
      .eq('usage_date', today)
      .maybeSingle();
    
    if (usageError) {
      console.error("Error checking usage:", usageError);
      throw new Error("Failed to check usage limits");
    }
    
    const currentCount = usageData?.generation_count || 0;
    
    if (currentCount >= DAILY_LIMIT) {
      return jsonResponse(req, 429, {
        error: `Daily limit reached. You can generate up to ${DAILY_LIMIT} designs per day. Please try again tomorrow.`,
        limitReached: true,
        remaining: 0,
      });
    }

    // Parse request fields
    const bodyResult = await requireJsonBody<GenerateDesignRequest>(req, 17_000_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const { 
      imageBase64, 
      prompt, 
      spaceType,
      designStyle,    // Optional legacy style label
      colorTone,      // Optional overall guidance
      materialFeel,   // Optional overall guidance
      fixtureFinish,  // Optional overall guidance
      imageWidth,     // Original image width in pixels
      imageHeight     // Original image height in pixels
    } = bodyResult.data;

    // Enhanced logging for debugging
    console.log("Design generation request:", {
      spaceType,
      designStyle: designStyle || "N/A",
      colorTone: colorTone || "N/A",
      materialFeel: materialFeel || "N/A",
      fixtureFinish: fixtureFinish || "N/A",
      promptLength: prompt?.length || 0,
      imageDimensions: imageWidth && imageHeight ? `${imageWidth}x${imageHeight}` : "N/A"
    });

    // Validate required fields
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return jsonResponse(req, 400, { error: "Please upload an image" });
    }

    if (imageBase64.length > 16_000_000) {
      return jsonResponse(req, 413, { error: "Image is too large. Please upload a smaller file." });
    }

    if (!spaceType) {
      return jsonResponse(req, 400, { error: "Please select a space type" });
    }

    if (!["bathroom", "kitchen", "laundry", "living-open-plan", "open-plan"].includes(spaceType)) {
      return jsonResponse(req, 400, { error: "Invalid space type selected" });
    }

    const hasPrompt = typeof prompt === "string" && prompt.trim().length > 0;
    if (typeof prompt === "string" && prompt.length > 2000) {
      return jsonResponse(req, 400, { error: "Prompt is too long" });
    }

    if (!designStyle && !hasPrompt) {
      return jsonResponse(req, 400, { error: "Please add your design preferences" });
    }

    // Validate image dimensions were provided
    if (!imageWidth || !imageHeight) {
      console.warn("Image dimensions not provided - orientation enforcement will be limited");
    }
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Build the user prompt
    const spaceLabel = spaceType ? spaceType.replace("-", " ") : "space";
    
    // Build dimension constraint if we have dimensions
    const dimensionConstraint = imageWidth && imageHeight 
      ? buildDimensionConstraint(imageWidth, imageHeight)
      : "";
    
    let userPrompt: string;
    if (designStyle) {
      userPrompt = buildStylePrompt(spaceLabel, designStyle, colorTone, materialFeel, fixtureFinish, dimensionConstraint);
    } else {
      userPrompt = buildDescribePrompt(spaceLabel, prompt, dimensionConstraint);
    }

    console.log("Generating design with prompt:", userPrompt);

    const callModel = async (promptText: string) => {
      // Strip data URL prefix to get raw base64 for Gemini native API
      const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const mimeMatch = imageBase64.match(/^data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${SYSTEM_PROMPT}\n\n${promptText}` },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);

        if (response.status === 429) {
          return { error: `Rate limit exceeded (${response.status}). Detail: ${errorText.slice(0, 200)}`, status: 429 };
        }
        if (response.status === 402) {
          return { error: "Usage limit reached. Please add credits to continue.", status: 402 };
        }

        return { error: `AI error ${response.status}: ${errorText.slice(0, 200)}`, status: response.status };
      }

      const rawData = await response.json();

      // Check for blocked or empty responses
      if (!rawData.candidates || rawData.candidates.length === 0) {
        const blockReason = rawData.promptFeedback?.blockReason || "unknown";
        console.error("Gemini returned no candidates. Block reason:", blockReason, JSON.stringify(rawData).slice(0, 500));
        return { error: `The AI could not process this image (blocked: ${blockReason}). Try a different photo.`, status: 422 };
      }

      const finishReason = rawData.candidates[0].finishReason;
      if (finishReason === "SAFETY" || finishReason === "RECITATION") {
        console.error("Gemini blocked response. Finish reason:", finishReason);
        return { error: "The AI flagged this image. Please try a different photo.", status: 422 };
      }

      // Transform native Gemini response to match expected format
      const parts = rawData.candidates[0]?.content?.parts || [];
      let textContent = "";
      let imageUrl = "";

      for (const part of parts) {
        if (part.text) {
          textContent += part.text;
        }
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }

      const data = {
        choices: [{
          message: {
            content: textContent || null,
            images: imageUrl ? [{ image_url: { url: imageUrl } }] : [],
          },
        }],
      };

      return { data };
    };

    let generatedImageUrl: string | undefined;
    let textResponse: string | undefined;
    let layoutCheckResult: Awaited<ReturnType<typeof verifyLayoutIntegrity>> | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const promptText =
        attempt === 1
          ? `${userPrompt}${STRONG_RENOVATION_SUFFIX}`
          : attempt === 2
            ? `${userPrompt}${STRICT_LAYOUT_SUFFIX}${STRONG_RENOVATION_SUFFIX}`
            : `${userPrompt}${STRICT_LAYOUT_SUFFIX}${FINAL_LAYOUT_SUFFIX}${STRONG_RENOVATION_SUFFIX}`;
      const { data, error, status } = await callModel(promptText);

      if (error) {
        return new Response(
          JSON.stringify({ error }),
          { status: status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("AI response received");

      textResponse = data.choices?.[0]?.message?.content;

      if (textResponse?.startsWith("NEED_CLEARER_PHOTO")) {
        const reason = textResponse.replace("NEED_CLEARER_PHOTO:", "").trim();
        return new Response(
          JSON.stringify({
            error: "Please upload a clearer photo that shows the full room boundaries.",
            reason: reason,
            needClearerPhoto: true
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!generatedImageUrl) {
        console.warn(`Attempt ${attempt}: No image in AI response, retrying...`);
        continue;
      }

      const layoutCheck = await verifyLayoutIntegrity(imageBase64, generatedImageUrl);
      layoutCheckResult = layoutCheck;
      if (layoutCheck.ok && !layoutCheck.changeTooSubtle) {
        break;
      }

      console.warn("Layout or intensity check failed, retrying with stricter prompt", {
        metrics: layoutCheck.metrics,
        reasons: layoutCheck.reasons,
        changeTooSubtle: layoutCheck.changeTooSubtle,
        attempt,
      });
    }

    if (!generatedImageUrl) {
      return new Response(
        JSON.stringify({ error: "The AI could not generate an image for this photo. Please try a different image or adjust your preferences." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Best-effort: if layout check failed, still return the image with a warning
    if (layoutCheckResult && !layoutCheckResult.ok) {
      console.warn("Returning best-effort result despite layout check failure", {
        reasons: layoutCheckResult.reasons,
        metrics: layoutCheckResult.metrics,
      });
      // Fall through to return the image with a warning flag
    }

    // changeTooSubtle is handled as a warning in the response payload below

    // Update usage count after successful generation
    if (usageData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('design_generation_usage')
        .update({ generation_count: currentCount + 1 })
        .eq('ip_address', clientHash)
        .eq('usage_date', today);
      
      if (updateError) {
        console.error("Error updating usage:", updateError);
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('design_generation_usage')
        .insert({ ip_address: clientHash, usage_date: today, generation_count: 1 });
      
      if (insertError) {
        console.error("Error inserting usage:", insertError);
      }
    }

    const remaining = DAILY_LIMIT - (currentCount + 1);

    const responsePayload: Record<string, unknown> = { 
      imageUrl: generatedImageUrl,
      description: textResponse,
      remaining: remaining,
    };

    if (layoutCheckResult && !layoutCheckResult.ok) {
      responsePayload.layoutWarning = true;
      responsePayload.layoutFailureReasons = layoutCheckResult.reasons;
    }
    if (layoutCheckResult?.changeTooSubtle) {
      responsePayload.changeTooSubtle = true;
    }

    return new Response(
      JSON.stringify(responsePayload),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-design function:', error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
