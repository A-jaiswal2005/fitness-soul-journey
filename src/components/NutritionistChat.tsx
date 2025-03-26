
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Salad, SendIcon, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'nutritionist';
  timestamp: Date;
}

export const NutritionistChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI nutritionist. How can I help you with your meal planning and nutrition today?',
      sender: 'nutritionist',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [showApiInput, setShowApiInput] = useState(!apiKey);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // For now, let's simulate a response since we don't have the actual Gemini integration yet
      // In the real implementation, this would be replaced with an API call to the backend
      setTimeout(() => {
        const nutritionistResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(inputValue),
          sender: 'nutritionist',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nutritionistResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response from the nutritionist');
      setIsLoading(false);
    }
  };

  const generateResponse = (userInput: string) => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('protein') || userInputLower.includes('proteins')) {
      return "Good protein sources include chicken, fish, eggs, tofu, legumes, and dairy products. For vegetarians, I recommend incorporating more lentils, chickpeas, quinoa, and plant-based protein powders into your diet.";
    } else if (userInputLower.includes('carb') || userInputLower.includes('carbohydrate')) {
      return "Healthy carbs come from whole grains like brown rice and quinoa, fruits, vegetables, and legumes. These provide sustained energy and fiber, unlike refined carbs that can cause energy spikes and crashes.";
    } else if (userInputLower.includes('fat') || userInputLower.includes('fats')) {
      return "Focus on healthy fats from sources like avocados, nuts, seeds, olive oil, and fatty fish. These support hormone production and help with nutrient absorption, while avoiding trans fats which can increase inflammation.";
    } else if (userInputLower.includes('meal prep') || userInputLower.includes('prepare')) {
      return "Meal prepping saves time and helps you stay on track! Try batch cooking grains, roasting vegetables, and preparing protein sources on weekends. Store in airtight containers and mix and match throughout the week for variety.";
    } else {
      return "That's a great nutrition question! For the most personalized advice, I should consider your dietary preferences, goals, and any restrictions. Is there a specific aspect of nutrition or meal planning you'd like more information about?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      setShowApiInput(false);
      toast.success('API key saved!');
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Salad className="mr-2 h-5 w-5" />
          Nutritionist Chat
        </CardTitle>
      </CardHeader>
      
      {showApiInput ? (
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-start gap-2 mb-3">
              <Info size={18} className="text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                To enable the AI nutritionist chat, please enter your Gemini API key. Your key will be stored locally.
              </p>
            </div>
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey || ''}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-3"
            />
            <Button onClick={saveApiKey} className="w-full">
              Save API Key
            </Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>
          </CardContent>
          
          <CardFooter className="pt-3 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Ask about nutrition, meal plans, ingredients..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
