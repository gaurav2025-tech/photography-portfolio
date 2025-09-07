import { api, APIError } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface UpdateBlogPostRequest {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  published: boolean;
}

export interface UpdateBlogPostResponse {
  message: string;
}

// Updates an existing blog post.
export const updateBlogPost = api<UpdateBlogPostRequest, UpdateBlogPostResponse>(
  { expose: true, method: "PUT", path: "/admin/blog/:id", auth: true },
  async (req) => {
    const publishedAt = req.published ? new Date() : null;
    
    const result = await portfolioDB.exec`
      UPDATE blog_posts 
      SET title = ${req.title}, slug = ${req.slug}, excerpt = ${req.excerpt}, 
          content = ${req.content}, featured_image_url = ${req.featured_image_url}, 
          published = ${req.published}, published_at = ${publishedAt}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.id}
    `;
    
    return {
      message: "Blog post updated successfully",
    };
  }
);
