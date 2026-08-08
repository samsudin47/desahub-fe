import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import type { PopularCategory } from "@/types/popular-category";

const PATH = "categories/popular";

function normalizePopularCategories(
  datas: PopularCategory[] | { kategori?: PopularCategory[] } | null | undefined,
): PopularCategory[] {
  if (!datas) return [];
  if (Array.isArray(datas)) return datas;
  return datas.kategori ?? [];
}

export async function fetchPopularCategories(): Promise<PopularCategory[]> {
  const response = await apiRequest<
    PopularCategory[] | { kategori?: PopularCategory[] }
  >(getMarketplaceUmkmUrl(PATH), { method: "GET" });

  return normalizePopularCategories(response.datas);
}
