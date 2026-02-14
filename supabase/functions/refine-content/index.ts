import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCorsHeaders,
  jsonResponse,
  requireAdminUser,
  requireJsonBody,
  requireMethod,
  rejectDisallowedOrigin,
} from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  const methodResponse = requireMethod(req, ["POST", "OPTIONS"]);
  if (methodResponse) return methodResponse;

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const originBlock = rejectDisallowedOrigin(req);
  if (originBlock) return originBlock;

  try {
    const adminResult = await requireAdminUser(req);
    if ("response" in adminResult) {
      return adminResult.response;
    }

    const bodyResult = await requireJsonBody<{
      content?: string;
      action?: string;
      customPrompt?: string;
      fieldName?: string;
    }>(req, 80_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }

    const { content, action, customPrompt, fieldName } = bodyResult.data;

    if (!content || !action) {
      return jsonResponse(req, 400, { error: "Content and action are required" });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return jsonResponse(req, 500, { error: "AI service not configured" });
    }

    // Build the refinement instruction based on action
    let instruction = '';
    switch (action) {
      case 'rewrite':
        instruction = 'Rewrite this text with fresh phrasing while keeping the same meaning and lifestyle-focused tone.';
        break;
      case 'shorten':
        instruction = 'Make this text more concise. Cut unnecessary words while keeping the core message and lifestyle-focused tone.';
        break;
      case 'lengthen':
        instruction = 'Expand this text with more detail and depth, adding relevant context about the lived experience while maintaining the lifestyle-focused tone.';
        break;
      case 'lighter':
        instruction = 'Make this text feel lighter and more conversational. Soften any formal language while keeping the lifestyle-focused message.';
        break;
      case 'custom':
        instruction = customPrompt || 'Improve this text.';
        break;
      default:
        instruction = 'Improve this text.';
    }

    const prompt = `You are refining copy for Concept Design Construct, a Gold Coast renovation company focused on lifestyle enhancement.

VOICE GUIDELINES:
- Write about how the home FEELS to live in, not just how it looks
- Focus on daily life: smoother mornings, easier movement, calmer spaces
- Use warm, human language-never clinical or salesy
- Short, grounded sentences. Conversational but considered.

FIELD: ${fieldName}
CURRENT TEXT:
${content}

INSTRUCTION: ${instruction}

Return ONLY the refined text. No explanations, no quotes, just the improved copy.`;

    console.log('Refining content:', { action, fieldName });

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${geminiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a copywriter refining renovation project content. Return only the refined text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      return jsonResponse(req, 500, { error: "AI service error" });
    }

    const data = await response.json();
    const refinedContent = data.choices[0]?.message?.content?.trim();

    if (!refinedContent) {
      return jsonResponse(req, 500, { error: "No content generated" });
    }

    console.log('Content refined successfully');

    return jsonResponse(req, 200, { content: refinedContent });

  } catch (error) {
    console.error('Error in refine-content:', error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
