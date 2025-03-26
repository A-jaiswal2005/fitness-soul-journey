
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the Gemini API key from environment variables
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Gemini API key in environment variables' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { userMessage, role } = await req.json();
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing user message in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine the system prompt based on the role
    let systemPrompt = '';
    if (role === 'trainer') {
      systemPrompt = 'You are an expert fitness trainer providing advice on workouts, exercises, form, and fitness routines. Be supportive and encouraging while providing accurate, personalized fitness guidance. Focus on safety and proper technique.';
    } else if (role === 'nutritionist') {
      systemPrompt = 'You are an expert nutritionist providing advice on meal planning, nutrition, healthy eating, and dietary choices. Provide evidence-based nutritional guidance while being supportive and helpful. Tailor your advice to the person\'s goals.';
    } else {
      systemPrompt = 'You are a helpful assistant providing fitness and nutrition advice.';
    }

    // Make a request to the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    const data = await response.json();
    
    // Extract the text from the Gemini API response
    let aiResponse = '';
    try {
      // Navigate through the response structure to extract the text
      aiResponse = data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error parsing Gemini API response:', error);
      console.error('Received data:', JSON.stringify(data));
      aiResponse = 'I apologize, but I couldn\'t process your request at the moment. Please try again later.';
    }

    return new Response(
      JSON.stringify({ reply: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
