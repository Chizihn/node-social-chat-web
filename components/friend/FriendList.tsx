import { Friend } from "@/types/friend";
import FriendCard from "../cards/FriendCard";
import { Users } from "lucide-react";

interface FriendListProps {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const FriendList: React.FC<FriendListProps> = ({ friends, loading, error }) => {
  // const { user } = useAuthStore();

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

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-lg">
        <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">
          You don&apos;t have any friends yet.
        </h3>
        {/* <p className="text-muted-foreground mb-6 max-w-md mx-auto">
  {searchQuery
    ? "Try adjusting your search to find your friends"
    : "You haven't added any friends yet"}
</p> */}
        {/* <Button
  onClick={() => {
    setSearchQuery("");
    setActiveTab("find-friends");
  }}
  className="gap-2"
>
  Find friends <ArrowRight className="h-4 w-4" />
</Button> */}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends &&
          friends.map((friend) => (
            <FriendCard
              // currentUserId={user?.id as string}
              key={friend.id}
              user={friend}
            />
          ))}
      </div>
    </>
  );
};

export default FriendList;
