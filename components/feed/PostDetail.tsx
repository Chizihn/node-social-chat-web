"use client";

import { usePostById, usePosts } from "@/lib/queries/usePost";
import PostView from "./PostView";
import CommentView from "./CommentView";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

const PostDetail: React.FC<{ postId: string }> = ({ postId }) => {
  const router = useRouter();
  const { posts } = usePosts();

  const storedPost = posts.find((p) => p.id === postId);

  // useEffect for any initialization or side effects based on storedPost
  useEffect(() => {
    // You can add logic here if needed when storedPost changes
    // For example, tracking analytics, setting page title, etc.
    console.log("Storepost", storedPost);
  }, [storedPost]);

  const {
    data: fetchedPost,
    isLoading: postLoading,
    error: postError,
  } = usePostById(postId);

  const post = storedPost || fetchedPost;

  const handleBack = () => {
    router.push("/feed");
  };

  if (postLoading && !storedPost) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (postError && !storedPost) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading content: {postError?.message || "Unknown error"}
      </div>
    );
  }

  if (!post) {
    return <div className="p-4 text-center">Post not found</div>;
  }

  return (
    <div className="mt-8 px-2 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        className="self-end mr-2 mt-2 rounded-full flex items-center mb-3"
        onClick={handleBack}
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </Button>
      <PostView key={postId} post={post} />
      <CommentView postId={postId} post={post} />
    </div>
  );
};

export default PostDetail;
