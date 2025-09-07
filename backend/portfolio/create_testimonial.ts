import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface CreateTestimonialRequest {
  client_name: string;
  client_role?: string;
  content: string;
  rating?: number;
  featured: boolean;
}

export interface CreateTestimonialResponse {
  id: number;
  message: string;
}

// Creates a new testimonial.
export const createTestimonial = api<CreateTestimonialRequest, CreateTestimonialResponse>(
  { expose: true, method: "POST", path: "/admin/testimonials", auth: true },
  async (req) => {
    const result = await portfolioDB.queryRow<{ id: number }>`
      INSERT INTO testimonials (client_name, client_role, content, rating, featured)
      VALUES (${req.client_name}, ${req.client_role}, ${req.content}, ${req.rating}, ${req.featured})
      RETURNING id
    `;
    
    return {
      id: result!.id,
      message: "Testimonial created successfully",
    };
  }
);
