"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import {
  Bookmark,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Post } from "@/types/post";
import { API_URL } from "@/constants";
import { axiosErrorHandler } from "@/utils/error";
import { toast } from "sonner";
import axios from "axios";
import { token } from "@/utils/session";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/utils";
import { useLikedItems } from "@/lib/queries/useLike";

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
      await axios.post(
        `${API_URL}/posts/${post.id}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
                        width={800}
                        height={500}
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
              <Button variant="ghost" size="sm" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    // <Card className="overflow-hidden mb-6 shadow-sm transition-all">
    //   <CardContent className="p-4 space-y-4">
    //     {/* Header */}
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-3">
    //         <Avatar className="h-10 w-10 border border-border">
    //           <AvatarImage src={post.user.avatar} alt={post.user.username} />
    //           <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
    //             {post.user.username?.[0]?.toUpperCase()}
    //           </AvatarFallback>
    //         </Avatar>
    //         <div>
    //           <div className="flex items-center gap-2">
    //             <span className="font-medium text-sm leading-tight">
    //               {post.user.firstName} {post.user.lastName}
    //             </span>
    //             {post.user.username && (
    //               <span className="text-xs text-muted-foreground">
    //                 @{post.user.username}
    //               </span>
    //             )}
    //             {post.isVerified && (
    //               <Badge
    //                 variant="outline"
    //                 className="h-4 bg-blue-500 text-white px-1"
    //               >
    //                 <Check className="h-3 w-3" />
    //               </Badge>
    //             )}
    //           </div>
    //           <p className="text-xs text-muted-foreground flex items-center gap-1">
    //             {new Date(post.createdAt).toLocaleDateString()}
    //             {post.location && (
    //               <>
    //                 · <MapPin className="h-3 w-3" />
    //                 {post.location}
    //               </>
    //             )}
    //           </p>
    //         </div>
    //       </div>
    //       <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
    //         <MoreHorizontal className="h-4 w-4" />
    //       </Button>
    //     </div>

    //     {/* Content */}
    //     <div>
    //       <p className="text-sm mb-2">{post.content}</p>
    //     </div>

    //     {/* Media Gallery */}
    //     {post.media?.length > 0 && (
    //       <div
    //         className={`grid gap-2 rounded-md overflow-hidden ${
    //           post.media.length === 1
    //             ? ""
    //             : post.media.length === 2
    //             ? "grid-cols-2"
    //             : post.media.length === 3
    //             ? "grid-cols-2 grid-rows-2"
    //             : "grid-cols-2 sm:grid-cols-3"
    //         }`}
    //       >
    //         {post.media.map((url, index) => {
    //           const isThirdInThree = post.media.length === 3 && index === 2;
    //           return (
    //             <div
    //               key={index}
    //               className={`bg-accent/20 ${
    //                 post.media.length === 1
    //                   ? "aspect-video"
    //                   : post.media.length === 3
    //                   ? isThirdInThree
    //                     ? "col-span-2 aspect-video"
    //                     : "aspect-square"
    //                   : "aspect-square"
    //               }`}
    //             >
    //               <Image
    //                 src={url}
    //                 alt={`Post image ${index + 1}`}
    //                 width={800}
    //                 height={500}
    //                 className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform"
    //               />
    //             </div>
    //           );
    //         })}
    //       </div>
    //     )}

    //     {/* Stats */}
    //     <div className="flex items-center justify-between text-xs text-muted-foreground">
    //       <div className="flex items-center gap-1">
    //         <div className="bg-primary/10 text-primary rounded-full p-1">
    //           <Heart className="h-3 w-3 fill-primary text-primary" />
    //         </div>
    //         <span>{likeCount} likes</span>
    //       </div>
    //       <div className="flex gap-3">
    //         <button className="hover:underline">
    //           {post.comments} comments
    //         </button>
    //         <button className="hover:underline">
    //           {post.shares || 0} shares
    //         </button>
    //       </div>
    //     </div>

    //     <Separator />

    //     {/* Actions */}
    //     <div className="flex justify-around">
    //       {actions.map(({ label, icon: Icon, onClick, active }, index) => (
    //         <Button
    //           key={index}
    //           variant="ghost"
    //           className={`py-2 h-12 flex-1 justify-center ${
    //             active ? "text-primary" : ""
    //           }`}
    //           onClick={onClick}
    //         >
    //           <Icon
    //             className={`mr-2 h-4 w-4 ${
    //               active ? "fill-primary text-primary" : ""
    //             }`}
    //           />
    //           <span className="hidden lg:inline">{label}</span>
    //         </Button>
    //       ))}
    //     </div>
    //   </CardContent>
    // </Card>
  );
};

export default PostView;

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "../ui/button";
// import {
//   Bookmark,
//   Check,
//   Heart,
//   MapPin,
//   MessageCircle,
//   MoreHorizontal,
//   Paperclip,
//   Repeat,
//   Send,
//   Share2,
//   Smile,
// } from "lucide-react";
// import { Badge } from "../ui/badge";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { Post } from "@/types/post";
// import { API_URL } from "@/constants";
// import { axiosErrorHandler } from "@/utils/error";
// import { toast } from "sonner";
// import axios from "axios";
// import { token } from "@/utils/session";

// type PostProps = {
//   post: Post;
//   isCommentOpen: boolean;
//   onToggleComment: () => void;
// };

// const PostView: React.FC<PostProps> = ({
//   post,
//   isCommentOpen,
//   onToggleComment,
// }) => {
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes);

