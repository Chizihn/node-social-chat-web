// components/profile/UserInfo.tsx
import React from "react";
import { Button } from "../ui/button";
import { Edit3, MapPin } from "lucide-react";
import { User } from "@/types/user"; // Replace with your user type

type UserInfoProps = {
  user: User;
  onEditClick: () => void;
};

const UserInfo: React.FC<UserInfoProps> = ({ user, onEditClick }) => {
  return (
    <div className="mt-2">
      <div className="flex justify-between items-end -mt-16 mb-4">
        <Button className="flex items-center gap-2" onClick={onEditClick}>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <h1 className="text-2xl font-bold">
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-muted-foreground">@{user.username}</p>
      <p className="my-3">
        {user.bio || "Add a bio to tell the world about yourself."}
      </p>

      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
        {user.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {user.location}
          </div>
        )}
        {/* Add website, createdAt, etc. if needed */}
      </div>

      <div className="flex gap-4 mt-3 text-sm">
        <div>
          <span className="font-bold">{user.following?.length || 0}</span>{" "}
          <span className="text-muted-foreground">Following</span>
        </div>
        <div>
          <span className="font-bold">{user.followers?.length || 0}</span>{" "}
          <span className="text-muted-foreground">Followers</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
