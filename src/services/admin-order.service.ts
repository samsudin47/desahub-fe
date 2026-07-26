import { getMarketplaceUmkmUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import { getApiSuccessMessage } from "@/lib/api-message";
import type {
  AdminOrder,
  CancelOrderPayload,
  OrderListStatusFilter,
  ShipOrderPayload,
} from "@/types/order";

const ADMIN_ORDERS_PATH = "admin/orders";

export type AdminOrderMutationResult = {
  data: AdminOrder;
  message: string;
};

export async function fetchAdminOrders(
  status: OrderListStatusFilter = "all",
): Promise<AdminOrder[]> {
  const query = new URLSearchParams({ status });
  const response = await apiRequest<AdminOrder[]>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}?${query.toString()}`),
    { method: "GET" },
  );

  return response.datas ?? [];
}

export async function fetchAdminOrderByUuid(uuid: string): Promise<AdminOrder> {
  const response = await apiRequest<AdminOrder>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}/${uuid}`),
    { method: "GET" },
  );

  return response.datas;
}

export async function processAdminOrder(
  uuid: string,
): Promise<AdminOrderMutationResult> {
  const response = await apiRequest<AdminOrder>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}/${uuid}/process`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function shipAdminOrder(
  uuid: string,
  payload: ShipOrderPayload,
): Promise<AdminOrderMutationResult> {
  const response = await apiRequest<AdminOrder>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}/${uuid}/ship`),
    { method: "POST", body: payload },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function completeAdminOrder(
  uuid: string,
): Promise<AdminOrderMutationResult> {
  const response = await apiRequest<AdminOrder>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}/${uuid}/complete`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function cancelAdminOrder(
  uuid: string,
  payload: CancelOrderPayload,
): Promise<AdminOrderMutationResult> {
  const response = await apiRequest<AdminOrder>(
    getMarketplaceUmkmUrl(`${ADMIN_ORDERS_PATH}/${uuid}/cancel`),
    { method: "POST", body: payload },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}
