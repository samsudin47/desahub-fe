import type { OrderListStatusFilter } from "@/types/order";

export type OrderListTab = {
  value: OrderListStatusFilter;
  label: string;
};

export const ORDER_LIST_TABS: readonly OrderListTab[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu Bayar" },
  { value: "paid", label: "Diproses" },
  { value: "failed", label: "Gagal" },
  { value: "cancelled", label: "Dibatalkan" },
] as const;

export type AdminOrderListTab = OrderListTab & {
  statuses: readonly string[] | null;
};

export const ADMIN_ORDER_LIST_TABS: readonly AdminOrderListTab[] = [
  { value: "all", label: "Semua", statuses: null },
  { value: "pending", label: "Menunggu", statuses: ["pending"] },
  {
    value: "processing",
    label: "Diproses",
    statuses: ["paid", "processing"],
  },
  { value: "shipped", label: "Dikirim", statuses: ["shipped"] },
  { value: "completed", label: "Selesai", statuses: ["completed"] },
  { value: "cancelled", label: "Dibatalkan", statuses: ["cancelled"] },
] as const;

const ORDER_STATUS_FALLBACK_LABEL: Record<string, string> = {
  draft: "Draft",
  pending: "Menunggu Pembayaran",
  paid: "Diproses",
  processing: "Diproses",
  shipped: "Dikirim",
  shipping: "Dikirim",
  completed: "Selesai",
  failed: "Gagal",
  cancelled: "Dibatalkan",
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export type OrderBadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

const ORDER_BADGE_COLOR: Record<string, OrderBadgeColor> = {
  draft: "light",
  pending: "warning",
  paid: "info",
  processing: "info",
  shipped: "primary",
  shipping: "primary",
  completed: "success",
  failed: "error",
  cancelled: "error",
  menunggu_pembayaran: "warning",
  diproses: "info",
  dikirim: "primary",
  selesai: "success",
  dibatalkan: "error",
};

export function getOrderBadgeColor(status: string): OrderBadgeColor {
  return ORDER_BADGE_COLOR[status] ?? "light";
}

export function getOrderStatusLabel(
  status: string,
  statusLabel?: string | null,
): string {
  const fromApi = statusLabel?.trim();
  if (fromApi) return fromApi;
  return ORDER_STATUS_FALLBACK_LABEL[status] ?? status;
}

export function matchesAdminOrderTab(
  status: string,
  tab: AdminOrderListTab,
): boolean {
  if (!tab.statuses) return true;
  return tab.statuses.includes(status);
}

export function getAdminOrderActions(status: string) {
  return {
    canProcess: status === "paid",
    canShip: status === "processing",
    canComplete: status === "shipped",
    canCancel: ["pending", "paid", "processing"].includes(status),
  };
}
