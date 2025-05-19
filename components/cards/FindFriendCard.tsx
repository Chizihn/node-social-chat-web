import React, { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  UserMinus,
  MoreHorizontal,
  Eye,
} from "lucide-react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useConversations,
  useCreateConversation,
} from "@/lib/queries/useConversationStore";

const FindFriendCard = ({ user }: { user: User }) => {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { followUser, unfollowUser, isLoading: followLoading } = useFollow();
  const { sentRequests, isLoading: checkingRequest } = useSentRequests();
  const {
    addFriend,
    isLoading: addingFriend,
    isSuccess,
    error,
  } = useAddFriend();
  const { friendRequests } = useFriendRequests();
  const {
    acceptFriendRequest,
    isLoading: acceptingRequest,
    error: acceptRequestError,
  } = useAcceptFriendRequest();

  const [isUpdating, setIsUpdating] = useState(false);

  const isAlreadyFollowing = currentUser?.following?.includes(user.id);

  const requestAlreadySent = useMemo(() => {
    return sentRequests?.some((request) => request.recipient.id === user.id);
  }, [sentRequests, user.id]);

  const requestAlreadyReceived = useMemo(() => {
    return friendRequests?.some((request) => request.requester.id === user.id);
  }, [friendRequests, user.id]);

  // Use the fetch conversation hook
  const { conversations = [], refetch } = useConversations();

  // Use the create conversation hook
  const { createConversation, isLoading: isCreatingConversation } =
    useCreateConversation();

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

  const handleMessage = async () => {
    try {
      // Check if conversation with this user already exists
      const existingConversation = conversations.find(
        (conversation) => conversation.recipient?.id === (user.id as string)
      );

      if (existingConversation) {
        // If exists, navigate to existing conversation
        router.push(`/messages/${existingConversation.id}`);
      } else {
        // If not, create new conversation and navigate to it
        const result = await createConversation(user.id as string);

        if (result?.data) {
          router.push(`/messages/${result.data.id}`);
          // Refresh the conversation list
          refetch();
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

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

        {/* Conditional buttons */}
        <>
          {user.id === currentUser?.id ? (
            <Link href="/profile" className="w-full">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2 "
              >
                View Profile
              </Button>
            </Link>
          ) : (
            <div className="grid grid-cols-2 justify-center gap-2 mt-4">
              <div className="col-span-2 flex gap-2 relative">
                {/* View Profile Button */}
                <Link href={`/profile/${user.username}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> View Profile
                  </Button>
                </Link>

                {/* Message Button */}

                <Button
                  variant="outline"
                  onClick={handleMessage}
                  className="w-full flex items-center justify-center gap-2 flex-1"
                  disabled={isCreatingConversation}
                >
                  {isCreatingConversation ? (
                    "..."
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" /> Message
                    </>
                  )}
                </Button>

                {/* Three Dot Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-10 right-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Follow/Unfollow Option */}
                    <DropdownMenuItem
                      onClick={handleFollowToggle}
                      disabled={isUpdating || followLoading}
                    >
                      {isAlreadyFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" /> Follow
                        </>
                      )}
                    </DropdownMenuItem>
                    {/* Add/Accept Friend Option */}
                    <DropdownMenuItem
                      onClick={handleAddFriend}
                      disabled={friendButtonState.disabled}
                    >
                      {friendButtonState.text}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </>

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
