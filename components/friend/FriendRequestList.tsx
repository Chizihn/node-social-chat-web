import {  Friends } from "@/types/friend";
import React from "react";
import FriendRequestCard from "../cards/FriendRequestCard";
import { Bell } from "lucide-react";

interface FriendRequestListProps {
  friendRequests: Friends;
  loading: boolean;
  error: string | null;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({
  friendRequests,
  loading,
  error,
}) => {
  if (loading) {
    <div>
      <p>Loading friend requests...</p>
    </div>;
  }

  if (error) {
    <div>Error: {error}</div>;
  }

  return (
    <>
      {friendRequests?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friendRequests.map((request) => (
            <FriendRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No friend requests</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            When someone sends you a friend request, you&apos;ll see it here
          </p>
        </div>
      )}
    </>
  );
};

export default FriendRequestList;
