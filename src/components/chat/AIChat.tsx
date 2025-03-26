
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useAIChat } from "@/hooks/useAIChat";

interface AIChatProps {
  title: string;
  apiKey: string;
  generatePrompt: (message: string, userProfile?: any) => string;
  chatType: 'trainer' | 'nutritionist';
  avatarFallback: string;
  welcomeMessage?: string;
}

export const AIChat = ({
  title,
  apiKey,
  generatePrompt,
  chatType,
  avatarFallback,
  welcomeMessage
}: AIChatProps) => {
  const {
    messages,
    userInput,
    setUserInput,
    isLoading,
    sendMessage,
    bottomRef,
    userProfile
  } = useAIChat({ apiKey, generatePrompt, chatType });

  return (
    <div className="w-full max-w-3xl mx-auto h-full flex flex-col">
      <Card className="flex flex-col h-full shadow-none rounded-none md:rounded-lg md:shadow-sm">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1">
            <div className="flex flex-col divide-y">
              {welcomeMessage && (
                <ChatMessage 
                  message={{ role: 'assistant', content: welcomeMessage }} 
                  avatarFallback={avatarFallback} 
                />
              )}
              
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  avatarFallback={avatarFallback} 
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {avatarFallback}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{avatarFallback}</div>
                    <div className="text-sm text-muted-foreground animate-pulse">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSend={() => sendMessage()}
            isLoading={isLoading}
            placeholder={`Ask the ${chatType === 'trainer' ? 'trainer' : 'nutritionist'} a question...`}
          />
        </CardContent>
      </Card>
    </div>
  );
};
