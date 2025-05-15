"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Settings } from "lucide-react";
import ConversationList from "@/components/message/ConversationList";
import NewMessageDialog from "@/components/message/NewMessageDialog";
import {
  useConversations,
  useCreateConversation,
} from "@/lib/queries/useConversationStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsers } from "@/lib/queries/useUsers";
import { User } from "@/types/user";

export default function ConversationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;

  // Use the fetch conversation hook
  const { conversations = [], isLoading, error, refetch } = useConversations();

  // Use the create conversation hook
  const { createConversation, isLoading: isCreatingConversation } =
    useCreateConversation();

  const { users = [] } = useUsers();

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      // Get the other participant's ID

      // Get full user object for the other participant
      const recipient = conversation.recipient as User;
      if (!recipient) return false;

      const searchString = `${recipient.firstName ?? ""} ${
        recipient.lastName ?? ""
      } ${recipient.username ?? ""}`;
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  const handleStartNewConversation = async (userId: string) => {
    try {
      // Check if conversation with this user already exists
      const existingConversation = conversations.find(
        (conversation) => conversation.recipient?.id === userId
      );

      if (existingConversation) {
        // If exists, navigate to existing conversation
        router.push(`/messages/${existingConversation.id}`);
      } else {
        // If not, create new conversation and navigate to it
        const result = await createConversation(userId);

        if (result?.data) {
          router.push(`/messages/${result.data.id}`);
          // Refresh the conversation list
          refetch();
        }
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsNewMessageOpen(false);
    }
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
              disabled={isCreatingConversation}
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
        {isLoading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-4 border-b flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className="p-4 text-red-500 flex flex-col items-center justify-center h-full">
            <p>Failed to load conversations.</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : filteredConversations.length > 0 ? (
          <ConversationList
            conversations={filteredConversations}
            onSelectConversation={handleSelectConversation}
            activeConversationId={null}
            currentUserId={userId}
            users={users}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            {searchQuery ? (
              <p>No conversations matching &quot;{searchQuery}&quot;</p>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <p className="text-muted-foreground mb-2">
                    No conversations found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start a new conversation or try a different search term
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <NewMessageDialog
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
        onStartConversation={handleStartNewConversation}
        isLoading={isCreatingConversation}
      />
    </div>
  );
}
