"use client";

import { useState } from "react";
import Link from "next/link";
import { mockOrders, type OrderStatus } from "@/data/marketplace";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import ProductImage from "@/components/marketplace/ui/ProductImage";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

const tabs: { key: OrderStatus | "semua"; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu_pembayaran", label: "Menunggu Bayar" },
  { key: "diproses", label: "Diproses" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

export default function PesananPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "semua">("semua");

  const filtered =
    activeTab === "semua"
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Pesanan Saya
      </h1>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition",
              activeTab === tab.key
                ? "border-desahub-500 text-desahub-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            Tidak ada pesanan dengan status ini.
          </p>
        ) : (
          filtered.map((order) => (
            <Link
              key={order.id}
              href={`/marketplace-umkm/pesanan/${order.id}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-desahub-200 hover:shadow-theme-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-3">
                {order.items.slice(0, 3).map(({ product, quantity }) => (
                  <ProductImage
                    key={product.id}
                    product={product}
                    className="size-12"
                    size="sm"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{order.items.length - 3} lainnya
                  </span>
                )}
                <span className="ml-auto font-semibold text-desahub-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
