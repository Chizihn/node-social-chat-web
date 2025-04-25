"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ChatHeader from "@/components/message/ChatHeader";
import MessageList from "@/components/message/MessageList";
import MessageInput from "@/components/message/MessageInput";
import ChatInfoPanel from "@/components/message/ChatInfoPanel";

// Define the interfaces for state
interface Message {
  id: string;
  senderId: string;
  text: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  timestamp: string;
  status: "sending" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  messages: Message[];
}

// Mock data for the current conversation
const mockConversation: Conversation = {
  id: "1",
  name: "Alex Johnson",
  avatar: "/images/user.webp",
  online: true,
  lastSeen: "2 minutes ago",
  messages: [],
};

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const [conversation, setConversation] =
    useState<Conversation>(mockConversation);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // In a real app, you would fetch the conversation data based on the ID
  useEffect(() => {
    console.log(`Fetching conversation with ID: ${id}`);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSendMessage = (text: string, attachments?: File[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    const newMessage: Message = {
      id: `m${Date.now()}`, // Use Date.now() or UUID for unique message IDs
      senderId: "me",
      text,
      attachments: attachments
        ? attachments.map((file) => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
          }))
        : undefined,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };

    setConversation((prevConversation) => ({
      ...prevConversation,
      messages: [...prevConversation.messages, newMessage],
    }));

    // Simulate message being sent and delivered
    setTimeout(() => {
      setConversation((prevConversation) => ({
        ...prevConversation,
        messages: prevConversation.messages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        ),
      }));

      // Simulate reply for demo purposes
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const replyMessage: Message = {
            id: `m${Date.now()}`, // New ID for reply
            senderId: "other",
            text: "Thanks for your message! I'll get back to you soon.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "read",
          };

          setConversation((prevConversation) => ({
            ...prevConversation,
            messages: [...prevConversation.messages, replyMessage],
          }));
        }, 2000);
      }
    }, 1000);
  };

  const goBack = () => {
    router.push("/messages");
  };

  const toggleInfoPanel = () => {
    setIsInfoPanelOpen((prevState) => !prevState);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <ChatHeader
          name={conversation.name}
          avatar={conversation.avatar}
          online={conversation.online}
          lastSeen={conversation.lastSeen}
          onBack={goBack}
          onInfoClick={toggleInfoPanel}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={conversation.messages}
            currentUserId="me" // In a real app, use the actual user ID
          />
          <div ref={messageEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      {/* Info Panel (hidden on mobile, toggleable on tablet) */}
      {isInfoPanelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleInfoPanel}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] sm:w-80 bg-background shadow-lg">
            <ChatInfoPanel
              user={{
                firstName: conversation.name.split(" ")[0], // Assuming the name is first name and last name
                lastName: conversation.name.split(" ")[1] || "", // Assuming it's a two-part name
                avatar: conversation.avatar,
                online: conversation.online,
                lastSeen: conversation.lastSeen,
              }}
              onClose={toggleInfoPanel}
            />
          </div>
        </div>
      )}

      {/* Info Panel (visible on large screens) */}
      <div className="hidden lg:block w-80 border-l">
        <ChatInfoPanel
          user={{
            firstName: conversation.name.split(" ")[0], // Assuming the name is first name and last name
            lastName: conversation.name.split(" ")[1] || "",
            avatar: conversation.avatar,
            online: conversation.online,
            lastSeen: conversation.lastSeen,
          }}
        />
      </div>
    </div>
  );
}
