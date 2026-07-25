"use client";

import { useState } from "react";
import OrderListCard from "@/components/marketplace/orders/OrderListCard";
import { useOrderList } from "@/hooks/useOrderList";
import { ORDER_LIST_TABS } from "@/lib/order-status";
import { cn } from "@/lib/cn";
import type { OrderListStatusFilter } from "@/types/order";
import MktButton from "@/components/marketplace/ui/MktButton";

export default function PesananPage() {
  const [activeTab, setActiveTab] =
    useState<OrderListStatusFilter>("all");
  const { items, isLoading, error, refetch } = useOrderList(activeTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Pesanan Saya
      </h1>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {ORDER_LIST_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={cn(
              "shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition",
              activeTab === tab.value
                ? "border-desahub-500 text-desahub-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <OrderListSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-error-200 bg-error-50 px-4 py-8 text-center">
            <p className="text-sm text-error-600">{error}</p>
            <MktButton
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void refetch()}
            >
              Coba Lagi
            </MktButton>
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            Tidak ada pesanan dengan status ini.
          </p>
        ) : (
          items.map((order) => (
            <OrderListCard key={order.uuid} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat pesanan">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
            <div className="h-5 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-gray-200" />
            <div className="size-12 rounded-xl bg-gray-100" />
            <div className="ml-auto h-4 w-20 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
