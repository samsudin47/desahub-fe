import type { OrderListStatusFilter } from "@/types/order";

export type OrderListTab = {
  value: OrderListStatusFilter;
  label: string;
};

/** Filter tabs mapped to BE `status` query param. */
export const ORDER_LIST_TABS: readonly OrderListTab[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu Bayar" },
  { value: "paid", label: "Diproses" },
  { value: "failed", label: "Gagal" },
  { value: "cancelled", label: "Dibatalkan" },
] as const;

const ORDER_STATUS_STYLE: Record<string, string> = {
  // BE statuses
  draft: "bg-gray-50 text-gray-600",
  pending: "bg-orange-50 text-orange-600",
  paid: "bg-blue-light-50 text-blue-light-600",
  failed: "bg-error-50 text-error-600",
  cancelled: "bg-error-50 text-error-600",
  // Future / fulfillment (if BE adds later)
  shipping: "bg-desahub-50 text-desahub-600",
  completed: "bg-success-50 text-success-600",
  // Legacy mock UI statuses (admin / detail mock)
  menunggu_pembayaran: "bg-orange-50 text-orange-600",
  diproses: "bg-blue-light-50 text-blue-light-600",
  dikirim: "bg-desahub-50 text-desahub-600",
  selesai: "bg-success-50 text-success-600",
  dibatalkan: "bg-error-50 text-error-600",
};

const ORDER_STATUS_FALLBACK_LABEL: Record<string, string> = {
  draft: "Draft",
  pending: "Menunggu Pembayaran",
  paid: "Diproses",
  failed: "Gagal",
  cancelled: "Dibatalkan",
  shipping: "Dikirim",
  completed: "Selesai",
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const DEFAULT_STATUS_STYLE = "bg-gray-50 text-gray-600";

export function getOrderStatusStyle(status: string): string {
  return ORDER_STATUS_STYLE[status] ?? DEFAULT_STATUS_STYLE;
}

export function getOrderStatusLabel(
  status: string,
  statusLabel?: string | null,
): string {
  const fromApi = statusLabel?.trim();
  if (fromApi) return fromApi;
  return ORDER_STATUS_FALLBACK_LABEL[status] ?? status;
}
