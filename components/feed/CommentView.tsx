"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Smile, Send } from "lucide-react";
import { toast } from "sonner";
import { Comment, Comments, CreateComment, Post } from "@/types/post";
import { useAddComment, useCommentsByPost } from "@/lib/queries/useComments";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types/user";
import { token } from "@/utils/session";
import { useLikedItems } from "@/lib/queries/useLike";
import CommentCard from "../cards/CommentCard";
import api from "@/lib/api";

const CommentView: React.FC<{ postId: string; post: Post }> = ({
  postId,
  post,
}) => {
  const {
    comments: initialComments,
    isLoading: commentsLoading,
    error,
  } = useCommentsByPost(postId);

  const user = useAuthStore((state) => state.user) as User;
  const [comments, setComments] = useState<Comments>([]);
  const [pendingCommentIds, setPendingCommentIds] = useState<Set<string>>(
    new Set()
  );
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Fetch liked items for the user
  const { likedItems } = useLikedItems({ type: "Comment" });

  // Extract liked post IDs as a Set for fast lookup
  const likedPostIds = useMemo(
    () => new Set(likedItems.map((item) => item.targetId)),
    [likedItems]
  );

  // Update comments when data loads from the query
  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
    setLiked(likedPostIds.has(post.id));

    // Initialize liked comments from the API data
    const likedCommentIds = new Set(
      likedItems
        .filter((item) => item.type === "Comment")
        .map((item) => item.targetId)
    );
    setLikedComments(likedCommentIds);
  }, [initialComments, likedItems, likedPostIds, post.id]);

  const { addComment, isLoading } = useAddComment(postId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Generate a temporary ID for pending comment
    const tempId = `temp-${Date.now()}`;

    const parentCommentObj = replyingTo
      ? comments.find((c) => c.id === replyingTo)
      : undefined;

    // Prepare comment data
    const commentData: CreateComment = {
      content: newComment,
      parentComment: parentCommentObj as Comment,
    };

    // Create a temporary comment object
    const tempComment: Comment = {
      id: tempId,
      content: newComment,
      post: post,
      user: user,
      likes: 0,
      parentComment: parentCommentObj,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Track this comment as pending
    setPendingCommentIds((prev) => new Set(prev).add(tempId));

    // Add temporary comment to state
    setComments((prev) => [...prev, tempComment]);
    setNewComment("");

    if (replyingTo) {
      setReplyingTo(null); // Reset reply state
    }

    try {
      // Send to API
      const savedComment = await addComment(commentData);

      // Remove from pending set
      setPendingCommentIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });

      // Replace temp comment with saved one
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? savedComment : c))
      );
    } catch (err) {
      console.error("Comment failed", err);
      toast.error("Failed to add comment");

      // Remove failed comment
      setComments((prev) => prev.filter((c) => c.id !== tempId));

      // Remove from pending set
      setPendingCommentIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  const handleLikeComment = async (id: string) => {
    const commentToUpdate = comments.find((c) => c.id === id);
    if (!commentToUpdate) return;

    // Check if the comment was already liked
    const prevLiked = likedComments.has(id);
    const prevLikes = commentToUpdate.likes;

    // Optimistically update UI
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, likes: prevLiked ? prevLikes - 1 : prevLikes + 1 }
          : c
      )
    );

    // Update liked comments set
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (prevLiked) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    try {
      // API call to like/unlike
      await api.post(
        `/comments/${id}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Revert on error
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: prevLikes } : c))
      );

      // Revert liked state
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        if (prevLiked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });

      toast.error("Failed to like comment. Please try again.");
      console.error("Error liking comment:", error);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // Get the comment we're replying to (if any)
  const replyingToComment = replyingTo
    ? comments.find((c) => c.id === replyingTo)
    : null;

  if (commentsLoading) {
    return <div className="p-4 text-center">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading comments: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="mt-8 px-2">
      <h2 className="font-medium text-lg mb-4">Comments ({comments.length})</h2>

      <div className="flex-1 relative mb-6">
        <div className="flex bg-muted/30 rounded-lg overflow-hidden border focus-within:ring-1 focus-within:ring-primary">
          <Input
            placeholder={
              replyingToComment
                ? `Reply to @${replyingToComment.user?.username || "User"}...`
                : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            className="border-0 shadow-none focus-visible:ring-0 rounded-none px-3 py-2 h-10 text-sm bg-transparent flex-1"
          />

          <div className="flex items-center gap-1 pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
            >
              <Smile className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handleAddComment}
              disabled={!newComment.trim() || isLoading}
              className="h-8 px-3 rounded-full"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isPending = pendingCommentIds.has(comment.id);
            const isLiked = likedComments.has(comment.id);

            return (
              <CommentCard
                key={comment.id}
                comment={comment}
                isPending={isPending}
                isLiked={liked || isLiked}
                onReply={handleReplyClick}
                onLike={handleLikeComment}
              />
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm py-2">
            Be the first to comment.
          </p>
        )}
      </div>

      {/* Comment Input Box */}
      <div className="border-t pt-4 mt-6">
        {/* Replying To Info */}
        {replyingToComment && (
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <span>
              Replying to{" "}
              <span className="font-medium">
                @{replyingToComment.user?.firstName || "User"}
              </span>
            </span>
            <button
              className="text-xs hover:text-primary transition-colors"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default CommentView;
