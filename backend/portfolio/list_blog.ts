import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { portfolioDB } from "./db";

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

export interface ListBlogParams {
  published?: Query<boolean>;
  limit?: Query<number>;
}

export interface ListBlogResponse {
  posts: BlogPost[];
}

// Retrieves blog posts with optional filtering.
export const listBlog = api<ListBlogParams, ListBlogResponse>(
  { expose: true, method: "GET", path: "/blog" },
  async (params) => {
    let query = `
      SELECT id, title, slug, excerpt, content, featured_image_url, 
             published, published_at, created_at, updated_at
      FROM blog_posts
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.published !== undefined) {
      query += ` AND published = $${paramIndex}`;
      queryParams.push(params.published);
      paramIndex++;
    }

    query += ` ORDER BY published_at DESC, created_at DESC`;

    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    const posts = await portfolioDB.rawQueryAll<BlogPost>(query, ...queryParams);
    return { posts };
  }
);
