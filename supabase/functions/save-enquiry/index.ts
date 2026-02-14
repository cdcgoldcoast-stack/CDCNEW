import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCorsHeaders,
  createServiceClient,
  enforceRateLimit,
  jsonResponse,
  requireJsonBody,
  requireMethod,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

interface EnquiryRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  suburb?: string | null;
  postcode?: string | null;
  renovations?: string[];
  budget?: string | null;
  timeline?: string | null;
  source?: string | null;
  website?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\-\s]{6,20}$/;
const POSTCODE_REGEX = /^\d{4}$/;

function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizeRenovations(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const cleaned = item.trim().toLowerCase().slice(0, 60);
    if (cleaned) result.push(cleaned);
    if (result.length >= 12) break;
  }

  return Array.from(new Set(result));
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
      endpoint: "save-enquiry",
      limit: 5,
      windowSeconds: 3600,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Too many quote requests. Please try again later.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "3600" },
      );
    }

    const bodyResult = await requireJsonBody<EnquiryRequest>(req, 200_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const body = bodyResult.data;

    // Honeypot: bots often fill hidden fields.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonResponse(req, 200, { success: true });
    }

    const fullName = sanitizeString(body.fullName, 120);
    const email = sanitizeString(body.email, 320).toLowerCase();
    const phone = sanitizeString(body.phone, 32);
    const suburb = sanitizeString(body.suburb, 120);
    const postcode = sanitizeString(body.postcode, 10);
    const budget = sanitizeString(body.budget, 60);
    const timeline = sanitizeString(body.timeline, 80);
    const source = sanitizeString(body.source, 50) || "website";
    const renovations = normalizeRenovations(body.renovations);

    if (fullName.length < 2) {
      return jsonResponse(req, 400, { error: "Please provide your full name." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return jsonResponse(req, 400, { error: "Please provide a valid email address." });
    }

    if (!PHONE_REGEX.test(phone)) {
      return jsonResponse(req, 400, { error: "Please provide a valid phone number." });
    }

    if (!suburb && !postcode) {
      return jsonResponse(req, 400, { error: "Please provide either suburb or postcode." });
    }

    if (postcode && !POSTCODE_REGEX.test(postcode)) {
      return jsonResponse(req, 400, { error: "Please provide a valid postcode." });
    }

    if (renovations.length === 0) {
      return jsonResponse(req, 400, { error: "Please choose at least one renovation type." });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        full_name: fullName,
        email,
        phone,
        suburb: suburb || null,
        postcode: postcode || null,
        renovations,
        budget: budget || null,
        timeline: timeline || null,
        source,
      })
      .select("id")
      .single();

    if (error) {
      console.error("save-enquiry insert failed:", error);
      return jsonResponse(req, 500, { error: "Failed to save enquiry." });
    }

    return jsonResponse(req, 200, { success: true, id: data.id });
  } catch (error) {
    console.error("save-enquiry error:", error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
