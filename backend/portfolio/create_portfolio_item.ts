import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface CreatePortfolioItemRequest {
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category_id: number;
  featured: boolean;
  sort_order: number;
}

export interface CreatePortfolioItemResponse {
  id: number;
  message: string;
}

// Creates a new portfolio item.
export const createPortfolioItem = api<CreatePortfolioItemRequest, CreatePortfolioItemResponse>(
  { expose: true, method: "POST", path: "/admin/portfolio", auth: true },
  async (req) => {
    const result = await portfolioDB.queryRow<{ id: number }>`
      INSERT INTO portfolio_items (title, description, image_url, thumbnail_url, category_id, featured, sort_order)
      VALUES (${req.title}, ${req.description}, ${req.image_url}, ${req.thumbnail_url}, ${req.category_id}, ${req.featured}, ${req.sort_order})
      RETURNING id
    `;
    
    return {
      id: result!.id,
      message: "Portfolio item created successfully",
    };
  }
);
