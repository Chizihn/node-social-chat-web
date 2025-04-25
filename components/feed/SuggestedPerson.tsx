// People You May Know component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

const SuggestedPerson = ({
  user,
}: {
  user: { id: number; name: string; mutualCount: number };
}) => (
  <div className="flex flex-col items-center text-center group">
    <div className="relative">
      <Avatar className="h-16 w-16 mb-2 group-hover:scale-105 transition-transform border-2 border-background">
        <AvatarImage src={`/images/user.webp`} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-pink-500 text-white">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
        <div className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
          +
        </div>
      </div>
    </div>
    <h4 className="text-sm font-medium">{user.name}</h4>
    <p className="text-xs text-muted-foreground mb-2">
      {user.mutualCount} mutual
    </p>
    <Button
      variant="outline"
      size="sm"
      className="w-full group-hover:bg-primary/10 transition-colors"
    >
      Connect
    </Button>
  </div>
);

export default SuggestedPerson;
