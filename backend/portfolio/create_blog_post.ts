import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
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
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image_url, published, published_at,
        meta_title, meta_description, meta_keywords
      )
      VALUES (
        ${req.title}, ${req.slug}, ${req.excerpt}, ${req.content}, 
        ${req.featured_image_url}, ${req.published}, ${publishedAt},
        ${req.meta_title}, ${req.meta_description}, ${req.meta_keywords}
      )
      RETURNING id
    `;
    
    return {
      id: result!.id,
      message: "Blog post created successfully",
    };
  }
);
