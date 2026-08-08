import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import type { BestSellingProduct } from "@/types/best-selling-product";

const PATH = "products/best-selling";

export const DEFAULT_BEST_SELLING_LIMIT = 10;

export async function fetchBestSellingProducts(
  limit = DEFAULT_BEST_SELLING_LIMIT,
): Promise<BestSellingProduct[]> {
  const query = new URLSearchParams({ limit: String(limit) });
  const response = await apiRequest<BestSellingProduct[]>(
    getMarketplaceUmkmUrl(`${PATH}?${query}`),
    { method: "GET" },
  );

  return response.datas ?? [];
}
