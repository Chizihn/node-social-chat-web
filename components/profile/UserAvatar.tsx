// components/profile/UserAvatar.tsx
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";

type UserAvatarProps = {
  avatar?: string;
  username?: string;
  isLoading: boolean;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  username = "",
  isLoading,
  onClick,
  inputRef,
  onChange,
}) => {
  return (
    <div className="relative">
      <Avatar className="h-32 w-32 border-4 border-background">
        <AvatarImage
          src={avatar || "/images/default-avatar.webp"}
          alt={username}
        />
        <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Button
        size="sm"
        variant="ghost"
        className="absolute bottom-0 right-0 bg-black/40 hover:bg-black/60 text-white rounded-full p-1"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? <span>...</span> : <Camera className="h-4 w-4" />}
      </Button>
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default UserAvatar;
