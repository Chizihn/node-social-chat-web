// CommentCard.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils";
import { Comment } from "@/types/post";

interface CommentCardProps {
  comment: Comment;
  isPending: boolean;
  isLiked: boolean;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  isPending,
  isLiked,
  onReply,
  onLike,
}) => {
  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar} alt="User avatar" />
          <AvatarFallback>
            {comment.user?.firstName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user?.firstName || "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Reply Info */}
          {comment.parentComment && (
            <p className="text-xs text-muted-foreground mb-1">
              Replying to @{comment.parentComment.user?.firstName || "User"}
            </p>
          )}

          {/* Comment Text */}
          <div
            className={cn(
              "text-sm",
              isPending && "text-muted-foreground italic animate-pulse"
            )}
          >
            {comment.content}
          </div>

          {/* Actions */}
          {!isPending && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${isLiked ? "text-primary" : ""}`}
                onClick={() => onLike(comment.id)}
              >
                <Heart className="h-3 w-3" />
                <span>{comment.likes || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => onReply(comment.id)}
              >
                <MessageSquare className="h-3 w-3" />
                <span>Reply</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
