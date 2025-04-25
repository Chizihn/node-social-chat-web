import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { User } from "@/types/user"; // Assuming there's a User type now

interface FriendCardProps {
  user: Partial<User> | null;
  mutualFriends?: number; // Optional, since it's no longer from Friend type
}

const FriendCard: React.FC<FriendCardProps> = ({ user, mutualFriends = 0 }) => {
  if (!user) return null;

  const displayName = `${user.firstName} ${user.lastName}`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 h-12"></div>
      <CardContent className="pt-0 flex flex-col flex-grow">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center -mt-8 mb-4">
          <Avatar className="h-16 w-16 ring-4 ring-background mb-3">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              {displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{displayName}</h3>
          {user.username && (
            <p className="text-sm text-muted-foreground -mt-1">
              @{user.username}
            </p>
          )}
          {user.isVerified && (
            <Badge
              variant="outline"
              className="bg-blue-500 text-white px-1 mb-1"
            >
              Verified
            </Badge>
          )}
          {user.location && (
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>{" "}
              {user.location}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {mutualFriends} mutual {mutualFriends === 1 ? "friend" : "friends"}
          </p>
        </div>

        {/* Card Content */}
        <div className="flex-grow flex flex-col">
          {user.bio && (
            <div className="mb-4 max-h-24 overflow-y-auto">
              <p className="text-sm italic text-center">
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          )}

          {user.interests && user.interests?.length > 0 && (
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

          {user.hobbies && user.hobbies?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {user.hobbies.map((hobby, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-secondary/10 hover:bg-secondary/20"
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex-grow"></div>
        </div>

        {/* Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
