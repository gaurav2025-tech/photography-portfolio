import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string | null;
  content: string;
  rating: number | null;
  featured: boolean;
  created_at: Date;
}

export interface ListTestimonialsParams {
  featured?: Query<boolean>;
  limit?: Query<number>;
}

export interface ListTestimonialsResponse {
  testimonials: Testimonial[];
}

// Retrieves testimonials with optional filtering.
export const listTestimonials = api<ListTestimonialsParams, ListTestimonialsResponse>(
  { expose: true, method: "GET", path: "/testimonials" },
  async (params) => {
    let query = `
      SELECT id, client_name, client_role, content, rating, featured, created_at
      FROM testimonials
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.featured !== undefined) {
      query += ` AND featured = $${paramIndex}`;
      queryParams.push(params.featured);
      paramIndex++;
    }

    query += ` ORDER BY featured DESC, created_at DESC`;

    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    const testimonials = await portfolioDB.rawQueryAll<Testimonial>(query, ...queryParams);
    return { testimonials };
  }
);
