import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { User } from "@/types/user";

import { Message } from "@/types/message";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { DEFAULT_USER_IMG } from "@/constants";

interface ChatInfoPanelProps {
  recipient: Partial<User>;
  messages?: Message[];
  onClose?: () => void;
}

const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  recipient,
  messages,
  onClose,
}) => {
  // const { blockUser, isLoading: isBlocking } = useBlockUser();
  const fullName = `${recipient?.firstName} ${recipient?.lastName}`;
  const initials = `${recipient?.firstName?.charAt(
    0
  )}${recipient?.lastName?.charAt(0)}`;

  const [activeFilter, setActiveFilter] = useState<"all" | "photos" | "links">(
    "all"
  );
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // const handleBlock = async () => {
  //   try {
  //     await blockUser(recipient.id as string);
  //     toast.success("User blocked successfully");
  //   } catch (error) {
  //     const err = axiosErrorHandler(error);
  //     toast.error(err || "Failed to block user");
  //   }
  // };

  // Show top 6 image thumbnails

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
          <AvatarImage
            src={recipient?.avatar || DEFAULT_USER_IMG}
            alt={fullName}
          />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-medium">{fullName}</h3>
        <p className="text-sm text-muted-foreground">
          {recipient?.username && `@${recipient.username}`}
        </p>
      </div>

      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Shared Media</h3>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
        </div>
      </div>

      {messages && messages.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {messages
              .flatMap((msg) => msg.attachments || [])
              .filter((url) => {
                if (activeFilter === "photos") {
                  return url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
                }
                return true; // For "all"
              })
              .slice(0, 30) // Optional limit
              .map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(url)}
                  className="relative group aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={url}
                    alt={`Attachment ${index + 1}`}
                    fill
                    className="object-cover group-hover:brightness-75 transition"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </button>
              ))}
          </div>
        </div>
      )}

      {/* <div className="mt-auto p-4">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleBlock}
          disabled={isBlocking}
        >
          {isBlocking ? "Blocking..." : "Block User"}
        </Button>
      </div> */}

      {/* Image viewer dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative h-[70vh] w-full bg-black flex items-center justify-center">
            {selectedMedia && (
              <Image
                src={selectedMedia}
                alt="Attachment"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            )}
            <DialogClose className="absolute top-2 right-2 rounded-full p-2 bg-black/40 hover:bg-black/60">
              <X className="h-4 w-4 text-white" />
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInfoPanel;
