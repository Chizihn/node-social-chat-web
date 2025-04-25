import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatInfoPanel from "./ChatInfoPanel";

interface ChatLayoutProps {
  chatId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    online: boolean;
    lastSeen: string;
  };
  onBack: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ user, onBack }) => {
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Placeholder for message data (you'll want to fetch this in real use)
  const [messages] = useState([]);

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSendMessage = (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, attachments);
    // Example: setMessages([...messages, { id: ..., senderId: ..., ... }]);
  };

  const handleViewProfile = () => {
    setShowInfoPanel(true);
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader
          name={fullName}
          avatar={user.avatar}
          online={user.online}
          lastSeen={user.lastSeen}
          onBack={onBack}
          onInfoClick={handleViewProfile}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} currentUserId={user.id} />
        </div>

        <div className="p-3 border-t">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {showInfoPanel && (
        <div className="w-80 border-l h-full hidden md:block">
          <ChatInfoPanel user={user} onClose={() => setShowInfoPanel(false)} />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
