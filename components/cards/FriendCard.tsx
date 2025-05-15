import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ExternalLink,
  MessageCircle,
  UserMinus,
  UserPlus,
  UserRoundX,
} from "lucide-react";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useFollow } from "@/lib/queries/useFollow";
import { toast } from "sonner";
import Link from "next/link";
import { useRemoveFriend } from "@/lib/queries/useFriends";

interface FriendCardProps {
  user: Partial<User> | null;
  mutualFriends?: number;
}

const FriendCard = ({ user, mutualFriends = 0 }: FriendCardProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const isFollowing = currentUser?.following?.includes(user?.id as string);
  const { followUser, unfollowUser, isLoading: followLoading } = useFollow();
  const { removeFriend, isLoading: removeLoading } = useRemoveFriend();
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const displayName = `${user.firstName} ${user.lastName}`;
  const profilePath = `/${user.username}`;

  const handleFollowToggle = async () => {
    try {
      setIsUpdating(true);
      if (isFollowing) {
        await unfollowUser(user?.id as string);
        toast.success(`Unfollowed ${user.firstName}`);
      } else {
        await followUser(user?.id as string);
        toast.success(`Following ${user.firstName}`);
      }
    } catch (error) {
      console.error("Follow error", error);
      toast.error("Error updating follow status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnfriend = async () => {
    try {
      await removeFriend(user?.id as string);
      toast.success(`Removed ${user.firstName} from friends`);
    } catch (error) {
      console.error("Unfriend error", error);
      toast.error("Failed to remove friend");
    } finally {
      setOpen(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 h-12"></div>
      <CardContent className="pt-0 flex flex-col flex-grow">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center -mt-8 mb-3">
          <Link href={profilePath}>
            <Avatar className="h-16 w-16 ring-4 ring-background mb-3 hover:opacity-90 transition-opacity cursor-pointer">
              <AvatarImage src={user.avatar} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                {displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            {user.isVerified && (
              <Badge className="bg-blue-500 text-white px-1">Verified</Badge>
            )}
          </div>

          {user.username && (
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            {mutualFriends} mutual {mutualFriends === 1 ? "friend" : "friends"}
          </p>

          <Link
            href={profilePath}
            className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" /> View Profile
          </Link>
        </div>

        {/* Card Content - Only show bio OR interests, not both */}
        <div className="flex-grow flex flex-col mb-4">
          {user.bio ? (
            <div className="mb-3 max-h-16 overflow-y-auto">
              <p className="text-sm italic text-center">
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          ) : user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {user.interests.slice(0, 3).map((interest, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20"
                >
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 3 && (
                <Badge variant="outline" className="text-muted-foreground">
                  +{user.interests.length - 3} more
                </Badge>
              )}
            </div>
          ) : null}

          <div className="flex-grow"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
          >
            <MessageCircle className="h-4 w-4" /> Message
          </Button>

          {/* Follow/Unfollow Button */}
          <Button
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollowToggle}
            disabled={isUpdating || followLoading}
          >
            {isFollowing ? (
              <>
                <UserRoundX className="h-4 w-4" /> Unfollow
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Follow
              </>
            )}
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 flex items-center justify-center gap-1"
                disabled={removeLoading}
              >
                <UserMinus className="h-4 w-4" /> Unfriend
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {displayName} from your
                  friends? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnfriend}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={removeLoading}
                >
                  {removeLoading ? "Removing..." : "Unfriend"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
