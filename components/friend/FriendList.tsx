import FriendCard from "../cards/FriendCard";
import { Users as UsersIcon } from "lucide-react";
import { Users } from "@/types/user";

interface FriendListProps {
  friends: Users;
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
        <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">
          You don&apos;t have any friends yet.
        </h3>
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
