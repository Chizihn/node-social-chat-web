import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserPlus, Users, UserX } from "lucide-react";
import { Button } from "../ui/button";
import { Friend } from "@/types/friend";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
} from "@/lib/queries/useFriends";

const FriendRequestCard = ({ request }: { request: Friend }) => {
  const { requester, createdAt, mutualFriends, id: requestId } = request;

  const { acceptFriendRequest, isLoading: accepting } =
    useAcceptFriendRequest();
  const { rejectFriendRequest, isLoading: rejecting } =
    useRejectFriendRequest();

  const handleAccept = async () => {
    try {
      await acceptFriendRequest(requestId);
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectFriendRequest(requestId);
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarImage src={requester.avatar} alt={requester.firstName} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              {requester.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">
              {requester.firstName} {requester.lastName}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {mutualFriends} mutual{" "}
              {mutualFriends === 1 ? "friend" : "friends"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requested {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={handleAccept}
            disabled={accepting || rejecting}
          >
            <UserPlus className="h-4 w-4" />
            {accepting ? "Accepting..." : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1"
            onClick={handleReject}
            disabled={rejecting || accepting}
          >
            <UserX className="h-4 w-4" />
            {rejecting ? "Ignoring..." : "Ignore"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequestCard;
