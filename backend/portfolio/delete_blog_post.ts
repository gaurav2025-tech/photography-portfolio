import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface DeleteBlogPostRequest {
  id: number;
}

export interface DeleteBlogPostResponse {
  message: string;
}

// Deletes a blog post.
export const deleteBlogPost = api<DeleteBlogPostRequest, DeleteBlogPostResponse>(
  { expose: true, method: "DELETE", path: "/admin/blog/:id", auth: true },
  async (req) => {
    await portfolioDB.exec`DELETE FROM blog_posts WHERE id = ${req.id}`;
    
    return {
      message: "Blog post deleted successfully",
    };
  }
);
