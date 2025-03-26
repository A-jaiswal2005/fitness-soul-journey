
import { AIChat } from "./chat/AIChat";
import { generateNutritionistPrompt } from "@/utils/promptGenerators";

const welcomeMessage = `
# Welcome to Your Personal AI Nutritionist!

I'm here to help you with:

- **Meal planning** based on your fitness goals
- **Nutritional guidance** for optimal performance
- **Dietary adjustments** to support your workouts
- **Macro and micronutrient** recommendations

What nutrition questions can I help you with today?
`;

export const NutritionistChat = () => {
  const GEMINI_API_KEY = "AIzaSyBWu6GoGGTYUZpRJMIm6VIGwxtU-IGDxDk"; // Usually would be from env vars
  
  return (
    <AIChat
      title="AI Nutritionist"
      apiKey={GEMINI_API_KEY}
      generatePrompt={generateNutritionistPrompt}
      chatType="nutritionist"
      avatarFallback="RD"
      welcomeMessage={welcomeMessage}
    />
  );
};

export default NutritionistChat;
