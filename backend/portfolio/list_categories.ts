import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
}

export interface ListCategoriesResponse {
  categories: Category[];
}

// Retrieves all portfolio categories.
export const listCategories = api<void, ListCategoriesResponse>(
  { expose: true, method: "GET", path: "/portfolio/categories" },
  async () => {
    const categories = await portfolioDB.queryAll<Category>`
      SELECT id, name, slug, description, created_at
      FROM portfolio_categories
      ORDER BY name ASC
    `;
    return { categories };
  }
);
