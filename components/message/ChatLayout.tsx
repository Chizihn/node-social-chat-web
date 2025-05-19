import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatInfoPanel from "./ChatInfoPanel";
import { User } from "@/types/user";

interface ChatLayoutProps {
  chatId: string;
  recipient: User;
  online: boolean;
  onBack: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  chatId,
  recipient,
  onBack,
}) => {
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Placeholder for message data (you'll want to fetch this in real use)
  const [messages] = useState([]);

  const handleSendMessage = (message: string, attachments?: string[]) => {
    console.log(
      `Sending message to ${recipient.username} in chat ${chatId}:`,
      message
    );
    console.log("Attachments:", attachments);

    // Here you would normally:
    // 1. Send the message to your API
    // 2. Update the messages state with the new message
    // Example implementation:
    /*
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      attachments: attachments || [],
      senderId: currentUser.id, // You would get this from auth context
      receiverId: recipient.id,
      timestamp: new Date().toISOString(),
    };
    
    api.post('/messages', newMessage)
      .then(() => {
        setMessages(prev => [...prev, newMessage]);
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message. Please try again.');
      });
    */
  };

  const handleViewProfile = () => {
    setShowInfoPanel(true);
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader
          recipient={recipient}
          // online={online}
          // lastSeen={recipient.lastActive}
          onBack={onBack}
          onInfoClick={handleViewProfile}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} currentUserId={recipient.id} />
        </div>

        <div className="border-t">
          <MessageInput
            onSendMessage={handleSendMessage}
            onTypingStart={() =>
              console.log(`${recipient.username} is typing...`)
            }
            onTypingStop={() =>
              console.log(`${recipient.username} stopped typing`)
            }
          />
        </div>
      </div>

      {showInfoPanel && (
        <div className="w-80 border-l h-full hidden md:block">
          <ChatInfoPanel
            recipient={recipient}
            messages={messages}
            onClose={() => setShowInfoPanel(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
