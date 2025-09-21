import { useState } from "react";
import {
  cloudinaryService,
  CloudinaryUploadResult,
  UploadType,
} from "@/services/cloudinaryService";

interface UseImageUploadReturn {
  uploadImage: (
    file: File,
    type: UploadType
  ) => Promise<CloudinaryUploadResult>;
  isUploading: boolean;
  uploadError: string | null;
  // Convenience methods for specific upload types
  uploadAvatar: (file: File) => Promise<CloudinaryUploadResult>;
  uploadPostCover: (file: File) => Promise<CloudinaryUploadResult>;
  uploadMarkdownImage: (file: File) => Promise<CloudinaryUploadResult>;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    type: UploadType
  ): Promise<CloudinaryUploadResult> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file using the service
      const validation = cloudinaryService.validateFile(file, type);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await cloudinaryService.uploadImage(file, type);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Convenience methods for specific upload types
  const uploadAvatar = async (file: File) => {
    return uploadImage(file, "avatar");
  };

  const uploadPostCover = async (file: File) => {
    return uploadImage(file, "post-cover");
  };

  const uploadMarkdownImage = async (file: File) => {
    return uploadImage(file, "markdown-image");
  };

  return {
    uploadImage,
    isUploading,
    uploadError,
    uploadAvatar,
    uploadPostCover,
    uploadMarkdownImage,
  };
};

// Legacy hook for backward compatibility
export const useAvatarUpload = () => {
  const { uploadAvatar, isUploading, uploadError } = useImageUpload();

  return {
    uploadAvatar,
    isUploading,
    uploadError,
  };
};
