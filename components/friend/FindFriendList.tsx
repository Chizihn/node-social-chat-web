import { User } from "@/types/user";
import React from "react";
import FindFriendCard from "../cards/FindFriendCard";
import { UserPlus } from "lucide-react";

interface FindFriendListProps {
  friends: User[];
  loading: boolean;
  error: string | null;
}

const FindFriendList: React.FC<FindFriendListProps> = ({
  friends,
  loading,
  error,
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

  if (friends.length === 0) {
    return (
      <div>
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <UserPlus className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No friends at the moment</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Check sometime later
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {friends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((user) => (
            <FindFriendCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div>
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <UserPlus className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No suggestions found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your search
            </p>
            {/* <Button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('import');
              }}
              className="gap-2"
            >
              Import contacts <ArrowRight className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default FindFriendList;
