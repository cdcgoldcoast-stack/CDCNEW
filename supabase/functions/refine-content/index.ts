import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { content, action, customPrompt, fieldName } = await req.json();

    if (!content || !action) {
      return new Response(
        JSON.stringify({ error: 'Content and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    const prompt = `You are refining copy for Flow Home Studio, a Gold Coast renovation company focused on lifestyle enhancement.

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
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const refinedContent = data.choices[0]?.message?.content?.trim();

    if (!refinedContent) {
      return new Response(
        JSON.stringify({ error: 'No content generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Content refined successfully');

    return new Response(
      JSON.stringify({ content: refinedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in refine-content:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
