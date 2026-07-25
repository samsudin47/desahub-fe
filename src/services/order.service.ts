import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import type { OrderListItem, OrderListStatusFilter } from "@/types/order";

const ORDERS_PATH = "orders";

export async function fetchOrders(
  status: OrderListStatusFilter = "all",
): Promise<OrderListItem[]> {
  const query = new URLSearchParams({ status });
  const response = await apiRequest<OrderListItem[]>(
    getMarketplaceUmkmUrl(`${ORDERS_PATH}?${query.toString()}`),
    { method: "GET" },
  );

  return response.datas ?? [];
}
