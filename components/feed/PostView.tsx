"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import {
  Check,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Post } from "@/types/post";
import { axiosErrorHandler } from "@/utils/error";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/utils";
import { useLikedItems } from "@/lib/queries/useLike";
import api from "@/lib/api";

type PostProps = {
  post: Post;
  loading?: boolean;
  error?: string | null;
};

const PostView: React.FC<PostProps> = ({ post, loading, error }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const router = useRouter(); // <-- Use router

  // Fetch liked items for the user
  const { likedItems } = useLikedItems({ type: "Post" });

  // Extract liked post IDs as a Set for fast lookup
  const likedPostIds = useMemo(
    () => new Set(likedItems.map((item) => item.targetId)),
    [likedItems]
  );

  // Sync the initial state of `liked` based on the liked post IDs
  useEffect(() => {
    setLiked(likedPostIds.has(post.id));
  }, [likedItems, likedPostIds, post.id]);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;

    // Optimistically update the UI
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await api.post(`/posts/${post.id}/like`, {});
    } catch (error) {
      const err = axiosErrorHandler(error);
      console.error("Like post error", err);
      setLiked(prevLiked); // Revert state if the request fails
      setLikeCount(prevCount);
      toast.error("Error liking post. Please try again.");
    }
  };

  if (loading)
    return (
      <div>
        <p>
          <p className="text-muted-foreground px-4">Loading posts...</p>
        </p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  return (
    <Card className="mb-6 border border-border rounded-lg overflow-hidden shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Avatar on the Left */}
          <Avatar className="h-10 w-10 border border-border flex-shrink-0">
            <AvatarImage
              src={post.user.avatar || "/images/default-avatar.webp"}
              alt={post.user.username}
            />
            <AvatarFallback>
              {post.user.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Right Side: Post Content */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center flex-wrap gap-x-1 text-sm leading-tight">
                <span className="font-medium">
                  {post.user.firstName} {post.user.lastName}
                </span>
                <span className="text-muted-foreground">
                  @{post.user.username}
                </span>
                {post.isVerified && (
                  <Badge
                    variant="outline"
                    className="h-4 bg-blue-500 text-white px-1"
                  >
                    <Check className="h-3 w-3" />
                  </Badge>
                )}
                <span className="text-muted-foreground">
                  · {timeAgo(post.createdAt)}
                </span>
                {post.location && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    · <MapPin className="h-3 w-3" />
                    {post.location}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full ml-auto"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Content */}
            <p className="text-sm mb-2">{post.content}</p>

            {/* Media */}
            {post.media?.length > 0 && (
              <div
                className={`grid gap-2 rounded-md overflow-hidden ${
                  post.media.length === 1
                    ? ""
                    : post.media.length === 2
                    ? "grid-cols-2"
                    : post.media.length === 3
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {post.media.map((url, index) => {
                  const isThirdInThree = post.media.length === 3 && index === 2;
                  return (
                    <div
                      key={index}
                      className={`bg-accent/20 ${
                        post.media.length === 1
                          ? "aspect-video"
                          : post.media.length === 3
                          ? isThirdInThree
                            ? "col-span-2 aspect-video"
                            : "aspect-square"
                          : "aspect-square"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Post image ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between text-muted-foreground text-sm pt-1">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${
                  liked ? "text-primary fill-primary" : ""
                }`} // Show the filled heart when liked
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${
                    liked ? "fill-primary text-primary" : "fill-none"
                  }`}
                />

                {likeCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => router.push(`/feed/${post.id}`)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </Button>
              {/* <Button variant="ghost" size="sm" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bookmark className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostView;
