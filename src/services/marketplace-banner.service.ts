import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import type { MasterBanner } from "@/types/master-banner";

export type MarketplaceBanner = MasterBanner;

const BANNER_PATH = "banner";

function normalizeBanner(
  datas: MarketplaceBanner | MarketplaceBanner[] | null | undefined,
): MarketplaceBanner | null {
  if (!datas) return null;
  if (Array.isArray(datas)) return datas[0] ?? null;
  if (!datas.uuid) return null;
  return datas;
}

export async function fetchMarketplaceBanner(): Promise<MarketplaceBanner | null> {
  const response = await apiRequest<MarketplaceBanner | MarketplaceBanner[]>(
    getMarketplaceUmkmUrl(BANNER_PATH),
    { method: "GET" },
  );

  return normalizeBanner(response.datas);
}
