import { UserType } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, Check } from "lucide-react";

const FriendSuggestion = ({ user }: { user: UserType }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-accent/30 rounded-lg transition-colors duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-border ring-2 ring-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">{user.name}</h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60"></span>
            {user.mutualFriends} mutual friends
          </p>
        </div>
      </div>
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={() => setIsFollowing(!isFollowing)}
        className="transition-all duration-200 group"
      >
        {isFollowing ? (
          <>
            {isHovering ? "Unfollow" : "Following"}
            {!isHovering && <Check className="ml-1 h-3 w-3" />}
          </>
        ) : (
          <>
            Add{" "}
            <UserPlus className="ml-1 h-3 w-3 group-hover:scale-110 transition-transform" />
          </>
        )}
      </Button>
    </div>
  );
};

export default FriendSuggestion;
