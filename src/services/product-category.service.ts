import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import type { ProductCategoryDetail } from "@/types/product-category";

export async function fetchProductCategoryByUuid(
  uuid: string,
): Promise<ProductCategoryDetail> {
  const response = await apiRequest<ProductCategoryDetail>(
    getMarketplaceUmkmUrl(`product-categories/${uuid}`),
    { method: "GET" },
  );

  return response.datas;
}
