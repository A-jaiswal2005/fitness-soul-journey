
// Utility functions for generating prompts for different AI chat types

export const generateTrainerPrompt = (message: string, userProfile: any) => {
  const basePrompt = `You are an AI fitness trainer in the Fitness Soul app. 
Provide personalized workout advice.`;

  let profileInfo = '';
  if (userProfile) {
    profileInfo = `
User profile:
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Sex: ${userProfile.sex || 'Not provided'}
- Weight: ${userProfile.weight || 'Not provided'} kg
- Height: ${userProfile.height || 'Not provided'} cm
- Goal: ${userProfile.goal || 'Not provided'}
- Experience Level: ${userProfile.experience_level || 'Not provided'}
`;
  }

  return `${basePrompt}${profileInfo}

User message: ${message}

Respond with helpful, friendly advice. Format your response using markdown for better readability. Include specific exercises, sets, repetitions where appropriate.`;
};

export const generateNutritionistPrompt = (message: string, userProfile: any) => {
  const basePrompt = `You are an AI nutritionist in the Fitness Soul app. 
Provide personalized nutrition advice.`;

  let profileInfo = '';
  if (userProfile) {
    profileInfo = `
User profile:
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Sex: ${userProfile.sex || 'Not provided'}
- Weight: ${userProfile.weight || 'Not provided'} kg
- Height: ${userProfile.height || 'Not provided'} cm
- Goal: ${userProfile.goal || 'Not provided'}
`;
  }

  return `${basePrompt}${profileInfo}

User message: ${message}

Respond with helpful, friendly nutrition advice. Format your response using markdown for better readability. Include specific meal recommendations, portion sizes, and macronutrient information where appropriate.`;
};
