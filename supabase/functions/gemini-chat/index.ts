
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

  // Set the fixed Gemini API key (the one provided by the user)
  const geminiApiKey = "AIzaSyBWu6GoGGTYUZpRJMIm6VIGwxtU-IGDxDk";
  
  try {
    const { userMessage, role, userProfile } = await req.json();
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing user message in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine the system prompt based on the role with enhanced instructions
    let systemPrompt = '';
    if (role === 'trainer') {
      systemPrompt = `You are an expert fitness trainer providing personalized workout advice based on this user profile:
Height: ${userProfile?.height || 'unknown'} cm
Weight: ${userProfile?.weight || 'unknown'} kg
Goal: ${userProfile?.goal || 'general fitness'}
Experience: ${userProfile?.experience_level || 'beginner'}
Injuries: ${userProfile?.injuries || 'none'}

When suggesting exercises, always provide a structured response with:
1. Name of exercise
2. Sets and reps
3. Clear instructions for proper form
4. Variations based on experience level
5. Information on which muscle groups are targeted

Be supportive and encouraging while prioritizing safety and proper technique.`;
    } else if (role === 'nutritionist') {
      systemPrompt = `You are an expert nutritionist providing personalized nutrition advice based on this user profile:
Height: ${userProfile?.height || 'unknown'} cm
Weight: ${userProfile?.weight || 'unknown'} kg
Goal: ${userProfile?.goal || 'general health'}
Dietary preference: ${userProfile?.food_preference || 'no specific preference'}
Allergies: ${userProfile?.allergies || 'none'}

When suggesting meals or nutrition plans, always provide a structured response with:
1. Clear meal names and portion sizes
2. Estimated calories and macronutrients (protein, carbs, fat)
3. Key ingredients and simple preparation instructions
4. How this supports their specific fitness goals
5. Alternative options for different preferences

Keep all suggestions aligned with their dietary preferences (vegetarian, non-vegetarian, or both).`;
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
