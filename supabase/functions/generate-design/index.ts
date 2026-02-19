import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  assessSuspiciousTraffic,
  buildCorsHeaders,
  createServiceClient,
  enforceRateLimit,
  getClientHash,
  jsonResponse,
  requireJsonBody,
  requireMethod,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function getAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

const DAILY_LIMIT = Number(Deno.env.get("DESIGN_DAILY_LIMIT") ?? "8");
const BURST_LIMIT = Number(Deno.env.get("DESIGN_BURST_LIMIT") ?? "4");
const BURST_WINDOW_SECONDS = Number(Deno.env.get("DESIGN_BURST_WINDOW_SECONDS") ?? "900");
const SUSPICIOUS_LIMIT = Number(Deno.env.get("DESIGN_SUSPICIOUS_LIMIT") ?? "2");
const SUSPICIOUS_WINDOW_SECONDS = Number(Deno.env.get("DESIGN_SUSPICIOUS_WINDOW_SECONDS") ?? "3600");
const AI_MODEL = Deno.env.get("GEMINI_IMAGE_MODEL") ?? "gemini-3-pro-image-preview";
const AI_MAX_ATTEMPTS = Math.max(1, Number(Deno.env.get("DESIGN_AI_MAX_ATTEMPTS") ?? "4"));
const AI_REQUEST_TIMEOUT_MS = Math.max(20_000, Number(Deno.env.get("DESIGN_AI_TIMEOUT_MS") ?? "70_000"));

type DesignErrorCode =
  | "BUSY"
  | "LIMIT_REACHED"
  | "INVALID_INPUT"
  | "IMAGE_UNCLEAR"
  | "UPSTREAM_BLOCKED"
  | "CONFIG_ERROR"
  | "UNKNOWN";

type SpaceType = "bathroom" | "kitchen" | "laundry" | "open-plan";

interface GeminiErrorEnvelope {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

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
  clientRequestId?: string;
}

interface NormalizedGatewayError {
  code: DesignErrorCode;
  error: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  status: number;
}

interface GatewaySuccess {
  ok: true;
  rawData: unknown;
  attempts: number;
}

interface GatewayFailure {
  ok: false;
  attempts: number;
  issue: NormalizedGatewayError;
}

type GatewayResult = GatewaySuccess | GatewayFailure;

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

