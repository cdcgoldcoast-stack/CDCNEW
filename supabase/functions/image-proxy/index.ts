import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCorsHeaders,
  enforceRateLimit,
  isAllowedImageHost,
  jsonResponse,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

const MAX_IMAGE_BYTES = Number(Deno.env.get("IMAGE_PROXY_MAX_BYTES") ?? `${15 * 1024 * 1024}`);

function parseTargetUrl(value: string | null): URL | null {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!isAllowedImageHost(parsed.hostname)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const rateLimit = await enforceRateLimit({
      req,
      endpoint: "image-proxy",
      limit: 120,
      windowSeconds: 300,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Rate limit exceeded. Please slow down and try again.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "300" },
      );
    }

    const { searchParams } = new URL(req.url);
    const targetUrl = parseTargetUrl(searchParams.get("url"));

    if (!targetUrl) {
      return jsonResponse(req, 400, { error: "Missing or invalid 'url'" });
    }

    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "FlowHomeStudio/1.0 (Moodboard Export)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!upstream.ok) {
      return jsonResponse(req, 502, { error: `Upstream error: ${upstream.status}` });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = Number(upstream.headers.get("content-length") ?? "0");

    if (!contentType.toLowerCase().startsWith("image/")) {
      return jsonResponse(req, 415, { error: "Upstream asset is not an image" });
    }

    if (contentLength > 0 && contentLength > MAX_IMAGE_BYTES) {
      return jsonResponse(req, 413, { error: "Image is too large to proxy" });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("image-proxy error:", message);
    return jsonResponse(req, 500, { error: message });
  }
});
