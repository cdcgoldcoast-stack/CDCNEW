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

  // Handle CORS preflight requests
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

    // Parse request body
    const bodyResult = await requireJsonBody<{ description?: string; projectName?: string }>(req, 80_000);
    if ("response" in bodyResult) {
      return bodyResult.response;
    }
    const { description, projectName } = bodyResult.data;

    if (!description) {
      return jsonResponse(req, 400, { error: "Description is required" });
    }

    console.log('Generating content for project:', projectName);
    console.log('Description:', description);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      return jsonResponse(req, 500, { error: "AI service not configured" });
    }

    const prompt = `You are a copywriter for Concept Design Construct, a Gold Coast renovation company focused on lifestyle enhancement through renovation.

VOICE & TONE GUIDELINES:
- Write about how the home FEELS to live in, not just how it looks
- Focus on daily life: smoother mornings, easier movement, calmer spaces, less clutter
- Use warm, human language-never clinical or salesy
- Speak to the experience of living, not the features of building
- Short, grounded sentences. Conversational but considered.
- Avoid jargon like "stunning transformation" or "dream home"
- Think: "What changed for the people living here?"

EXAMPLE PHRASES FROM OUR BRAND:
- "Life feels better when your home works better"
- "A renovation should improve your life, not take over life"
- "When it is done well, you stop noticing the house and simply enjoy living in it"
- "Lifestyle enhancement is the quiet improvement you feel every day"

Project Name: ${projectName || 'Renovation Project'}
Rough Description: ${description}

Generate content in JSON format with these three keys:

1. "overview": 2-3 sentences describing what changed and how the home now supports daily life. Focus on flow, comfort, and how it feels to live there. (50-80 words)

2. "challenge": Describe what wasn't working before-how the old layout or design made daily life harder, less comfortable, or more stressful. Frame it around lived experience. (40-70 words)

3. "solution": Explain how the renovation addressed those challenges. Focus on the practical and emotional improvements-how the space now supports the way the owners actually live. (50-80 words)

Return ONLY valid JSON with these three keys. No markdown, no code blocks, just the JSON object.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${geminiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a professional renovation copywriter. Always respond with valid JSON only, no markdown formatting.' },
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
    console.log('AI response received');

    const content = data.choices[0]?.message?.content;
    if (!content) {
      return jsonResponse(req, 500, { error: "No content generated" });
    }

    // Parse the JSON response
    let parsedContent;
    try {
      // Remove any potential markdown code block markers
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return jsonResponse(req, 500, { error: "Failed to parse AI response" });
    }

    console.log('Content generated successfully');

    return jsonResponse(req, 200, parsedContent);

  } catch (error) {
    console.error('Error in generate-project-content:', error);
    return jsonResponse(req, 500, { error: "Internal server error" });
  }
});
