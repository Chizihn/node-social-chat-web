import { useState, useCallback } from "react";
import { CloudinaryService } from "@/lib/cloudinary";
import {
  CloudinaryUploadResponse,
  FileUploadState,
  FileValidation,
} from "@/types/cloudinary";

export const useCloudinaryUpload = (validation: FileValidation = {}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const validateFiles = useCallback(
    (files: File[]): string | null => {
      const {
        maxSizeMB = 10,
        allowedTypes = ["image/*", "video/*"],
        maxFiles = 10,
      } = validation;

      if (files.length > maxFiles) {
        return `Maximum ${maxFiles} files allowed`;
      }

      for (const file of files) {
        if (!CloudinaryService.validateFileSize(file, maxSizeMB)) {
          return `File ${file.name} exceeds maximum size of ${maxSizeMB}MB`;
        }

        if (!CloudinaryService.validateFileType(file, allowedTypes)) {
          return `File ${file.name} type not supported`;
        }
      }

      return null;
    },
    [validation]
  );

  const uploadFiles = useCallback(
    async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
      try {
        setUploadState({ isUploading: true, progress: 0, error: null });

        const validationError = validateFiles(files);
        if (validationError) {
          throw new Error(validationError);
        }

        const totalFiles = files.length;
        const uploadedUrls: CloudinaryUploadResponse[] = [];

        for (let i = 0; i < files.length; i++) {
          const result = await CloudinaryService.uploadFile(files[i]);
          uploadedUrls.push(result);
          setUploadState((prev) => ({
            ...prev,
            progress: ((i + 1) / totalFiles) * 100,
          }));
        }

        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 100,
        }));
        return uploadedUrls;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
        });
        throw error;
      }
    },
    [validateFiles]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<CloudinaryUploadResponse> => {
      const results = await uploadFiles([file]);
      return results[0];
    },
    [uploadFiles]
  );

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    uploadFile,
    uploadFiles,
    uploadState,
    resetUploadState,
  };
};
