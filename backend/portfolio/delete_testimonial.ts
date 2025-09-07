import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface DeleteTestimonialRequest {
  id: number;
}

export interface DeleteTestimonialResponse {
  message: string;
}

// Deletes a testimonial.
export const deleteTestimonial = api<DeleteTestimonialRequest, DeleteTestimonialResponse>(
  { expose: true, method: "DELETE", path: "/admin/testimonials/:id", auth: true },
  async (req) => {
    await portfolioDB.exec`DELETE FROM testimonials WHERE id = ${req.id}`;
    
    return {
      message: "Testimonial deleted successfully",
    };
  }
);
