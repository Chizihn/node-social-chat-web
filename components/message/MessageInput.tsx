import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, X } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}) => {
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicators
  useEffect(() => {
    return () => {
      // Clear any pending timeout when component unmounts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Ensure we stop typing indicator when leaving the component
      if (isTyping && onTypingStop) {
        onTypingStop();
      }
    };
  }, [isTyping, onTypingStop]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Handle typing indicators
    if (!isTyping && newMessage.trim().length > 0) {
      setIsTyping(true);
      if (onTypingStart) {
        onTypingStart();
      }
    }

    // Reset the timeout on each keypress
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTypingStop) {
          onTypingStop();
        }
      }
    }, 2000);
  };

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);

      // Stop typing indicator when sending message
      if (isTyping) {
        setIsTyping(false);
        if (onTypingStop) {
          onTypingStop();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t p-3 space-y-2">
      {attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative bg-muted rounded-md p-2 text-xs flex items-center"
            >
              <span className="max-w-[150px] truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none pr-10"
          />
          <div className="absolute bottom-2 right-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
        </div>

        <div className="flex gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="rounded-full"
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
