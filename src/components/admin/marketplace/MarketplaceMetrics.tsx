"use client";

import Badge from "@/components/ui/badge/Badge";
import { getMarketplaceStats } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import {
  ArrowUpIcon,
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
} from "@/icons";

export default function MarketplaceMetrics() {
  const stats = getMarketplaceStats();

  const metrics = [
    {
      label: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: BoxIconLine,
      badge: { color: "success" as const, text: `${stats.lowStockProducts} stok rendah` },
    },
    {
      label: "Total Pesanan",
      value: stats.totalOrders.toString(),
      icon: GroupIcon,
      badge: { color: "warning" as const, text: `${stats.pendingOrders} menunggu` },
    },
    {
      label: "Penjual UMKM",
      value: stats.totalSellers.toString(),
      icon: GroupIcon,
      badge: { color: "success" as const, text: "Aktif" },
    },
    {
      label: "Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarLineIcon,
      badge: { color: "success" as const, text: `${stats.totalSold} terjual` },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
            <metric.icon className="text-brand-600 size-6 dark:text-brand-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            <Badge color={metric.badge.color}>
              {metric.badge.color === "success" && <ArrowUpIcon />}
              {metric.badge.text}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
