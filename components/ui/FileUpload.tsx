"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { FileValidation } from "@/types/cloudinary";
import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  validation?: FileValidation;
  multiple?: boolean;
  className?: string;
  buttonText?: string;
  showProgress?: boolean;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  validation,
  multiple = false,
  className,
  buttonText = "Upload Files",
  showProgress = true,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, uploadState, resetUploadState } =
    useCloudinaryUpload(validation);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      try {
        const uploadResults = await uploadFiles(files);
        const urls = uploadResults.map((result) => result.url);
        onUploadComplete(urls);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        onUploadError?.(errorMessage);
      }
    },
    [uploadFiles, onUploadComplete, onUploadError]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    resetUploadState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple={multiple}
        className="hidden"
        accept="image/*,video/*"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={uploadState.isUploading}
        className="flex items-center gap-2"
      >
        <UploadCloud className="h-4 w-4" />
        {buttonText}
      </Button>

      {showProgress && uploadState.isUploading && (
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Uploading...</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelUpload}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        </div>
      )}

      {uploadState.error && (
        <p className="text-sm text-destructive">{uploadState.error}</p>
      )}
    </div>
  );
}
