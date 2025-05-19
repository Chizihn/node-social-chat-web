import { User } from "@/types/user";
import React from "react";
import FindFriendCard from "../cards/FindFriendCard";
import { UserPlus } from "lucide-react";

type FindFriendListType = "find-friends" | "search" | "friends";

interface FindFriendListProps {
  friends: User[];
  loading: boolean;
  error: string | null;
  type?: FindFriendListType;
  hasSearched?: boolean;
  showDefaultList?: boolean;
}

const FindFriendList: React.FC<FindFriendListProps> = ({
  friends,
  loading,
  error,
  type = "find-friends",
  hasSearched = false,
  showDefaultList = false,
}) => {
  if (loading) {
    return (
      <div>
        <p>Loading friends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Show welcome message for search page when no search performed
  if (type === "search" && !hasSearched) {
    return (
      <div>
        <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <UserPlus className="mx-auto h-16 w-16 text-primary/50 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary/80 to-indigo-600/80 bg-clip-text text-transparent">
            Start Your Search Journey
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            Enter a name or keyword to discover amazing people
          </p>
        </div>
      </div>
    );
  }

  // Show empty state for other cases
  if (friends?.length === 0 && (!showDefaultList || hasSearched)) {
    return (
      <div>
        <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <UserPlus className="mx-auto h-16 w-16 text-primary/50 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary/80 to-indigo-600/80 bg-clip-text text-transparent">
            {type === "friends" && "No Friends Match Your Search"}
            {type === "find-friends" && "Discover New Connections"}
            {type === "search" && "No Users Match Your Search"}
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            {type === "friends" &&
              "Try different keywords or check your spelling"}
            {type === "find-friends" &&
              "We'll help you find interesting people to connect with"}
            {type === "search" &&
              "Try different keywords or check your spelling"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {friends?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((user) => (
            <FindFriendCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div>
          <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <UserPlus className="mx-auto h-16 w-16 text-primary/50 mb-4" />
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary/80 to-indigo-600/80 bg-clip-text text-transparent">
              {type === "friends" && "No Friends Match Your Search"}
              {type === "find-friends" && "No Matching Suggestions Found"}
              {type === "search" && "No Users Match Your Search"}
            </h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              Try using different keywords or check your spelling
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FindFriendList;