//   const handleLike = async () => {
//     const prevLiked = liked;
//     const prevCount = likeCount;

//     // Optimistically update UI
//     setLiked(!prevLiked);
//     setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

//     try {

//       await axios.post(
//         `${API_URL}/posts/${post.id}/like`,
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // All good, leave the optimistic update as-is
//     } catch (error) {
//       const err = axiosErrorHandler(error);
//       console.error("Like post error", err);
//       // Revert optimistic update
//       setLiked(prevLiked);
//       setLikeCount(prevCount);

//       toast.error("Error liking post. Please try again.");
//     }
//   };

//   const actions = [
//     {
//       label: "Like",
//       icon: Heart,
//       onClick: handleLike,
//       active: liked,
//     },
//     {
//       label: "Comment",
//       icon: MessageCircle,
//       onClick: onToggleComment,
//     },
//     {
//       label: "Repost",
//       icon: Repeat,
//     },
//     {
//       label: "Share",
//       icon: Share2,
//     },
//     {
//       label: "Save",
//       icon: Bookmark,
//     },
//   ];

//   return (
//     <Card className="overflow-hidden mb-6 shadow-sm transition-all">
//       <CardContent className="p-4 space-y-4">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Avatar className="h-10 w-10 border border-border">
//               <AvatarImage src={post.user.avatar} alt={post.user.username} />
//               <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
//                 {post.user.username?.[0]?.toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-medium text-sm leading-tight">
//                   {post.user.firstName} {post.user.lastName}
//                 </span>
//                 {post.user.username && (
//                   <span className="text-xs text-muted-foreground">
//                     @{post.user.username}
//                   </span>
//                 )}
//                 {post.isVerified && (
//                   <Badge
//                     variant="outline"
//                     className="h-4 bg-blue-500 text-white px-1"
//                   >
//                     <Check className="h-3 w-3" />
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-xs text-muted-foreground flex items-center gap-1">
//                 {new Date(post.createdAt).toLocaleDateString()}
//                 {post.location && (
//                   <>
//                     · <MapPin className="h-3 w-3" />
//                     {post.location}
//                   </>
//                 )}
//               </p>
//             </div>
//           </div>
//           <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Content */}
//         <div>
//           <p className="text-sm mb-2">{post.content}</p>
//           {post.tags?.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {post.tags.map((tag, i) => (
//                 <Badge
//                   key={i}
//                   variant="secondary"
//                   className="text-xs bg-accent/50 hover:bg-accent cursor-pointer"
//                 >
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Media Gallery */}
//         {post.media?.length > 0 && (
//           <div
//             className={`grid gap-2 rounded-md overflow-hidden ${
//               post.media.length === 1
//                 ? ""
//                 : post.media.length === 2
//                 ? "grid-cols-2"
//                 : post.media.length === 3
//                 ? "grid-cols-2 grid-rows-2"
//                 : "grid-cols-2 sm:grid-cols-3"
//             }`}
//           >
//             {post.media.map((url, index) => {
//               const isThirdInThree = post.media.length === 3 && index === 2;
//               return (
//                 <div
//                   key={index}
//                   className={`bg-accent/20 ${
//                     post.media.length === 1
//                       ? "aspect-video"
//                       : post.media.length === 3
//                       ? isThirdInThree
//                         ? "col-span-2 aspect-video"
//                         : "aspect-square"
//                       : "aspect-square"
//                   }`}
//                 >
//                   <Image
//                     src={url}
//                     alt={`Post image ${index + 1}`}
//                     width={800}
//                     height={500}
//                     className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform"
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Stats */}
//         <div className="flex items-center justify-between text-xs text-muted-foreground">
//           <div className="flex items-center gap-1">
//             <div className="bg-primary/10 text-primary rounded-full p-1">
//               <Heart className="h-3 w-3 fill-primary text-primary" />
//             </div>
//             <span>{likeCount} likes</span>
//           </div>
//           <div className="flex gap-3">
//             <button className="hover:underline">
//               {post.comments} comments
//             </button>
//             <button className="hover:underline">
//               {post.shares || 0} shares
//             </button>
//           </div>
//         </div>

//         <Separator />

//         {/* Actions */}
//         <div className="flex justify-around">
//           {actions.map(({ label, icon: Icon, onClick, active }, index) => (
//             <Button
//               key={index}
//               variant="ghost"
//               className={`py-2 h-12 flex-1 justify-center ${
//                 active ? "text-primary" : ""
//               }`}
//               onClick={onClick}
//             >
//               <Icon
//                 className={`mr-2 h-4 w-4 ${
//                   active ? "fill-primary text-primary" : ""
//                 }`}
//               />
//               <span className="hidden lg:inline">{label}</span>
//             </Button>
//           ))}
//         </div>

//         {/* Comment Box */}
//         <div
//           className={`transition-all duration-300 overflow-hidden ${
//             isCommentOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           {isCommentOpen && (
//             <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md mt-2">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="/images/user.webp" alt="Your profile" />
//                 <AvatarFallback>Y</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border border-input">
//                 <Input
//                   placeholder="Write a comment..."
//                   className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-sm bg-transparent"
//                 />
//                 <div className="flex gap-1 text-muted-foreground">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7 rounded-full"
//                   >
//                     <Smile className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7 rounded-full"
//                   >
//                     <Paperclip className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7 rounded-full"
//                   >
//                     <Send className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PostView;
