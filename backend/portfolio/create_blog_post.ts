import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  published: boolean;
}

export interface CreateBlogPostResponse {
  id: number;
  message: string;
}

// Creates a new blog post.
export const createBlogPost = api<CreateBlogPostRequest, CreateBlogPostResponse>(
  { expose: true, method: "POST", path: "/admin/blog", auth: true },
  async (req) => {
    const publishedAt = req.published ? new Date() : null;
    
    const result = await portfolioDB.queryRow<{ id: number }>`
      INSERT INTO blog_posts (title, slug, excerpt, content, featured_image_url, published, published_at)
      VALUES (${req.title}, ${req.slug}, ${req.excerpt}, ${req.content}, ${req.featured_image_url}, ${req.published}, ${publishedAt})
      RETURNING id
    `;
    
    return {
      id: result!.id,
      message: "Blog post created successfully",
    };
  }
);
