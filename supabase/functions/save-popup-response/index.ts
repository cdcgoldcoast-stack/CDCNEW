import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCorsHeaders,
  createServiceClient,
  enforceRateLimit,
  jsonResponse,
  rejectDisallowedOrigin,
  requireJsonBody,
  requireMethod,
} from "../_shared/security.ts";

interface PopupResponseRequest {
  name?: unknown;
  phone?: unknown;
  source?: unknown;
  pageUrl?: unknown;
  userAgent?: unknown;
  website?: unknown;
}

const PHONE_REGEX = /^[0-9+()\-\s]{6,20}$/;
const DUPLICATE_WINDOW_MINUTES = 30;

function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  const methodResponse = requireMethod(req, ["POST", "OPTIONS"]);
  if (methodResponse) return methodResponse;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const rateLimit = await enforceRateLimit({
      req,
      endpoint: "save-popup-response",
      limit: 5,
      windowSeconds: 3600,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Too many popup submissions. Please try again later.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "3600" },
      );
    }

    const bodyResult = await requireJsonBody<PopupResponseRequest>(req, 120_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const body = bodyResult.data;

    // Honeypot field: bots commonly fill hidden website inputs.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonResponse(req, 200, { success: true });
    }

    const name = sanitizeString(body.name, 120);
    const phone = sanitizeString(body.phone, 32);
    const source = sanitizeString(body.source, 50) || "promo_popup";
    const pageUrl = sanitizeString(body.pageUrl, 2048);
    const requestUserAgent = sanitizeString(req.headers.get("user-agent"), 512);
    const bodyUserAgent = sanitizeString(body.userAgent, 512);
    const userAgent = bodyUserAgent || requestUserAgent || null;

    if (name.length < 2) {
      return jsonResponse(req, 400, { error: "Please provide your name." });
    }

    if (!PHONE_REGEX.test(phone)) {
      return jsonResponse(req, 400, { error: "Please provide a valid phone number." });
    }

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length < 6) {
      return jsonResponse(req, 400, { error: "Please provide a valid phone number." });
    }

    const supabase = createServiceClient();

    const duplicateWindowStart = new Date(
      Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: recentRows, error: recentRowsError } = await supabase
      .from("popup_responses")
      .select("id, phone")
      .eq("source", source)
      .gte("created_at", duplicateWindowStart)
      .order("created_at", { ascending: false })
      .limit(30);

    if (recentRowsError) {
      console.error("save-popup-response duplicate lookup failed:", recentRowsError);
    }

    const duplicate = (recentRows ?? []).find((row) =>
      normalizePhone(String(row.phone ?? "")) === normalizedPhone
    );

    if (duplicate) {
      // Idempotent success response to prevent accidental repeated inserts.
      return jsonResponse(req, 200, {
        success: true,
        id: duplicate.id,
        deduped: true,
      });
    }

    const { data, error } = await supabase
      .from("popup_responses")
      .insert({
        name,
        phone,
        source,
        page_url: pageUrl || null,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error) {
      console.error("save-popup-response insert failed:", error);
      return jsonResponse(req, 500, { error: "Failed to save popup response." });
    }

    return jsonResponse(req, 200, {
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("save-popup-response error:", error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
