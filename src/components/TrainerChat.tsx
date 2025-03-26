
import { AIChat } from "./chat/AIChat";
import { generateTrainerPrompt } from "@/utils/promptGenerators";

const welcomeMessage = `
# Welcome to Your Personal AI Trainer!

I'm here to help you with:

- **Workout plans** tailored to your goals
- **Exercise techniques** and form guidance
- **Training schedules** that fit your lifestyle
- **Progress tracking** and adjustment recommendations

How can I assist with your fitness journey today?
`;

export const TrainerChat = () => {
  const GEMINI_API_KEY = "AIzaSyBWu6GoGGTYUZpRJMIm6VIGwxtU-IGDxDk"; // Usually would be from env vars
  
  return (
    <AIChat
      title="AI Personal Trainer"
      apiKey={GEMINI_API_KEY}
      generatePrompt={generateTrainerPrompt}
      chatType="trainer"
      avatarFallback="PT"
      welcomeMessage={welcomeMessage}
    />
  );
};

export default TrainerChat;
