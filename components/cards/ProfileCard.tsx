import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Camera,
  Edit3,
  MapPin,
  Calendar,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { User } from "@/types/user";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { toast } from "sonner";
import api from "@/lib/api";

interface ProfileCardProps {
  user: Partial<User>;
  currentUser: User;
  isAlreadyFollowing?: boolean;
  isUpdating?: boolean;
  followLoading?: boolean;
  onFollowToggle?: () => void;
  onEditProfile?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  currentUser,
  onFollowToggle,
  isUpdating,
  followLoading,
  onEditProfile,
}) => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Check if the profile belongs to the current user
  const isOwnProfile = currentUser?.id === user?.id;

  // Check if the current user is following this profile
  const isAlreadyFollowing = currentUser?.following?.includes(
    user?.id as string
  );

  const { uploadFile: uploadToCloudinary } = useCloudinaryUpload({
    maxSizeMB: 5,
    allowedTypes: ["image/*"],
    maxFiles: 1,
  });

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setIsLoadingAvatar(true);
    try {
      const result = await uploadToCloudinary(e.target.files[0]);
      await api.post(`/profile/upload-avatar`, { avatar: result.url });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setIsLoadingCover(true);
    try {
      const result = await uploadToCloudinary(e.target.files[0]);
      await api.post(`/profile/upload-cover`, { coverImage: result.url });
      toast.success("Cover photo updated successfully");
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      toast.error("Failed to update cover photo");
    } finally {
      setIsLoadingCover(false);
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={user?.coverImage || "/images/default-cover.webp"}
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>

        {isOwnProfile && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-4 bottom-4 bg-black/40 hover:bg-black/60 text-white rounded-full z-20"
              onClick={() => coverInputRef.current?.click()}
              disabled={isLoadingCover}
            >
              {isLoadingCover ? (
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
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/*"
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="relative -mt-16 mb-4 flex justify-between items-end">
          <div className="relative">
            {/* Avatar with optional camera button for profile picture change */}
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={user?.avatar || "/images/default-avatar.webp"}
                alt={user?.username}
              />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-0 right-0 bg-black/40 hover:bg-black/60 text-white rounded-full p-1"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isLoadingAvatar}
                >
                  {isLoadingAvatar ? (
                    <span>...</span>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              /* Edit Profile Button - Only visible if it's the user's own profile */
              <Button
                className="flex items-center justify-center gap-2"
                onClick={onEditProfile}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              /* Follow/Unfollow & Message Buttons - For other users' profiles */
              <>
                <Button
                  className="flex items-center justify-center gap-2"
                  variant={isAlreadyFollowing ? "outline" : "default"}
                  onClick={onFollowToggle}
                  disabled={isUpdating || followLoading}
                >
                  {isAlreadyFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button variant="outline" className="rounded-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Share Profile</DropdownMenuItem>
                    <DropdownMenuItem>Copy Profile Link</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      Report Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-2">
          <h1 className="text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-muted-foreground">@{user?.username}</p>
          <p className="my-3">
            {user?.bio ||
              (isOwnProfile
                ? "Add a bio to tell the world about yourself."
                : "This user has no bio yet.")}
          </p>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
            {user?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
            )}
            {/* {user?.website && (
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-1" />
                <a href={user.website} className="text-blue-500 hover:underline">
                  {user.website}
                </a>
              </div>
            )} */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Joined{" "}
              {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>

          {/* Following and Followers Count */}
          <div className="flex gap-4 mt-3 text-sm pb-4">
            <div>
              <span className="font-bold">{user?.following?.length || 0}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">{user?.followers?.length || 0}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
