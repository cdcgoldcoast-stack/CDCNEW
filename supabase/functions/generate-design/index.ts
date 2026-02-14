import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
      designStyle,
      colorTone,
      materialFeel,
      fixtureFinish,
      imageWidth,
      imageHeight,
    } = bodyResult.data;

    console.log("Design generation request:", {
      spaceType,
      designStyle: designStyle || "N/A",
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

    if (!imageWidth || !imageHeight) {
      console.warn("Image dimensions not provided - orientation enforcement will be limited");
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Build the user prompt
    const spaceLabel = spaceType ? spaceType.replace("-", " ") : "space";
    const dimensionConstraint = imageWidth && imageHeight
      ? buildDimensionConstraint(imageWidth, imageHeight)
      : "";

    let userPrompt: string;
    if (designStyle) {
      userPrompt = buildStylePrompt(spaceLabel, designStyle, colorTone, materialFeel, fixtureFinish, dimensionConstraint);
    } else {
      userPrompt = buildDescribePrompt(spaceLabel, prompt, dimensionConstraint);
    }

    const promptText = `${userPrompt}${STRICT_LAYOUT_SUFFIX}${STRONG_RENOVATION_SUFFIX}`;
    console.log("Calling Gemini API...");

    // Strip data URL prefix to get raw base64 for Gemini native API
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const mimeMatch = imageBase64.match(/^data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const abortController = new AbortController();
    const fetchTimeout = setTimeout(() => abortController.abort(), 55_000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      signal: abortController.signal,
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
    clearTimeout(fetchTimeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return jsonResponse(req, 429, { error: "Rate limit exceeded. Please wait a moment and try again." });
      }
      if (response.status === 402) {
        return jsonResponse(req, 402, { error: "Usage limit reached. Please add credits to continue." });
      }

      return jsonResponse(req, 500, { error: `AI error ${response.status}: ${errorText.slice(0, 200)}` });
    }

    const rawData = await response.json();

    // Check for blocked or empty responses
    if (!rawData.candidates || rawData.candidates.length === 0) {
      const blockReason = rawData.promptFeedback?.blockReason || "unknown";
      console.error("Gemini returned no candidates. Block reason:", blockReason, JSON.stringify(rawData).slice(0, 500));
      return jsonResponse(req, 422, { error: `The AI could not process this image (blocked: ${blockReason}). Try a different photo.` });
    }

    const finishReason = rawData.candidates[0].finishReason;
    if (finishReason === "SAFETY" || finishReason === "RECITATION") {
      console.error("Gemini blocked response. Finish reason:", finishReason);
      return jsonResponse(req, 422, { error: "The AI flagged this image. Please try a different photo." });
    }

    // Extract text and image from response
    const parts = rawData.candidates[0]?.content?.parts || [];
    let textResponse = "";
    let generatedImageUrl = "";

    for (const part of parts) {
      if (part.text) {
        textResponse += part.text;
      }
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    console.log("AI response received");

    if (textResponse.startsWith("NEED_CLEARER_PHOTO")) {
      const reason = textResponse.replace("NEED_CLEARER_PHOTO:", "").trim();
      return jsonResponse(req, 400, {
        error: "Please upload a clearer photo that shows the full room boundaries.",
        reason,
        needClearerPhoto: true,
      });
    }

    if (!generatedImageUrl) {
      return jsonResponse(req, 422, {
        error: "The AI could not generate an image for this photo. Please try a different image or adjust your preferences.",
      });
    }

    // Update usage count after successful generation
    if (usageData) {
      const { error: updateError } = await supabase
        .from('design_generation_usage')
        .update({ generation_count: currentCount + 1 })
        .eq('ip_address', clientHash)
        .eq('usage_date', today);

      if (updateError) {
        console.error("Error updating usage:", updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('design_generation_usage')
        .insert({ ip_address: clientHash, usage_date: today, generation_count: 1 });

      if (insertError) {
        console.error("Error inserting usage:", insertError);
      }
    }

    const remaining = DAILY_LIMIT - (currentCount + 1);

    return new Response(
      JSON.stringify({
        imageUrl: generatedImageUrl,
        description: textResponse,
        remaining,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-design function:', error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
