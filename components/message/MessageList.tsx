import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";
import { Message, MessageStatus } from "@/types/message";

// Helpers
const getMediaType = (
  url: string
): "image" | "video" | "document" | "link" | "other" => {
  const lower = url.toLowerCase();
  if (/\.(jpeg|jpg|png|gif|webp|svg|avif)(\?.*)?$/.test(lower)) return "image";
  if (/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/.test(lower)) return "video";
  if (/\.(pdf|docx?|xlsx?|pptx?|txt)(\?.*)?$/.test(lower)) return "document";
  if (/^https?:\/\//.test(lower)) return "link";
  return "other";
};

const getFilenameFromUrl = (url: string): string => {
  try {
    const u = new URL(url);
    return u.pathname.split("/").pop()?.split("?")[0] || "file";
  } catch {
    return url.split("/").pop()?.split("?")[0] || "file";
  }
};

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
      const prevTime = prev ? new Date(prev.createdAt).getTime() : 0;
      const currTime = new Date(message.createdAt).getTime();

      if (
        !prev ||
        prev.sender.id !== message.sender.id ||
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
      case MessageStatus.SENDING:
        return (
          <span className="text-muted-foreground text-xs">Sending...</span>
        );
      case MessageStatus.SENT:
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case MessageStatus.DELIVERED:
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case MessageStatus.READ:
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case MessageStatus.ERROR:
        return <span className="text-red-500 text-xs">Failed</span>;
      default:
        return null;
    }
  };

  const renderAttachment = (url: string) => {
    const type = getMediaType(url);
    const filename = getFilenameFromUrl(url);

    if (type === "image") {
      return (
        <div className="rounded-md overflow-hidden max-w-xs mt-2">
          <Image
            src={url}
            alt={filename}
            width={300}
            height={300}
            className="object-cover w-full h-auto rounded-md"
          />
        </div>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent rounded-md p-3 flex items-center gap-2 max-w-xs mt-2"
      >
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
          <p className="text-sm font-medium truncate">{filename}</p>
          <p className="text-xs text-muted-foreground">
            Click to view or download
          </p>
        </div>
      </a>
    );
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-4 space-y-6">
      {groupedMessages.map((group, i) => {
        const isCurrentUser = group[0].sender.id === currentUserId;

        return (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-1",
              isCurrentUser ? "items-end" : "items-start"
            )}
          >
            <div className="flex items-end gap-2">
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={group[0].sender.avatar || "/images/user.webp"}
                    alt={group[0].sender.username || "User"}
                  />
                  <AvatarFallback>
                    {(group[0].sender.username || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col max-w-[90%]">
                <div
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    isCurrentUser
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  )}
                >
                  {group[0].text}
                  {group[0].attachments?.map((url, idx) => (
                    <div key={idx}>{renderAttachment(url)}</div>
                  ))}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs mt-1 px-2",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <span className="text-muted-foreground">
                    {formatTime(group[0].createdAt)}
                  </span>
                  {isCurrentUser && renderMessageStatus(group[0].status)}
                </div>
              </div>

              {isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/user.webp" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>

            {group.slice(1).map((msg, j) => (
              <div className="flex items-end gap-2" key={`${i}-${j}`}>
                {!isCurrentUser && <div className="w-8" />}
                <div className="flex flex-col max-w-[90%]">
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl text-sm",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    {msg.text}
                    {msg.attachments?.map((url, idx) => (
                      <div key={idx}>{renderAttachment(url)}</div>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs mt-1 px-2",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <span className="text-muted-foreground">
                      {formatTime(msg.createdAt)}
                    </span>
                    {isCurrentUser && renderMessageStatus(msg.status)}
                  </div>
                </div>
                {isCurrentUser && <div className="w-8" />}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
