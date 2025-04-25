"use client";
import { useMemo, useState } from "react";
import { Calendar, MapPin, MoreHorizontal, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";
import { useFollow } from "@/lib/queries/useFollow";
import { useUserByUsername } from "@/lib/queries/useUsers";
import { useGetUserPosts } from "@/lib/queries/usePost";
import PostView from "../feed/PostView";

const UserProfile: React.FC<{ username: string }> = ({ username }) => {
  const { followUser, unfollowUser, isLoading: followLoading } = useFollow();
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, isLoading, error } = useUserByUsername(username);

  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
    // refetch,
    currentPage,
    totalPages,
    handlePageChange,
  } = useGetUserPosts(username as string);

  const isAlreadyFollowing = useMemo(() => {
    return user?.following?.includes(user.id);
  }, [user]);

  if (isLoading)
    return (
      <div className="h-full justify-center items-center">
        <p>Loading user...</p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );

  if (!user)
    return (
      <div>
        <p>No user</p>
      </div>
    );

  const handleFollowToggle = async () => {
    try {
      setIsUpdating(true);
      if (isAlreadyFollowing) {
        await unfollowUser(user.id);
        toast.success("Unfollowed user");
      } else {
        await followUser(user.id);
        toast.success("Followed user");
      }
    } catch (error) {
      console.error("Folow error", error);

      toast.error("Error updating follow status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-lg overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/images/user.webp"
            alt="Cover"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="-mt-16 mb-4 flex justify-between items-end">
          <div className="relative">
            {/* Avatar with a camera button for profile picture change */}
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={user.avatar || "/images/default-avatar.webp"}
                alt={user.username}
              />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex gap-2">
            {/* Follow/Unfollow Button */}
            <Button
              className="flex items-center justify-center gap-2"
              variant={isAlreadyFollowing ? "outline" : "default"}
              onClick={handleFollowToggle}
              disabled={isUpdating || followLoading}
            >
              {isAlreadyFollowing ? <>Unfollow</> : <>Follow</>}
            </Button>
            {/* Message Button */}
            <Button variant="outline" className="rounded-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Share Profile</DropdownMenuItem>
                <DropdownMenuItem>Copy Profile Link</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  Report Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-2">
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <p className="my-3">{user.bio || "This user has no bio yet."}</p>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
            )}
            {/* {user.website && (
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-1" />
              <a href={user.website} className="text-blue-500 hover:underline">
                {user.website}
              </a>
            </div>
          )} */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Joined{" "}
              {new Date(user?.createdAt || "No date").toLocaleDateString()}
            </div>
          </div>

          {/* Following and Followers Count */}
          <div className="flex gap-4 mt-3 text-sm">
            <div>
              <span className="font-bold">{user.following?.length}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">{user.followers?.length}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <div className="px-[2rem]">
            <TabsContent value="posts" className="mt-4">
              {postsLoading ? (
                <p className="text-muted-foreground px-4">Loading posts...</p>
              ) : error ? (
                <p className="text-destructive px-4">
                  {" "}
                  {postsError?.message || "Failed to load posts."}{" "}
                </p>
              ) : posts.length === 0 ? (
                <div className="flex justify-center items-center pt-8">
                  <p className="text-muted-foreground px-4">
                    {" "}
                    This user hasn&apos;t posted anything yet.
                  </p>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostView key={post.id} post={post} />
                  ))}

                  {currentPage < totalPages && (
                    <div className="text-center pt-4">
                      <Button onClick={() => handlePageChange(currentPage + 1)}>
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}

              {currentPage < totalPages && (
                <div className="text-center pt-4">
                  <Button onClick={() => handlePageChange(currentPage + 1)}>
                    Load More
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="media">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="relative aspect-square rounded-lg overflow-hidden bg-accent/20"
                  >
                    <Image
                      src={`/images/user.webp`}
                      alt={`Media ${item}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="py-8 text-center text-muted-foreground">
                Liked posts will appear here
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-muted-foreground">
                    Product Designer, Photographer, and Creative Director with
                    over 10 years of experience. Always exploring new ideas and
                    pushing boundaries in the digital space.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Work</h3>
                  <div className="space-y-2">
                    <p>Creative Director at DesignCo · 2020 - Present</p>
                    <p>Senior Designer at TechInc · 2015 - 2020</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Education</h3>
                  <div className="space-y-2">
                    <p>MFA Design, California College of Arts · 2012 - 2015</p>
                    <p>BA Visual Arts, State University · 2008 - 2012</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
