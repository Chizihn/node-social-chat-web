import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface Attachment {
  name: string;
  type: string;
  url: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read";
  attachments?: Attachment[];
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const groupedMessages = messages.reduce(
    (groups: Message[][], message, index) => {
      const prev = messages[index - 1];
      const prevTime = prev ? new Date(prev.timestamp).getTime() : 0;
      const currTime = new Date(message.timestamp).getTime();

      if (
        !prev ||
        prev.senderId !== message.senderId ||
        currTime - prevTime > 5 * 60 * 1000
      ) {
        groups.push([message]);
      } else {
        groups[groups.length - 1].push(message);
      }

      return groups;
    },
    []
  );

  const renderMessageStatus = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return (
          <span className="text-muted-foreground text-xs">Sending...</span>
        );
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    if (attachment.type.startsWith("image/")) {
      return (
        <div className="rounded-md overflow-hidden max-w-xs">
          <Image
            src={attachment.url}
            alt={attachment.name}
            width={300}
            height={300}
            className="rounded-md object-cover w-full h-auto"
          />
        </div>
      );
    }

    return (
      <div className="bg-accent rounded-md p-3 flex items-center gap-2 max-w-xs">
        <div className="bg-primary/10 p-2 rounded">
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">Click to download</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {groupedMessages.map((group, i) => {
        const isCurrentUser = group[0].senderId === currentUserId;

        return (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-1",
              isCurrentUser ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "flex items-end gap-2",
                isCurrentUser && "flex-row-reverse"
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/user.webp" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[75%] px-4 py-2 rounded-2xl",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                )}
              >
                {group[0].text}
                {group[0].attachments?.map((att, j) => (
                  <div key={j} className="mt-2">
                    {renderAttachment(att)}
                  </div>
                ))}
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs mt-1",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <span
                    className={
                      isCurrentUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {group[0].timestamp}
                  </span>
                  {isCurrentUser && renderMessageStatus(group[0].status)}
                </div>
              </div>
            </div>

            {group.slice(1).map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[75%] px-4 py-2 rounded-2xl",
                  isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none ml-10"
                    : "bg-muted rounded-bl-none mr-10"
                )}
              >
                {msg.text}
                {msg.attachments?.map((att, j) => (
                  <div key={j} className="mt-2">
                    {renderAttachment(att)}
                  </div>
                ))}
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs mt-1",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <span
                    className={
                      isCurrentUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {msg.timestamp}
                  </span>
                  {isCurrentUser && renderMessageStatus(msg.status)}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
