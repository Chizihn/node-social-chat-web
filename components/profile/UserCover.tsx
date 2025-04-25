// components/profile/UserCover.tsx
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";

type UserCoverProps = {
  coverImage?: string;
  isLoading: boolean;
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserCover: React.FC<UserCoverProps> = ({
  coverImage,
  isLoading,
  onClick,
  inputRef,
  onChange,
}) => {
  return (
    <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-lg overflow-hidden">
      <Image
        src={coverImage || "/images/default-cover.webp"}
        alt="Cover"
        fill
        className="object-cover"
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-4 bottom-4 bg-black/40 hover:bg-black/60 text-white rounded-full"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">Uploading...</span>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit Cover Photo</span>
          </>
        )}
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

export default UserCover;
