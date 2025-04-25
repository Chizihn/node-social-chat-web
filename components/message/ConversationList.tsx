import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/app/(dashboard)/messages/page";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  activeConversationId: string | null;
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
    <div className="divide-y">
      {conversations.map((conversation) => {
        const fullName = `${conversation.firstName} ${conversation.lastName}`;
        const initials = `${conversation.firstName.charAt(
          0
        )}${conversation.lastName.charAt(0)}`;

        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              activeConversationId === conversation.id && "bg-muted"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={conversation.avatar} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium truncate">{fullName}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {conversation.timestamp}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unread > 0 && (
                  <Badge variant="default" className="ml-2 rounded-full">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
