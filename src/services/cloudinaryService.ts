export const CLOUDINARY_CONFIG = {
  cloudName: "dz0bzuazo",
  apiKey: "273827579986957",
  apiSecret: "M0howdM9GTacOPp_IdcjfUOkY6E",
  uploadPreset: "ml_default", // This needs to be whitelisted for unsigned uploads
};

export type UploadType = "avatar" | "post-cover" | "markdown-image";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

class CloudinaryService {
  private readonly cloudName = CLOUDINARY_CONFIG.cloudName;
  private readonly uploadPreset = CLOUDINARY_CONFIG.uploadPreset;

  private getUploadConfig(type: UploadType) {
    const configs = {
      avatar: {
        folder: "avatars",
        transformation: "c_thumb,g_face,h_150,w_150,f_auto,q_auto",
        maxSize: 5 * 1024 * 1024, // 5MB
      },
      "post-cover": {
        folder: "post-covers",
        transformation: "c_fill,h_600,w_1200,f_auto,q_auto",
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      "markdown-image": {
        folder: "markdown-images",
        transformation: "f_auto,q_auto,w_auto:breakpoints",
        maxSize: 10 * 1024 * 1024, // 10MB
      },
    };
    return configs[type];
  }

  async uploadImage(
    file: File,
    type: UploadType
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(type);

    // First try unsigned upload with preset
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result: CloudinaryUploadResponse = await response.json();
        console.log("Upload successful with preset:", result);

        return {
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
        };
      } else {
        const errorText = await response.text();
        console.warn(
          "Unsigned upload failed, trying signed upload:",
          errorText
        );
      }
    } catch (error) {
      console.warn("Unsigned upload failed, trying signed upload:", error);
    }

    // Fallback to signed upload
    return await this.uploadWithSignature(file, type);
  }

  private async uploadWithSignature(
    file: File,
    type: UploadType
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(type);

    // Generate signature for signed upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `${config.folder}/${Date.now()}_${
      file.name.split(".")[0]
    }`;

    // Create signature string (must be in alphabetical order)
    const params = [
      `folder=${config.folder}`,
      `public_id=${publicId}`,
      `timestamp=${timestamp}`,
    ].join("&");

    const signatureString = params + CLOUDINARY_CONFIG.apiSecret;

    // Generate SHA-1 hash
    const signature = await this.simpleHash(signatureString);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("public_id", publicId);
    formData.append("folder", config.folder);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Signed upload error response:", errorText);
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result: CloudinaryUploadResponse = await response.json();
      console.log("Upload successful with signature:", result);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error("Cloudinary signed upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  private async simpleHash(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Legacy method for backward compatibility
  async uploadAvatar(file: File): Promise<CloudinaryUploadResult> {
    return this.uploadImage(file, "avatar");
  }

  getOptimizedAvatarUrl(publicId: string, size: number = 150): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/c_thumb,g_face,h_${size},w_${size},f_auto,q_auto/${publicId}`;
  }

  getOptimizedPostCoverUrl(
    publicId: string,
    width: number = 1200,
    height: number = 600
  ): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/c_fill,h_${height},w_${width},f_auto,q_auto/${publicId}`;
  }

  getOptimizedMarkdownImageUrl(publicId: string, width?: number): string {
    const transformation = width
      ? `w_${width},f_auto,q_auto`
      : "f_auto,q_auto,w_auto:breakpoints";
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  getFullUrl(cloudinaryUrl: string): string {
    if (cloudinaryUrl.startsWith("http")) {
      return cloudinaryUrl;
    }

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/f_auto,q_auto/${cloudinaryUrl}`;
  }

  // Get max file size for different upload types
  getMaxFileSize(type: UploadType): number {
    const config = this.getUploadConfig(type);
    return config.maxSize;
  }

  // Validate file for upload type
  validateFile(
    file: File,
    type: UploadType
  ): { valid: boolean; error?: string } {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Please select a valid image file" };
    }

    const maxSize = this.getMaxFileSize(type);
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `Image size must be less than ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  }
}

export const cloudinaryService = new CloudinaryService();
