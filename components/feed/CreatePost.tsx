import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, X, Loader2, Send } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/api";

type CreatePostProps = {
  onPostCreated?: () => void;
  userAvatar?: string;
  userName?: string;
};

const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  userAvatar = "/images/user.webp",
  userName = "User",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent("");
    setLocation("");
    setTags([]);
    setPreviewImages([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);

      // Create preview URLs for selected images
      const newPreviews = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async () => {
    if (!previewImages || !content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the preview image URLs for the media
      const uploadedMedia = previewImages.map((img) => img.preview);

      const postData = {
        content,
        tags,
        media: uploadedMedia,
        location: location.trim() || undefined,
      };

      const response = await api.post(`/posts`, postData);

      if (response.status === 201) {
        toast.success("Post created successfully");
        handleCancel();
        if (onPostCreated) {
          onPostCreated();
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>

          {isExpanded ? (
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none w-full"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />

              {/* Moved Add Photo Button */}
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="h-4 w-4" /> Add Photo
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isSubmitting}
                  />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 bg-muted/30 rounded-full px-4 py-2 cursor-text hover:bg-muted/50 transition-colors flex items-center text-muted-foreground"
              onClick={handleExpand}
            >
              What&apos;s on your mind?
            </div>
          )}
        </div>

        {/* Image Previews */}
        {isExpanded && previewImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden bg-muted/50"
              >
                <Image
                  src={img.preview}
                  alt={`Preview ${index}`}
                  fill
                  objectFit="contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {isExpanded && (
          <div className="flex justify-end mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={
                isSubmitting || (previewImages.length < 1 && !content.trim())
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </>
              )}
            </Button>
          </div>
        )}

        <Separator className="my-4" />

        {/* Removed the extra buttons here */}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
