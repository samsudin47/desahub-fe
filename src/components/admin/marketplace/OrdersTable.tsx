"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import {
  mockOrders,
  orderStatusLabels,
  type OrderStatus,
} from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Menunggu", value: "menunggu_pembayaran" },
  { label: "Diproses", value: "diproses" },
  { label: "Dikirim", value: "dikirim" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default function OrdersTable() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = mockOrders
    .filter((order) => filter === "all" || order.status === filter)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((item) => {
          const count =
            item.value === "all"
              ? mockOrders.length
              : mockOrders.filter((o) => o.status === item.value).length;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                filter === item.value
                  ? "bg-brand-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
              )}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            Tidak ada pesanan dengan status{" "}
            {filter === "all"
              ? "ini"
              : orderStatusLabels[filter].toLowerCase()}
          </div>
        ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  ID Pesanan
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Produk
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Alamat
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Pembayaran
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Tanggal
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {order.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.items
                        .map((i) => `${i.product.name} (×${i.quantity})`)
                        .join(", ")}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.shippingAddress}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.paymentMethod ?? "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
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
