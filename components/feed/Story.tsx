import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Story component
const Story = ({
  user,
  isActive,
}: {
  user: { name: string; avatar: string };
  isActive?: boolean;
}) => (
  <div className="flex flex-col items-center space-y-1 cursor-pointer group">
    <div
      className={`rounded-full p-0.5 ${
        isActive
          ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
          : "bg-muted hover:bg-muted/80"
      }`}
    >
      <Avatar className="h-16 w-16 border-2 border-background group-hover:scale-105 transition-transform">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
    <span className="text-xs font-medium truncate max-w-[70px] text-center">
      {user.name}
    </span>
  </div>
);

export default Story;
