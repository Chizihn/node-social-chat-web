import { Posts } from "@/types/post";
import React from "react";
import PostView from "./PostView";
import { Button } from "../ui/button";

type PostProps = {
  posts: Posts;
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (value: number) => void;
  message?: string;
};

const PostList: React.FC<PostProps> = ({
  posts,
  loading,
  error,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  message = "You havn't posted anything yet.",
}) => {
  return (
    <>
      {loading ? (
        <p className="text-muted-foreground px-4">Loading posts...</p>
      ) : error ? (
        <p className="text-destructive px-4">
          {" "}
          {error || "Failed to load posts."}{" "}
        </p>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center pt-8">
          <p className="text-muted-foreground px-4"> {message}</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostView key={post.id} post={post} />
          ))}

          {currentPage < totalPages && (
            <div className="text-center pt-4">
              <Button onClick={() => onPageChange?.(currentPage + 1)}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PostList;
