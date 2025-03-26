
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  icon?: string;
  avatarFallback: string;
}

export const ChatMessage = ({ message, icon, avatarFallback }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "bg-muted/50" : "bg-background"
    )}>
      <Avatar className="h-8 w-8">
        {icon && <AvatarImage src={icon} alt={isUser ? "User" : "Assistant"} />}
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="font-medium">
          {isUser ? "You" : avatarFallback}
        </div>
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <ReactMarkdown components={{
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-3 mb-1" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            code: ({ node, ...props }) => <code className="bg-muted p-1 rounded" {...props} />,
            pre: ({ node, ...props }) => <pre className="bg-muted p-2 rounded my-2 overflow-x-auto" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-muted pl-4 italic" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-4 border-muted" {...props} />,
            table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-muted" {...props} /></div>,
            img: ({ node, ...props }) => <img className="max-w-full h-auto my-2 rounded" {...props} />
          }}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
