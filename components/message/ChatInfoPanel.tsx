import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Link } from "lucide-react";
import { User } from "@/types/user";

interface ChatInfoPanelProps {
  recipient: Partial<User>;
  // online: boolean;

  onClose?: () => void;
}

const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  recipient,
  onClose,
}) => {
  const fullName = `${recipient?.firstName} ${recipient?.lastName}`;
  const initials = `${recipient?.firstName?.charAt(
    0
  )}${recipient?.lastName?.charAt(0)}`;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chat Info</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="p-4 flex flex-col items-center border-b">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={recipient?.avatar} alt={fullName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-medium">{fullName}</h3>
        <p className="text-sm text-muted-foreground">
          {/* {recipient?.online ? "Online" : `Last seen ${recipient?.lastSeen}`} */}
        </p>

        {/* <div className="flex gap-2 mt-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
          </Button>
        </div> */}
      </div>
      {/* 
      <div className="p-4 border-b space-y-4">
        <h3 className="font-medium">Options</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="notifications">Notifications</Label>
          </div>
          <Switch id="notifications" defaultChecked />
        </div> */}

      {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="mute">Mute mentions</Label>
          </div>
          <Switch id="mute" />
        </div> */}
      {/* </div> */}

      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Shared Media</h3>
        <div className="flex gap-2 mb-3">
          <Button variant="outline" size="sm" className="rounded-full">
            All
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <ImageIcon className="h-4 w-4 mr-1" /> Photos
          </Button>
          {/* <Button variant="outline" size="sm" className="rounded-full">
            <File className="h-4 w-4 mr-1" /> Files
          </Button> */}
          <Button variant="outline" size="sm" className="rounded-full">
            <Link className="h-4 w-4 mr-1" /> Links
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square bg-muted rounded-md" />
          <div className="aspect-square bg-muted rounded-md" />
          <div className="aspect-square bg-muted rounded-md" />
        </div>
      </div>

      <div className="mt-auto p-4">
        <Button variant="destructive" className="w-full">
          Block User
        </Button>
      </div>
    </div>
  );
};

export default ChatInfoPanel;