const COMPLETION_FIRST_RETRY_SUFFIX = `

RETRY MODE - COMPLETION FIRST:
- Produce a finished renovation preview for this same room photo.
- Keep the room clearly recognizable and preserve major structure.
- Prioritize a usable final image over strict refusal.
- Keep doors, windows, and key fixtures in broadly the same positions.
- Make renovation changes visibly stronger than a subtle color tweak.
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

function buildRequestId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

function buildStylePrompt(
  spaceLabel: string,
  designStyle: string,
  colorTone: string | null,
  materialFeel: string | null,
  fixtureFinish: string | null,
  dimensionConstraint: string,
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

function normalizeSpaceType(rawSpaceType: string): SpaceType | null {
  if (rawSpaceType === "living-open-plan") return "open-plan";
  if (["bathroom", "kitchen", "laundry", "open-plan"].includes(rawSpaceType)) {
    return rawSpaceType as SpaceType;
  }
  return null;
}

function sanitizePrompt(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseGeminiErrorEnvelope(raw: string): GeminiErrorEnvelope | null {
  if (!raw || !raw.trim().startsWith("{")) return null;
  try {
    return JSON.parse(raw) as GeminiErrorEnvelope;
  } catch {
    return null;
  }
}

function classifyUpstreamError(status: number, parsedError: GeminiErrorEnvelope | null): NormalizedGatewayError {
  const upstreamStatus = `${parsedError?.error?.status || ""}`;

  if (status === 429) {
    return {
      status,
      code: "BUSY",
      error: "AI is currently busy with high demand. Please try again shortly.",
      retryable: true,
      retryAfterSeconds: 45,
    };
  }

  if (status === 402) {
    return {
      status,
      code: "CONFIG_ERROR",
      error: "AI service is currently unavailable due to account limits.",
      retryable: false,
    };
  }

  if (
    [500, 502, 503, 504].includes(status) ||
    ["UNAVAILABLE", "RESOURCE_EXHAUSTED", "DEADLINE_EXCEEDED", "INTERNAL"].includes(upstreamStatus)
  ) {
    return {
      status,
      code: "BUSY",
      error: "AI service is temporarily unavailable. Please try again in about a minute.",
      retryable: true,
      retryAfterSeconds: 60,
    };
  }

  return {
    status,
    code: "UNKNOWN",
    error: "AI service returned an unexpected response.",
    retryable: false,
  };
}

function shouldRetryGatewayIssue(issue: NormalizedGatewayError): boolean {
  return issue.retryable && issue.code === "BUSY";
}

function buildBackoffMs(attempt: number): number {
  const base = [700, 1500, 2800, 4500][Math.min(attempt - 1, 3)] ?? 4500;
  const jitter = Math.floor(Math.random() * 250);
  return base + jitter;
}

function normalizeDimension(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded <= 0 || rounded > 12_000) return null;
  return rounded;
}

function normalizeGatewayError(status: number, parsedError: GeminiErrorEnvelope | null): NormalizedGatewayError {
  return classifyUpstreamError(status, parsedError);
}

function errorResponse(
  req: Request,
  status: number,
  requestId: string,
  code: DesignErrorCode,
  error: string,
  options: {
    retryable?: boolean;
    retryAfterSeconds?: number;
    remaining?: number;
    limitReached?: boolean;
    needClearerPhoto?: boolean;
    reason?: string;
  } = {},
): Response {
  const retryable = options.retryable ?? false;
  const retryAfterSeconds = options.retryAfterSeconds;

  const headers: Record<string, string> = {};
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    headers["Retry-After"] = String(retryAfterSeconds);
  }

  return jsonResponse(
    req,
    status,
    {
      ok: false,
      requestId,
      code,
      error,
      retryable,
      retryAfterSeconds,
      remaining: options.remaining,
      limitReached: options.limitReached ?? code === "LIMIT_REACHED",
      needClearerPhoto: options.needClearerPhoto ?? code === "IMAGE_UNCLEAR",
      reason: options.reason,
    },
    headers,
  );
}

function successResponse(
  req: Request,
  payload: {
    requestId: string;
    imageUrl: string;
    description: string;
    remaining: number;
    degraded: boolean;
  },
): Response {
  return jsonResponse(req, 200, {
    ok: true,
    requestId: payload.requestId,
    imageUrl: payload.imageUrl,
    description: payload.description,
    remaining: payload.remaining,
    degraded: payload.degraded,
  });
}

function buildGeminiRequestBody(args: {
  systemPrompt: string;
  userPrompt: string;
  mimeType: string;
  base64Data: string;
}): string {
  return JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [
          { text: `${args.systemPrompt}\n\n${args.userPrompt}` },
          {
            inlineData: {
              mimeType: args.mimeType,
              data: args.base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });
}

async function callGeminiWithRetries(args: {
  endpoint: string;
  requestBody: string;
  requestId: string;
  maxAttempts: number;
  timeoutMs: number;
  requestLabel: "primary" | "salvage";
}): Promise<GatewayResult> {
  let lastIssue: NormalizedGatewayError = {
    status: 503,
    code: "BUSY",
    error: "AI service is temporarily unavailable.",
    retryable: true,
    retryAfterSeconds: 45,
  };

  for (let attempt = 1; attempt <= args.maxAttempts; attempt += 1) {
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => abortController.abort(), args.timeoutMs);

    try {
      const response = await fetch(args.endpoint, {
        method: "POST",
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: args.requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const parsedError = parseGeminiErrorEnvelope(errorText);
        const issue = normalizeGatewayError(response.status, parsedError);
        lastIssue = issue;

        console.error("generate-design gateway error", {
          requestId: args.requestId,
          requestLabel: args.requestLabel,
          attempt,
          maxAttempts: args.maxAttempts,
          status: response.status,
          issueCode: issue.code,
          retryable: issue.retryable,
          upstreamStatus: parsedError?.error?.status ?? null,
          upstreamCode: parsedError?.error?.code ?? null,
          upstreamMessage: (parsedError?.error?.message || errorText || "").slice(0, 240),
        });

        if (attempt < args.maxAttempts && shouldRetryGatewayIssue(issue)) {
          await sleep(buildBackoffMs(attempt));
          continue;
        }

        return { ok: false, attempts: attempt, issue };
      }

      let rawData: unknown;
      try {
        rawData = await response.json();
      } catch (parseError) {
        console.error("generate-design gateway returned non-json", {
          requestId: args.requestId,
          requestLabel: args.requestLabel,
          attempt,
          error: parseError instanceof Error ? parseError.message : String(parseError),
        });

        lastIssue = {
          status: 502,
          code: "BUSY",
          error: "AI returned an unexpected response. Please try again shortly.",
          retryable: true,
          retryAfterSeconds: 45,
        };

        if (attempt < args.maxAttempts) {
          await sleep(buildBackoffMs(attempt));
          continue;
        }

        return { ok: false, attempts: attempt, issue: lastIssue };
      }

      return { ok: true, attempts: attempt, rawData };
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === "AbortError";
      lastIssue = isTimeout
        ? {
            status: 503,
            code: "BUSY",
            error: "AI is taking longer than expected right now. Please try again in about a minute.",
            retryable: true,
            retryAfterSeconds: 60,
          }
        : {
            status: 503,
            code: "BUSY",
            error: "Could not reach the AI service right now. Please try again shortly.",
            retryable: true,
            retryAfterSeconds: 45,
          };

      console.error("generate-design gateway request failed", {
        requestId: args.requestId,
        requestLabel: args.requestLabel,
        attempt,
        maxAttempts: args.maxAttempts,
        isTimeout,
        error: error instanceof Error ? error.message : String(error),
      });

      if (attempt < args.maxAttempts) {
        await sleep(buildBackoffMs(attempt));
        continue;
      }

      return { ok: false, attempts: attempt, issue: lastIssue };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  return { ok: false, attempts: args.maxAttempts, issue: lastIssue };
}

function parseGeminiGeneration(rawData: unknown): {
  imageUrl: string | null;
  textResponse: string;
  needClearerPhoto: boolean;
  clearerPhotoReason: string | null;
  blockedReason: string | null;
} {
  const data = rawData as {
    candidates?: Array<{
      finishReason?: string;
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: {
            mimeType?: string;
            data?: string;
          };
        }>;
      };
    }>;
    promptFeedback?: {
      blockReason?: string;
    };
  };

  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];

  if (candidates.length === 0) {
    return {
      imageUrl: null,
      textResponse: "",
      needClearerPhoto: false,
      clearerPhotoReason: null,
      blockedReason: data?.promptFeedback?.blockReason || "no_candidates",
    };
  }

  const finishReason = `${candidates[0]?.finishReason || ""}`;
  if (finishReason === "SAFETY" || finishReason === "RECITATION") {
    return {
      imageUrl: null,
      textResponse: "",
      needClearerPhoto: false,
      clearerPhotoReason: null,
      blockedReason: finishReason,
    };
  }

  const parts = Array.isArray(candidates[0]?.content?.parts) ? candidates[0].content?.parts ?? [] : [];

  let textResponse = "";
  let generatedImageUrl: string | null = null;

  for (const part of parts) {
    if (typeof part?.text === "string") {
      textResponse += part.text;
    }

    if (typeof part?.inlineData?.data === "string" && typeof part?.inlineData?.mimeType === "string") {
      generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  const normalizedText = textResponse.trim();
  const needsClearer = normalizedText.toUpperCase().startsWith("NEED_CLEARER_PHOTO");

  return {
    imageUrl: generatedImageUrl,
    textResponse,
    needClearerPhoto: needsClearer,
    clearerPhotoReason: needsClearer
      ? normalizedText.replace(/^NEED_CLEARER_PHOTO:/i, "").trim() || null
      : null,
    blockedReason: null,
  };
}

function shouldApplySuspiciousGate(assessment: { score: number; reasons: string[] }): boolean {
  if (assessment.score >= 6) return true;
  return assessment.score >= 4 && assessment.reasons.includes("automation_user_agent");
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  const requestId = buildRequestId();

  const methodResponse = requireMethod(req, ["POST", "OPTIONS"]);
  if (methodResponse) return methodResponse;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const clientHash = await getClientHash(req);
    const suspiciousTraffic = assessSuspiciousTraffic(req);

    if (shouldApplySuspiciousGate(suspiciousTraffic)) {
      console.warn("Suspicious generate-design traffic detected", {
        requestId,
        score: suspiciousTraffic.score,
        reasons: suspiciousTraffic.reasons,
        clientHashPrefix: clientHash.slice(0, 12),
      });

      try {
        const suspiciousRateLimit = await enforceRateLimit({
          req,
          endpoint: "generate-design-suspicious",
          limit: SUSPICIOUS_LIMIT,
          windowSeconds: SUSPICIOUS_WINDOW_SECONDS,
          clientHash,
        });

        if (!suspiciousRateLimit.allowed) {
          return errorResponse(req, 429, requestId, "BUSY", "Suspicious traffic limit reached. Please wait and try again later.", {
            retryable: true,
            retryAfterSeconds: SUSPICIOUS_WINDOW_SECONDS,
            remaining: suspiciousRateLimit.remaining,
          });
        }
      } catch (rateError) {
        console.error("Rate limit check failed (suspicious). Continuing.", {
          requestId,
          error: rateError instanceof Error ? rateError.message : String(rateError),
        });
      }
    }

    try {
      const burstRateLimit = await enforceRateLimit({
        req,
        endpoint: "generate-design",
        limit: BURST_LIMIT,
        windowSeconds: BURST_WINDOW_SECONDS,
        clientHash,
      });

      if (!burstRateLimit.allowed) {
        return errorResponse(req, 429, requestId, "BUSY", "Too many generation attempts. Please wait and try again.", {
          retryable: true,
          retryAfterSeconds: BURST_WINDOW_SECONDS,
          remaining: burstRateLimit.remaining,
        });
      }
    } catch (rateError) {
      console.error("Rate limit check failed (burst). Continuing.", {
        requestId,
        error: rateError instanceof Error ? rateError.message : String(rateError),
      });
    }

    const supabase = createServiceClient();
    const today = new Date().toISOString().split("T")[0];

    let usageData: { generation_count?: number } | null = null;
    let currentCount = 0;

    try {
      const usageResult = await supabase
        .from("design_generation_usage")
        .select("generation_count")
        .eq("ip_address", clientHash)
        .eq("usage_date", today)
        .maybeSingle();

      if (!usageResult.error) {
        usageData = usageResult.data;
        currentCount = usageData?.generation_count || 0;
      } else {
        console.error("Error checking usage. Continuing without hard usage gate", {
          requestId,
          error: usageResult.error.message,
        });
      }
    } catch (usageError) {
      console.error("Usage query failed unexpectedly. Continuing without hard usage gate", {
        requestId,
        error: usageError instanceof Error ? usageError.message : String(usageError),
      });
    }

    if (currentCount >= DAILY_LIMIT) {
      return errorResponse(
        req,
        429,
        requestId,
        "LIMIT_REACHED",
        `Daily limit reached. You can generate up to ${DAILY_LIMIT} designs per day. Please try again tomorrow.`,
        {
          retryable: false,
          remaining: 0,
          limitReached: true,
        },
      );
    }

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
      clientRequestId,
    } = bodyResult.data;

    const safeClientRequestId = typeof clientRequestId === "string" ? clientRequestId.trim().slice(0, 80) : "";

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return errorResponse(req, 400, requestId, "INVALID_INPUT", "Please upload an image", { retryable: false });
    }

    if (imageBase64.length > 16_000_000) {
      return errorResponse(req, 413, requestId, "INVALID_INPUT", "Image is too large. Please upload a smaller file.", {
        retryable: false,
      });
    }

    if (!spaceType || typeof spaceType !== "string") {
      return errorResponse(req, 400, requestId, "INVALID_INPUT", "Please select a space type", { retryable: false });
    }

    const normalizedSpaceType = normalizeSpaceType(spaceType);
    if (!normalizedSpaceType) {
      return errorResponse(req, 400, requestId, "INVALID_INPUT", "Invalid space type selected", { retryable: false });
    }

    const trimmedPrompt = sanitizePrompt(prompt);
    if (trimmedPrompt.length > 2000) {
      return errorResponse(req, 400, requestId, "INVALID_INPUT", "Prompt is too long", { retryable: false });
    }

    if (!trimmedPrompt && !designStyle) {
      return errorResponse(req, 400, requestId, "INVALID_INPUT", "Please add your design preferences", { retryable: false });
    }

    const normalizedWidth = normalizeDimension(imageWidth);
    const normalizedHeight = normalizeDimension(imageHeight);
    const dimensionConstraint =
      normalizedWidth && normalizedHeight ? buildDimensionConstraint(normalizedWidth, normalizedHeight) : "";

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return errorResponse(req, 500, requestId, "CONFIG_ERROR", "AI service key is missing on the server.", {
        retryable: false,
      });
    }

    const spaceLabel = normalizedSpaceType.replace("-", " ");
    const basePrompt = designStyle
      ? buildStylePrompt(spaceLabel, designStyle, colorTone || null, materialFeel || null, fixtureFinish || null, dimensionConstraint)
      : buildDescribePrompt(spaceLabel, trimmedPrompt, dimensionConstraint);

    const primaryPrompt = `${basePrompt}${STRICT_LAYOUT_SUFFIX}${STRONG_RENOVATION_SUFFIX}`;
    const salvagePrompt = `${basePrompt}${STRONG_RENOVATION_SUFFIX}${COMPLETION_FIRST_RETRY_SUFFIX}`;

    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const mimeMatch = imageBase64.match(/^data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    console.log("generate-design started", {
      requestId,
      clientRequestId: safeClientRequestId || null,
      clientHashPrefix: clientHash.slice(0, 12),
      spaceType: normalizedSpaceType,
      promptLength: trimmedPrompt.length,
      hasDesignStyle: Boolean(designStyle),
      imageDimensions:
        normalizedWidth && normalizedHeight ? `${normalizedWidth}x${normalizedHeight}` : "unknown",
    });

    const primaryResult = await callGeminiWithRetries({
      endpoint,
      requestBody: buildGeminiRequestBody({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: primaryPrompt,
        mimeType,
        base64Data,
      }),
      requestId,
      maxAttempts: AI_MAX_ATTEMPTS,
      timeoutMs: AI_REQUEST_TIMEOUT_MS,
      requestLabel: "primary",
    });

    if (!primaryResult.ok) {
      return errorResponse(
        req,
        primaryResult.issue.status,
        requestId,
        primaryResult.issue.code,
        primaryResult.issue.error,
        {
          retryable: primaryResult.issue.retryable,
          retryAfterSeconds: primaryResult.issue.retryAfterSeconds,
        },
      );
    }

    let parsed = parseGeminiGeneration(primaryResult.rawData);
    let degraded = false;

    if (parsed.needClearerPhoto) {
      return errorResponse(req, 400, requestId, "IMAGE_UNCLEAR", "Please upload a clearer photo that shows full room boundaries.", {
        retryable: true,
        needClearerPhoto: true,
        reason: parsed.clearerPhotoReason || undefined,
      });
    }

    if (parsed.blockedReason) {
      return errorResponse(
        req,
        422,
        requestId,
        "UPSTREAM_BLOCKED",
        `The AI could not process this image (blocked: ${parsed.blockedReason}). Try a different photo.`,
        { retryable: false },
      );
    }

    if (!parsed.imageUrl) {
      const salvageResult = await callGeminiWithRetries({
        endpoint,
        requestBody: buildGeminiRequestBody({
          systemPrompt: SYSTEM_PROMPT,
          userPrompt: salvagePrompt,
          mimeType,
          base64Data,
        }),
        requestId,
        maxAttempts: Math.min(2, AI_MAX_ATTEMPTS),
        timeoutMs: AI_REQUEST_TIMEOUT_MS,
        requestLabel: "salvage",
      });

      if (!salvageResult.ok) {
        return errorResponse(
          req,
          salvageResult.issue.status,
          requestId,
          salvageResult.issue.code,
          salvageResult.issue.error,
          {
            retryable: salvageResult.issue.retryable,
            retryAfterSeconds: salvageResult.issue.retryAfterSeconds,
          },
        );
      }

      const salvageParsed = parseGeminiGeneration(salvageResult.rawData);

      if (salvageParsed.needClearerPhoto) {
        return errorResponse(req, 400, requestId, "IMAGE_UNCLEAR", "Please upload a clearer photo that shows full room boundaries.", {
          retryable: true,
          needClearerPhoto: true,
          reason: salvageParsed.clearerPhotoReason || undefined,
        });
      }

      if (salvageParsed.blockedReason) {
        return errorResponse(
          req,
          422,
          requestId,
          "UPSTREAM_BLOCKED",
          `The AI could not process this image (blocked: ${salvageParsed.blockedReason}). Try a different photo.`,
          { retryable: false },
        );
      }

      if (!salvageParsed.imageUrl) {
        return errorResponse(
          req,
          503,
          requestId,
          "BUSY",
          "I could not generate a stable preview this time. Please try again in about a minute.",
          {
            retryable: true,
            retryAfterSeconds: 60,
          },
        );
      }

      parsed = salvageParsed;
      degraded = true;
    }

    if (!parsed.imageUrl) {
      return errorResponse(
        req,
        503,
        requestId,
        "BUSY",
        "I could not generate a preview right now. Please try again shortly.",
        { retryable: true, retryAfterSeconds: 45 },
      );
    }

    if (usageData) {
      const { error: updateError } = await supabase
        .from("design_generation_usage")
        .update({ generation_count: currentCount + 1 })
        .eq("ip_address", clientHash)
        .eq("usage_date", today);

      if (updateError) {
        console.error("Error updating usage", {
          requestId,
          error: updateError.message,
        });
      }
    } else {
      const { error: insertError } = await supabase
        .from("design_generation_usage")
        .insert({ ip_address: clientHash, usage_date: today, generation_count: 1 });

      if (insertError) {
        console.error("Error inserting usage", {
          requestId,
          error: insertError.message,
        });
      }
    }

    const remaining = Math.max(0, DAILY_LIMIT - (currentCount + 1));

    console.log("generate-design success", {
      requestId,
      clientRequestId: safeClientRequestId || null,
      remaining,
      degraded,
    });

    return successResponse(req, {
      requestId,
      imageUrl: parsed.imageUrl,
      description: parsed.textResponse,
      remaining,
      degraded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in generate-design function", {
      requestId,
      message,
    });

    if (/Supabase service configuration missing/i.test(message)) {
      return errorResponse(req, 500, requestId, "CONFIG_ERROR", "Server configuration is incomplete for AI generation.", {
        retryable: false,
      });
    }

    return errorResponse(
      req,
      503,
      requestId,
      "BUSY",
      "AI service is temporarily unavailable. Please try again in about a minute.",
      {
        retryable: true,
        retryAfterSeconds: 60,
      },
    );
  }
});
