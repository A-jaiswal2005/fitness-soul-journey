
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dumbbell, SendIcon, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'trainer';
  timestamp: Date;
}

export const TrainerChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI fitness trainer. How can I help you with your workout today?',
      sender: 'trainer',
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
        const trainerResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(inputValue),
          sender: 'trainer',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, trainerResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response from the trainer');
      setIsLoading(false);
    }
  };

  const generateResponse = (userInput: string) => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('how many') || userInputLower.includes('reps') || userInputLower.includes('sets')) {
      return "For beginners, I recommend 3 sets of 8-12 reps. As you progress, you can increase to 4 sets. Remember to maintain proper form throughout!";
    } else if (userInputLower.includes('form') || userInputLower.includes('technique')) {
      return "Good form is crucial! Keep your back straight, engage your core, and focus on controlled movements rather than speed. Would you like me to explain the proper form for a specific exercise?";
    } else if (userInputLower.includes('rest') || userInputLower.includes('recovery')) {
      return "Rest days are just as important as workout days! For muscle recovery, aim for 24-48 hours between training the same muscle group. Make sure to get enough sleep and stay hydrated.";
    } else if (userInputLower.includes('weight') || userInputLower.includes('heavy')) {
      return "Choose a weight that challenges you in the last few reps but allows you to maintain proper form throughout the set. It's better to start lighter and focus on form before increasing weight.";
    } else {
      return "That's a great question about your workout! To give you the most helpful advice, I'd need to consider your fitness level, goals, and any limitations. Is there a specific aspect of this exercise or training plan you'd like me to address?";
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
          <Dumbbell className="mr-2 h-5 w-5" />
          Fitness Trainer Chat
        </CardTitle>
      </CardHeader>
      
      {showApiInput ? (
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-start gap-2 mb-3">
              <Info size={18} className="text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                To enable the AI trainer chat, please enter your Gemini API key. Your key will be stored locally.
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
                placeholder="Ask about exercises, form, rest days..."
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
