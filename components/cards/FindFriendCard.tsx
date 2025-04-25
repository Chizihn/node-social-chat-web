import React, { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MessageCircle, UserPlus, UserCheck, UserMinus } from "lucide-react";
import { User } from "@/types/user";
import {
  useAcceptFriendRequest,
  useAddFriend,
  useFriendRequests,
  useSentRequests,
} from "@/lib/queries/useFriends";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useFollow } from "@/lib/queries/useFollow";

const FindFriendCard = ({ user }: { user: User }) => {
  const { user: currentUser } = useAuthStore();
  const { followUser, unfollowUser, isLoading: followLoading } = useFollow();
  const { sentRequests, isLoading: checkingRequest } = useSentRequests();
  const {
    addFriend,
    isLoading: addingFriend,
    isSuccess,
    error,
  } = useAddFriend();
  const {
    friendRequests,
    // isLoading: loadingRequests,
  } = useFriendRequests();
  const {
    acceptFriendRequest,
    isLoading: acceptingRequest,
    // isSuccess: acceptedRequest,
    error: acceptRequestError,
  } = useAcceptFriendRequest();

  const [isUpdating, setIsUpdating] = useState(false);

  const isAlreadyFollowing = useMemo(() => {
    return currentUser?.following?.includes(user.id);
  }, [currentUser, user.id]);

  // Check if we've already sent a request to this user
  const requestAlreadySent = useMemo(() => {
    return sentRequests?.some((request) => request.recipient.id === user.id);
  }, [sentRequests, user.id]);

  // Check if we've received a request from this user
  const requestAlreadyReceived = useMemo(() => {
    return friendRequests?.some(
      (request) => request.requester.id === user.id // Check if request is from this user
    );
  }, [friendRequests, user.id]);

  const handleFollowToggle = async () => {
    try {
      setIsUpdating(true);
      if (isAlreadyFollowing) {
        await unfollowUser(user.id);
        toast.success("Unfollowed user");
      } else {
        await followUser(user.id);
        toast.success("Followed user");
      }
    } catch (error) {
      console.error("Follow error", error);
      toast.error("Error updating follow status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      if (requestAlreadyReceived) {
        await acceptFriendRequest(user.id);
        toast.success("Friend request accepted");
      } else {
        await addFriend(user.id);
        toast.success("Friend request sent");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Friend request error:", err);
    }
  };

  // Determine which button state to show
  const getFriendButtonState = () => {
    if (checkingRequest) {
      return { text: "Checking...", disabled: true, variant: "outline" };
    } else if (requestAlreadySent || isSuccess) {
      return {
        text: (
          <>
            <UserCheck className="h-4 w-4" /> Request Sent
          </>
        ),
        disabled: true,
        variant: "outline",
      };
    } else if (requestAlreadyReceived) {
      return {
        text: acceptingRequest ? (
          "Accepting..."
        ) : (
          <>
            <UserCheck className="h-4 w-4" /> Accept Request
          </>
        ),
        disabled: acceptingRequest,
        variant: "default",
      };
    } else {
      return {
        text: addingFriend ? (
          "Sending..."
        ) : (
          <>
            <UserPlus className="h-4 w-4" /> Add Friend
          </>
        ),
        disabled: addingFriend,
        variant: "secondary",
      };
    }
  };

  const friendButtonState = getFriendButtonState();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 h-12"></div>
      <CardContent className="pt-0 flex flex-col flex-grow">
        <div className="flex flex-col items-center text-center -mt-8 mb-4">
          <Avatar className="h-16 w-16 ring-4 ring-background mb-3">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              {user.firstName?.charAt(0) || user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">
            {user.firstName} {user.lastName}
          </h3>
          <span>@{user.username}</span>
          {user.location && (
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>{" "}
              {user.location}
            </p>
          )}
        </div>

        <div className="flex-grow flex flex-col">
          {user.bio && (
            <div className="mb-4 max-h-24 overflow-y-auto">
              <p className="text-sm italic text-center">
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          )}

          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {user.interests.map((interest, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          {/* Follow/Unfollow */}
          <Button
            className="flex items-center justify-center gap-2"
            variant={isAlreadyFollowing ? "outline" : "default"}
            onClick={handleFollowToggle}
            disabled={isUpdating || followLoading}
          >
            {isAlreadyFollowing ? (
              <>
                <UserMinus className="h-4 w-4" /> Unfollow
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Follow
              </>
            )}
          </Button>

          {/* Add Friend or Accept Friend */}
          <Button
            className="flex items-center justify-center gap-2"
            // variant={friendButtonState.variant}
            disabled={friendButtonState.disabled}
            onClick={handleAddFriend}
          >
            {friendButtonState.text}
          </Button>

          {/* Message */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Message
          </Button>
        </div>

        {(error || acceptRequestError) && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {error || acceptRequestError || "Something went wrong"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FindFriendCard;
