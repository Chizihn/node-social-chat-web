import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { User } from "@/types/user";

interface ChatHeaderProps {
  recipient: Partial<User> | null;
  // online: boolean;
  // lastSeen: string;
  onBack: () => void;
  onInfoClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipient,
  // online,
  // lastSeen,
  onBack,
  onInfoClick,
}) => {
  const fullName = recipient
    ? `${recipient?.firstName ?? ""} ${recipient?.lastName ?? ""}`.trim()
    : "Unknown User";

  const initials = recipient
    ? `${recipient.firstName?.[0] ?? ""}${
        recipient.lastName?.[0] ?? ""
      }`.toUpperCase()
    : "??";

  const avatar = recipient?.avatar ?? undefined;

  return (
    <div className="p-3 border-b flex items-center gap-3 sticky top-0 bg-background z-10">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onBack}
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={fullName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {" "}
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* {online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
          )} */}
        </div>
        <div>
          <h2 className="font-medium">
            {recipient?.firstName} {recipient?.lastName}
          </h2>
          {/* <p className="text-xs text-muted-foreground">
            {online ? "Online" : `Last seen ${lastSeen}`}
          </p> */}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden md:flex"
                aria-label="Voice call"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice call</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden md:flex"
                aria-label="Video call"
              >
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video call</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
                onClick={onInfoClick}
                aria-label="Chat info"
              >
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat info</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/${recipient?.username}`}>View profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            {/* <DropdownMenuItem>Mute notifications</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Block user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
