import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  const renderMessageStatus = () => {
    switch (message.status) {
      case "sending":
        return null;
      case "sent":
        return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2",
          isMe
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-accent/30 rounded-tl-none"
        )}
      >
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">{message.timestamp}</span>
          {isMe && renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
