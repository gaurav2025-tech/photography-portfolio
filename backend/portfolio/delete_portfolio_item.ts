import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface DeletePortfolioItemRequest {
  id: number;
}

export interface DeletePortfolioItemResponse {
  message: string;
}

// Deletes a portfolio item.
export const deletePortfolioItem = api<DeletePortfolioItemRequest, DeletePortfolioItemResponse>(
  { expose: true, method: "DELETE", path: "/admin/portfolio/:id", auth: true },
  async (req) => {
    await portfolioDB.exec`DELETE FROM portfolio_items WHERE id = ${req.id}`;
    
    return {
      message: "Portfolio item deleted successfully",
    };
  }
);
