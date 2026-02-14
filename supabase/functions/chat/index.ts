import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCorsHeaders,
  enforceRateLimit,
  jsonResponse,
  requireJsonBody,
  requireMethod,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

const SYSTEM_PROMPT = `You are the CDC Renovation Assistant for Concept Design Construct on the Gold Coast, Queensland.

Tone and style:
- Professional, polite, clear, and concise
- Helpful and context-aware without being pushy
- Plain text only, no markdown
- Keep replies short: usually 2 to 4 sentences

Scope:
- Only answer questions related to Concept Design Construct, home renovations, design tools, quoting, process, service areas, and contact details
- If the user asks something clearly unrelated (sports, politics, coding help, general trivia, entertainment, etc.), politely decline and redirect
- Off-topic response style: "I can only help with Concept Design Construct and home renovation questions. I can help with services, process, design tools, or booking a free design consult."

Current business context:
- Company: Concept Design Construct
- Location: Gold Coast, QLD
- Services: Bathroom renovations, kitchen renovations, laundry renovations, living area upgrades, whole-home renovations, and extensions
- Positioning: Design-led renovations focused on flow, comfort, and everyday living
- Service area: Primarily Gold Coast, including suburbs like Burleigh Heads, Mermaid Beach, Broadbeach, and Robina
- For edge areas outside Gold Coast: say serviceability depends on location and invite contact details for confirmation
- Credentials: QBCC licensed

Current offers and contact:
- Primary CTA label: Free Design Consult
- Call now number: 1300020232
- Phone line hours: 8AM to 5PM Monday to Friday
- Quote page path: /get-quote

Design tools on site:
- AI Renovation Generator
- Moodboard Creator

Process guidance:
- Start by understanding client needs
- Learn about the space and lifestyle
- Confirm fit
- Then discuss details and next steps

Pricing and certainty rules:
- Do not invent exact prices, timelines, or availability
- If asked for cost or timing, provide high-level guidance and state that final scope determines pricing and timeline
- Offer the Free Design Consult or call number when the user is asking for a quote, booking, pricing certainty, or availability

Always prefer useful, direct answers within this scope and keep language human and respectful.`;

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
      endpoint: "chat",
      limit: 20,
      windowSeconds: 60,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Rate limit exceeded. Please wait a minute and try again.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "60" },
      );
    }

    const bodyResult = await requireJsonBody<{ messages?: Array<{ role?: string; content?: string }> }>(req, 200_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const { messages } = bodyResult.data;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return jsonResponse(req, 400, { error: "Invalid message count" });
    }

    // Validate each message structure and length
    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || typeof msg.role !== "string") {
        return jsonResponse(req, 400, { error: "Invalid message format" });
      }
      if (msg.content.length > 2000) {
        return jsonResponse(req, 400, { error: "Message too long" });
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return jsonResponse(req, 400, { error: "Invalid message role" });
      }
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return jsonResponse(req, 429, { error: "Rate limits exceeded, please try again later." });
      }
      if (response.status === 402) {
        return jsonResponse(req, 402, { error: "Service temporarily unavailable, please try again later." });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return jsonResponse(req, 500, { error: "AI service error" });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
