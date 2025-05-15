import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import { useFriends } from "@/lib/queries/useFriends";

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
  isLoading?: boolean;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  isOpen,
  onClose,
  onStartConversation,
  isLoading = false,
}) => {
  const { friends, friendsLoading: isFriendsLoading } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return friends?.filter((user) =>
      `${user.firstName ?? ""} ${user.lastName ?? ""} ${user.username}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

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
          {isFriendsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers?.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              {searchQuery
                ? `No friends matching "${searchQuery}"`
                : "No friends found"}
            </p>
          ) : (
            <div className="divide-y">
              {filteredUsers?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    if (!isLoading) {
                      onStartConversation(user.id);
                    }
                  }}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {(
                          user.firstName?.charAt(0) || user.username.charAt(0)
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Optional: online status indicator */}
                    {/* {user.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                    )} */}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.firstName || user.lastName
                        ? `${user.firstName ?? ""} ${
                            user.lastName ?? ""
                          }`.trim()
                        : user.username}
                    </p>
                    {/* <p className="text-xs text-muted-foreground">
                      {user.online ? "Online" : "Offline"}
                    </p> */}
                  </div>
                  {isLoading && (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
                  )}
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
