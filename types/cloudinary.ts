export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
}

export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface FileValidation {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}
