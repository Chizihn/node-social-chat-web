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
      <div className="absolute inset-0">
        <Image
          src={coverImage || "/images/default-cover.webp"}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 flex items-end justify-end p-4">
        <Button
          size="sm"
          variant="ghost"
          className="bg-black/40 hover:bg-black/60 text-white rounded-full z-10"
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
      </div>
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
