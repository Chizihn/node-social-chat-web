import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

// Mock users for demonstration
const mockUsers = [
  { id: "u1", name: "Alex Johnson", avatar: "/images/user.webp", online: true },
  {
    id: "u2",
    name: "Sarah Williams",
    avatar: "/images/user.webp",
    online: false,
  },
  {
    id: "u3",
    name: "Michael Brown",
    avatar: "/images/user.webp",
    online: true,
  },
  { id: "u4", name: "Emily Davis", avatar: "/images/user.webp", online: false },
  { id: "u5", name: "David Wilson", avatar: "/images/user.webp", online: true },
];

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  isOpen,
  onClose,
  onStartConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for people"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No users found
            </p>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onStartConversation(user.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
