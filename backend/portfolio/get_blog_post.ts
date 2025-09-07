import { api, APIError } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface GetBlogPostParams {
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Retrieves a single blog post by slug.
export const getBlogPost = api<GetBlogPostParams, BlogPost>(
  { expose: true, method: "GET", path: "/blog/:slug" },
  async (params) => {
    const post = await portfolioDB.queryRow<BlogPost>`
      SELECT id, title, slug, excerpt, content, featured_image_url, 
             published, published_at, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${params.slug} AND published = true
    `;
    
    if (!post) {
      throw APIError.notFound("blog post not found");
    }
    
    return post;
  }
);
