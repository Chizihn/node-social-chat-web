"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Settings } from "lucide-react";
import ConversationList from "@/components/message/ConversationList";
import NewMessageDialog from "@/components/message/NewMessageDialog";

export interface Conversation {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    username: "alex1",
    avatar: "/images/user.webp",
    lastMessage: "Hey there! How's it going?",
    timestamp: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    username: "sarahw",
    avatar: "/images/user.webp",
    lastMessage: "Can you send me that file we discussed?",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    username: "mikeb",
    avatar: "/images/user.webp",
    lastMessage: "Let's meet tomorrow at 2pm",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  // Future fetching logic placeholder
  useEffect(() => {
    const fetched: Conversation[] = [];

    if (fetched.length > 0) {
      setConversations(fetched);
    }
  }, []);

  const filteredConversations = conversations.filter((conversation) =>
    `${conversation.firstName} ${conversation.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  const handleStartNewConversation = (userId: string) => {
    setIsNewMessageOpen(false);
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setIsNewMessageOpen(true)}
              className="rounded-full"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Message
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={filteredConversations}
          onSelectConversation={handleSelectConversation}
          activeConversationId={null}
        />
      </div>

      <NewMessageDialog
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        onStartConversation={handleStartNewConversation}
      />
    </div>
  );
}
