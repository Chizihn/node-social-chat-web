import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  MapPin,
  Smile,
  X,
  Tag,
  Loader2,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { API_URL } from "@/constants";
import { token } from "@/utils/session";
import Image from "next/image";
import { toast } from "sonner";

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
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
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
    setTagInput("");
    setPreviewImages([]);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
    if (!content.trim()) {
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

      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

        {isExpanded && (
          <>
            {/* Image previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {previewImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden bg-muted/50"
                  >
                    <Image
                      src={img.preview}
                      alt={`Preview ${index}`}
                      layout="fill"
                      objectFit="cover"
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

            {/* Tags input */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="flex items-center text-muted-foreground text-sm">
                <Tag className="h-4 w-4 mr-1" /> Add tags:
              </div>

              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              <Input
                className="flex-1 h-8 min-w-[150px]"
                placeholder="Type tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={isSubmitting}
              />
            </div>

            {/* Location input */}
            <div className="flex items-center gap-2 mt-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                className="flex-1"
                placeholder="Add your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => {
              fileInputRef.current?.click();
              handleExpand();
            }}
            disabled={isSubmitting}
          >
            <ImageIcon className="h-4 w-4" /> Photos
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
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleExpand}
            disabled={isSubmitting}
          >
            <Smile className="h-4 w-4" /> Feeling
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleExpand}
            disabled={isSubmitting}
          >
            <MapPin className="h-4 w-4" /> Check in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
