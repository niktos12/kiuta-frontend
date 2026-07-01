import { Product, Category } from "../types/Product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Re-export Category type for convenience
export type { Category } from "../types/Product";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async getBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_URL}products/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    const res = await fetch(
      `${API_URL}products?category=${categorySlug}`,
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async search(query: string): Promise<Product[]> {
    const res = await fetch(
      `${API_URL}products?q=${encodeURIComponent(query)}`,
    );
    if (!res.ok) throw new Error("Failed to search products");
    return res.json();
  },
};

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(`${API_URL}categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
};
