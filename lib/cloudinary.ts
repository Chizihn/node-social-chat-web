import { CloudinaryUploadResponse } from "@/types/cloudinary";

export class CloudinaryService {
  static CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  static UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  static async uploadFile(file: File): Promise<CloudinaryUploadResponse> {
    if (!this.CLOUD_NAME || !this.UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.UPLOAD_PRESET);
    formData.append("cloud_name", this.CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        resourceType: data.resource_type,
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }

  static async uploadMultipleFiles(
    files: File[]
  ): Promise<CloudinaryUploadResponse[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  static getFileType(file: File): "image" | "video" | "unknown" {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "unknown";
  }

  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  static validateFileType(
    file: File,
    allowedTypes: string[] = ["image/*", "video/*"]
  ): boolean {
    return allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });
  }
}
