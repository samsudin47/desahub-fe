"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import {
  ADMIN_ORDER_LIST_TABS,
  type AdminOrderListTab,
} from "@/lib/order-status";
import { formatCurrency, formatDate } from "@/lib/format";
import { formatPaymentType } from "@/lib/payment-label";
import { cn } from "@/lib/cn";
import type { AdminOrder } from "@/types/order";

type OrdersTableProps = {
  orders: AdminOrder[];
  activeTab: AdminOrderListTab;
  counts: Record<string, number>;
  onTabChange: (tab: AdminOrderListTab) => void;
  onRowClick: (order: AdminOrder) => void;
};

export default function OrdersTable({
  orders,
  activeTab,
  counts,
  onTabChange,
  onRowClick,
}: OrdersTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ADMIN_ORDER_LIST_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab.value === tab.value
                ? "bg-brand-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            {tab.label} ({counts[tab.value] ?? 0})
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {orders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Tidak ada pesanan dengan status{" "}
            {activeTab.value === "all"
              ? "ini"
              : activeTab.label.toLowerCase()}
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    ID Pesanan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Produk
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Alamat
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Pembayaran
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Total
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Tanggal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <TableRow
                    key={order.uuid}
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => onRowClick(order)}
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="max-w-[280px] px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.items
                        .map(
                          (item) =>
                            `${item.produk.nama_produk} (×${item.quantity})`,
                        )
                        .join(", ")}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.shipping?.alamat_penerima ?? "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatPaymentType(order.payment?.payment_type)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(order.total_harga)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.created_at, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <OrderStatusBadge
                        status={order.status}
                        label={order.status_label}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
