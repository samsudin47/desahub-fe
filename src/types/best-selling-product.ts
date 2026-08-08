import type { ProductCategoryProduct } from "@/types/product-category";

export type BestSellingProduct = ProductCategoryProduct & {
  total_terjual: number;
};
