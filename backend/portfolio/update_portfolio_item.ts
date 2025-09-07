import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface UpdatePortfolioItemRequest {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category_id: number;
  featured: boolean;
  sort_order: number;
}

export interface UpdatePortfolioItemResponse {
  message: string;
}

// Updates an existing portfolio item.
export const updatePortfolioItem = api<UpdatePortfolioItemRequest, UpdatePortfolioItemResponse>(
  { expose: true, method: "PUT", path: "/admin/portfolio/:id", auth: true },
  async (req) => {
    await portfolioDB.exec`
      UPDATE portfolio_items 
      SET title = ${req.title}, description = ${req.description}, image_url = ${req.image_url}, 
          thumbnail_url = ${req.thumbnail_url}, category_id = ${req.category_id}, 
          featured = ${req.featured}, sort_order = ${req.sort_order}
      WHERE id = ${req.id}
    `;
    
    return {
      message: "Portfolio item updated successfully",
    };
  }
);
