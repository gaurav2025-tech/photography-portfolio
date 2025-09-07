import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryCloudName = secret("CloudinaryCloudName");
const cloudinaryApiKey = secret("CloudinaryApiKey");
const cloudinaryApiSecret = secret("CloudinaryApiSecret");

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryCloudName(),
  api_key: cloudinaryApiKey(),
  api_secret: cloudinaryApiSecret(),
});

export interface UploadImageRequest {
  imageData: string; // Base64 encoded image data
  folder?: string; // Optional folder for organization
}

export interface UploadImageResponse {
  url: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

// Uploads an image to Cloudinary.
export const uploadImage = api<UploadImageRequest, UploadImageResponse>(
  { expose: true, method: "POST", path: "/storage/upload", auth: true },
  async (req) => {
    try {
      const result = await cloudinary.uploader.upload(req.imageData, {
        folder: req.folder || "portfolio",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
      });

      return {
        url: result.url,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image");
    }
  }
);

export interface DeleteImageRequest {
  publicId: string;
}

export interface DeleteImageResponse {
  success: boolean;
  message: string;
}

// Deletes an image from Cloudinary.
export const deleteImage = api<DeleteImageRequest, DeleteImageResponse>(
  { expose: true, method: "DELETE", path: "/storage/delete", auth: true },
  async (req) => {
    try {
      const result = await cloudinary.uploader.destroy(req.publicId);
      
      return {
        success: result.result === "ok",
        message: result.result === "ok" ? "Image deleted successfully" : "Failed to delete image",
      };
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("Failed to delete image");
    }
  }
);
