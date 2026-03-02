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

interface ReferralRequest {
  affiliateName?: string;
  affiliateEmail?: string;
  affiliatePhone?: string;
  referralName?: string;
  referralPhone?: string;
  referralEmail?: string | null;
  referralSuburb?: string | null;
  source?: string | null;
  website?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\-\s]{6,20}$/;

function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
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
      endpoint: "save-referral",
      limit: 5,
      windowSeconds: 3600,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Too many referral submissions. Please try again later.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "3600" },
      );
    }

    const bodyResult = await requireJsonBody<ReferralRequest>(req, 200_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const body = bodyResult.data;

    // Honeypot: bots often fill hidden fields.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonResponse(req, 200, { success: true });
    }

    const affiliateName = sanitizeString(body.affiliateName, 120);
    const affiliateEmail = sanitizeString(body.affiliateEmail, 320).toLowerCase();
    const affiliatePhone = sanitizeString(body.affiliatePhone, 32);
    const referralName = sanitizeString(body.referralName, 120);
    const referralPhone = sanitizeString(body.referralPhone, 32);
    const referralEmail = sanitizeString(body.referralEmail, 320).toLowerCase();
    const referralSuburb = sanitizeString(body.referralSuburb, 120);
    const source = sanitizeString(body.source, 50) || "referral-form";

    if (affiliateName.length < 2) {
      return jsonResponse(req, 400, { error: "Please provide your full name." });
    }

    if (!EMAIL_REGEX.test(affiliateEmail)) {
      return jsonResponse(req, 400, { error: "Please provide a valid email address." });
    }

    if (!PHONE_REGEX.test(affiliatePhone)) {
      return jsonResponse(req, 400, { error: "Please provide a valid phone number." });
    }

    if (referralName.length < 2) {
      return jsonResponse(req, 400, { error: "Please provide the referral's name." });
    }

    if (!PHONE_REGEX.test(referralPhone)) {
      return jsonResponse(req, 400, { error: "Please provide a valid phone number for the referral." });
    }

    if (referralEmail && !EMAIL_REGEX.test(referralEmail)) {
      return jsonResponse(req, 400, { error: "Please provide a valid email for the referral." });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("referrals")
      .insert({
        affiliate_name: affiliateName,
        affiliate_email: affiliateEmail,
        affiliate_phone: affiliatePhone,
        referral_name: referralName,
        referral_phone: referralPhone,
        referral_email: referralEmail || null,
        referral_suburb: referralSuburb || null,
        source,
      })
      .select("id")
      .single();

    if (error) {
      console.error("save-referral insert failed:", error);
      return jsonResponse(req, 500, { error: "Failed to save referral." });
    }

    return jsonResponse(req, 200, { success: true, id: data.id });
  } catch (error) {
    console.error("save-referral error:", error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
