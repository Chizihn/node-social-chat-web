import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/message";
import { User } from "@/types/user"; // Assumed user type

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  activeConversationId: string | null;
  currentUserId: string;
  users: User[]; // Added: all known user profiles
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  activeConversationId,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No conversations found</p>
        <p className="text-sm text-muted-foreground">
          Start a new conversation or try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        // Identify the other user

        const fullName = conversation.recipient
          ? `${conversation.recipient?.firstName ?? ""} ${
              conversation?.recipient?.lastName ?? ""
            }`.trim()
          : "Unknown User";

        const initials = conversation.recipient
          ? `${conversation.recipient.firstName?.[0] ?? ""}${
              conversation.recipient.lastName?.[0] ?? ""
            }`.toUpperCase()
          : "??";

        const avatar = conversation.recipient?.avatar ?? undefined;

        const messageDate = new Date(conversation.timestamp);
        const today = new Date();
        const isToday = messageDate.toDateString() === today.toDateString();
        const formattedDate = isToday
          ? messageDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : messageDate.toLocaleDateString([], {
              month: "short",
              day: "numeric",
            });

        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-center gap-4 p-4 cursor-pointer transition-colors",
              activeConversationId === conversation.id
                ? "bg-blue-50 hover:bg-blue-100"
                : "hover:bg-gray-50"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12 border border-gray-100">
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* {conversation.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              )} */}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium truncate text-gray-900">
                  {fullName}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formattedDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* <p className="text-sm text-gray-500 truncate pr-2">
                  {conversation.lastMessage || "No messages yet"}
                </p> */}
                {/* {conversation.unread > 0 && (
                  <Badge className="ml-1 bg-blue-500 text-white hover:bg-blue-600 rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                    {conversation.unread > 99 ? "99+" : conversation.unread}
                  </Badge>
                )} */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
