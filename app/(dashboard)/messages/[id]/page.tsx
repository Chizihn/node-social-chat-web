"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatHeader from "@/components/message/ChatHeader";
import MessageList from "@/components/message/MessageList";
import MessageInput from "@/components/message/MessageInput";
import ChatInfoPanel from "@/components/message/ChatInfoPanel";
import Loading from "@/components/Loading";
import {
  useConversation,
  useConversations,
} from "@/lib/queries/useConversationStore";
import { Message, MessageStatus } from "@/types/message";
import { useMessages, useSendMessage } from "@/lib/queries/useMessages";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import { User } from "@/types/user";
import { toast } from "sonner";

export default function ChatPage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const { conversations = [] } = useConversations();

  const initialConversation = conversations.find(
    (conversation) => conversation.id === id
  );

  const { conversation } = useConversation(
    initialConversation?.recipient?.id as string
  );
  const {
    messages: initialMessages,
    isLoading,
    error,
  } = useMessages(id as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: sendMessageApi } = useSendMessage();
  const {
    socket,
    isConnected,
    sendMessage: sendSocketMessage,
    markAsRead,
    sendTypingIndicator,
    sendStopTypingIndicator,
  } = useSocketStore();

  const recipient =
    initialConversation?.recipient || (conversation?.recipient as User);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Listen for socket events
  useEffect(() => {
    if (socket && id && recipient?.id) {
      // Mark messages as read when entering the conversation
      markAsRead(id as string, recipient.id);

      const handleNewMessage = (message: Message) => {
        console.log("New message received in chat page:", message);
        if (message.conversation === id) {
          console.log("Message belongs to this conversation, updating state");
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some((msg) => msg.id === message.id);
            if (exists) {
              console.log("Message already exists in state");
              return prev;
            }
            return [...prev, message];
          });

          // Automatically mark incoming messages as read
          if (message.sender.id !== user?.id) {
            markAsRead(id as string, message.sender?.id as string);
          }
        }
      };

      const handleMessageStatus = ({
        messageId,
        status,
      }: {
        messageId: string;
        status: MessageStatus;
      }) => {
        console.log(`Message ${messageId} status updated to: ${status}`);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
        );
      };

      // Remove any existing listeners before adding new ones
      socket.off("new_message");
      socket.off("message_status");

      // Add listeners
      socket.on("new_message", handleNewMessage);
      socket.on("message_status", handleMessageStatus);

      return () => {
        // Remove listeners when component unmounts
        socket.off("new_message", handleNewMessage);
        socket.off("message_status", handleMessageStatus);
      };
    }
  }, [id, socket, recipient?.id, user?.id, markAsRead, isConnected]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (text: string, attachmentUrls?: string[]) => {
    if (!text.trim() && (!attachmentUrls || attachmentUrls.length === 0))
      return; // Don't send empty messages

    if (!id || !user?.id || !recipient?.id) return;

    // Create a temporary message ID
    const tempId = `temp-${Date.now()}`;

    // Add optimistic update for message (with attachments if they exist)
    const newMessage: Message = {
      id: tempId,
      conversation: id as string,
      sender: user,
      text: text.trim(), // Send an empty string if there's no text
      status: MessageStatus.SENT,
      attachments: attachmentUrls, // Attach URLs of files (as string[])
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update local state for instant feedback
    setMessages((prev) => [...prev, newMessage]);

    try {
      // Send message via API (now with string[] for attachments)
      const response = await sendMessageApi({
        recipientId: recipient.id,
        text: text.trim(), // Ensure sending an empty string if no text
        attachments: attachmentUrls, // Send attachment URLs as string[]
      });

      console.log("Message sent via API, response:", response);

      // Replace temporary message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? response : msg))
      );

      // Send notification via socket if connected
      if (isConnected && sendSocketMessage) {
        console.log("Sending message via socket to recipient:", recipient.id);
        const socketSent = sendSocketMessage(
          recipient.id,
          text.trim(),
          attachmentUrls
        );
        if (!socketSent) {
          console.warn("Socket message sending failed, socket not connected");
          // If socket is not connected, try to reconnect
          if (!isConnected) {
            toast.warning("Reconnecting to chat service...");
          }
        }
      } else {
        console.warn("Socket not connected or sendSocketMessage not available");
        if (!isConnected) {
          toast.warning(
            "You're offline. Message will be delivered when you reconnect."
          );
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Show error state for the message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: MessageStatus.ERROR } : msg
        )
      );

      // Show an error toast
      toast.error("Failed to send message!");
    }
  };

  // Handle typing indicators
  const handleTypingStart = () => {
    if (id && recipient?.id && sendTypingIndicator) {
      sendTypingIndicator(id as string, recipient.id);
    }
  };

  const handleTypingStop = () => {
    if (id && recipient?.id && sendStopTypingIndicator) {
      sendStopTypingIndicator(id as string, recipient.id);
    }
  };

  const goBack = () => {
    router.push("/messages");
  };

  const toggleInfoPanel = () => {
    setIsInfoPanelOpen((prevState) => !prevState);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          {error ? `Error: ${error.message}` : "Conversation not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <ChatHeader
          recipient={recipient}
          onBack={goBack}
          onInfoClick={toggleInfoPanel}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} currentUserId={user?.id as string} />
          <div ref={messageEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
        />
      </div>

      {/* Info Panel (hidden on mobile, toggleable on tablet) */}
      {isInfoPanelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleInfoPanel}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] sm:w-80 bg-background shadow-lg">
            <ChatInfoPanel recipient={recipient} onClose={toggleInfoPanel} />
          </div>
        </div>
      )}

      {/* Info Panel (visible on large screens) */}
      <div className="hidden lg:block w-80 border-l">
        <ChatInfoPanel recipient={recipient} />
      </div>
    </div>
  );
}
