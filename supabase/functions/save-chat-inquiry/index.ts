import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildCorsHeaders,
  enforceRateLimit,
  jsonResponse,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const disallowedOriginResponse = rejectDisallowedOrigin(req);
  if (disallowedOriginResponse) return disallowedOriginResponse;

  try {
    const rateLimit = await enforceRateLimit({
      req,
      endpoint: "save-chat-inquiry",
      limit: 5,
      windowSeconds: 3600,
    });

    if (!rateLimit.allowed) {
      return jsonResponse(
        req,
        429,
        {
          error: "Too many inquiry submissions. Please try again later.",
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        { "Retry-After": "3600" },
      );
    }

    const {
      name,
      phone,
      email,
      additionalNotes,
      conversationHistory,
      contextSummary,
      website,
    } = await req.json();

    // Honeypot field: bots often fill hidden "website" fields.
    if (typeof website === "string" && website.trim()) {
      return jsonResponse(req, 200, { success: true });
    }

    if (!name || !phone) {
      return jsonResponse(req, 400, { error: "Name and phone are required" });
    }

    const cleanedName = String(name).trim();
    const cleanedPhone = String(phone).trim();
    const cleanedEmail = typeof email === "string" ? email.trim() : "";
    const cleanedNotes = typeof additionalNotes === "string" ? additionalNotes.trim() : "";
    const normalizedHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
    const normalizedSummary = typeof contextSummary === "string" ? contextSummary.trim() : "";

    if (cleanedName.length < 2 || cleanedName.length > 120) {
      return jsonResponse(req, 400, { error: "Invalid name" });
    }

    if (!/^[0-9+()\\-\\s]{6,20}$/.test(cleanedPhone)) {
      return jsonResponse(req, 400, { error: "Invalid phone number" });
    }

    if (cleanedEmail && (cleanedEmail.length > 320 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanedEmail))) {
      return jsonResponse(req, 400, { error: "Invalid email address" });
    }

    if (cleanedNotes.length > 3000) {
      return jsonResponse(req, 400, { error: "Additional notes are too long" });
    }

    if (normalizedHistory.length > 80) {
      return jsonResponse(req, 400, { error: "Conversation history is too long" });
    }

    for (const msg of normalizedHistory) {
      if (
        !msg ||
        typeof msg !== "object" ||
        typeof msg.role !== "string" ||
        typeof msg.content !== "string" ||
        msg.content.length > 2500
      ) {
        return jsonResponse(req, 400, { error: "Invalid conversation history format" });
      }
    }

    // Get AI to summarize the conversation
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    let conversationSummary = "";

    if (GEMINI_API_KEY && normalizedHistory.length > 0) {
      const summaryPrompt = `Summarize this customer chat conversation in 2-3 sentences, focusing on what they're interested in and any key details:

${normalizedHistory.map((m: { role: string; content: string }) => `${m.role === "user" ? "Customer" : "Assistant"}: ${m.content}`).join("\n")}`;

      try {
        const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemini-3-flash-preview",
            messages: [
              { role: "user", content: summaryPrompt }
            ],
            stream: false,
          }),
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          conversationSummary = data.choices?.[0]?.message?.content || "";
        }
      } catch (err) {
        console.error("Failed to generate summary:", err);
      }
    }

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("chat_inquiries")
      .insert({
        name: cleanedName,
        phone: cleanedPhone,
        email: cleanedEmail || null,
        additional_notes: cleanedNotes || null,
        conversation_summary: conversationSummary || normalizedSummary || null,
        conversation_history: normalizedHistory,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to save inquiry");
    }

    return jsonResponse(req, 200, { success: true, id: data.id });
  } catch (error) {
    console.error("Save inquiry error:", error);
    return jsonResponse(req, 500, { error: error instanceof Error ? error.message : "Unknown error" });
  }
});
