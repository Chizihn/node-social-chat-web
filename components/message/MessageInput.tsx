import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Paperclip,
  Send,
  X,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
} from "lucide-react";
import { toast } from "sonner";
import { CloudinaryUploadResponse } from "@/types/cloudinary";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: string[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}) => {
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<
    CloudinaryUploadResponse[]
  >([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { uploadFiles, uploadState } = useCloudinaryUpload({
    maxSizeMB: 10,
    allowedTypes: ["image/*", "video/*", "audio/*", "application/pdf"],
    maxFiles: 10,
  });

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && onTypingStop) {
        onTypingStop();
      }
    };
  }, [isTyping, onTypingStop]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    if (!isTyping && newMessage.trim().length > 0) {
      setIsTyping(true);
      if (onTypingStart) onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTypingStop) onTypingStop();
      }
    }, 2000);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const results = await uploadFiles(files);
      setUploadedAttachments((prev) => [...prev, ...results]);
      toast.success(
        `${files.length} file${
          files.length > 1 ? "s" : ""
        } uploaded successfully`
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(uploadState.error || "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
      handleFileUpload(newFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSend = () => {
    if (message.trim() || uploadedAttachments.length > 0) {
      const attachmentUrls = uploadedAttachments.map((file) => file.url);
      const finalMessage = message.trim() || "";

      onSendMessage(
        finalMessage,
        attachmentUrls.length > 0 ? attachmentUrls : undefined
      );

      setMessage("");
      setUploadedAttachments([]);
      setAttachments([]);

      if (isTyping) {
        setIsTyping(false);
        if (onTypingStop) onTypingStop();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedAttachment = (index: number) => {
    setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-3 w-3 mr-1" />;
    if (file.type.startsWith("video/"))
      return <Film className="h-3 w-3 mr-1" />;
    if (file.type.startsWith("audio/"))
      return <Music className="h-3 w-3 mr-1" />;
    return <FileText className="h-3 w-3 mr-1" />;
  };

  return (
    <div className="border-t p-3 space-y-2">
      {uploadedAttachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {uploadedAttachments.map((file, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative bg-green-50 rounded-md p-2 text-xs flex items-center"
            >
              <FileText className="h-3 w-3 mr-1 text-green-600" />
              <span className="max-w-[150px] truncate text-green-700">
                {file.resourceType || `File ${index + 1}`}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 rounded-full"
                onClick={() => removeUploadedAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div
              key={`pending-${index}`}
              className="relative bg-muted rounded-md p-2 text-xs flex items-center"
            >
              {getFileIcon(file)}
              <span className="max-w-[150px] truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {isUploading && (
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="animate-pulse">Uploading...</span>
              <span className="ml-1">{uploadState.progress.toFixed(0)}%</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none pr-10"
          />
          {/* <div className="absolute bottom-2 right-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
            </Popover>
          </div> */}
        </div>

        <div className="flex gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,video/*,audio/*,application/pdf"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="rounded-full"
            onClick={handleSend}
            disabled={
              (!message.trim() && uploadedAttachments.length === 0) ||
              isUploading
            }
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
