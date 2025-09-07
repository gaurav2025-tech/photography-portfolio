import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  featured: boolean;
  sort_order: number;
  created_at: Date;
}

export interface ListPortfolioParams {
  category?: Query<string>;
  featured?: Query<boolean>;
  limit?: Query<number>;
}

export interface ListPortfolioResponse {
  items: PortfolioItem[];
}

// Retrieves portfolio items with optional filtering.
export const listPortfolio = api<ListPortfolioParams, ListPortfolioResponse>(
  { expose: true, method: "GET", path: "/portfolio" },
  async (params) => {
    let query = `
      SELECT 
        p.id, p.title, p.description, p.image_url, p.thumbnail_url,
        p.category_id, p.featured, p.sort_order, p.created_at,
        c.name as category_name, c.slug as category_slug
      FROM portfolio_items p
      JOIN portfolio_categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.category) {
      query += ` AND c.slug = $${paramIndex}`;
      queryParams.push(params.category);
      paramIndex++;
    }

    if (params.featured) {
      query += ` AND p.featured = $${paramIndex}`;
      queryParams.push(params.featured);
      paramIndex++;
    }

    query += ` ORDER BY p.sort_order ASC, p.created_at DESC`;

    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    const items = await portfolioDB.rawQueryAll<PortfolioItem>(query, ...queryParams);
    return { items };
  }
);
