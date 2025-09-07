import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface UpdateTestimonialRequest {
  id: number;
  client_name: string;
  client_role?: string;
  content: string;
  rating?: number;
  featured: boolean;
}

export interface UpdateTestimonialResponse {
  message: string;
}

// Updates an existing testimonial.
export const updateTestimonial = api<UpdateTestimonialRequest, UpdateTestimonialResponse>(
  { expose: true, method: "PUT", path: "/admin/testimonials/:id", auth: true },
  async (req) => {
    await portfolioDB.exec`
      UPDATE testimonials 
      SET client_name = ${req.client_name}, client_role = ${req.client_role}, 
          content = ${req.content}, rating = ${req.rating}, featured = ${req.featured}
      WHERE id = ${req.id}
    `;
    
    return {
      message: "Testimonial updated successfully",
    };
  }
);
