"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-message";
import { fetchOrders } from "@/services/order.service";
import type { OrderListItem, OrderListStatusFilter } from "@/types/order";

export function useOrderList(status: OrderListStatusFilter = "all") {
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOrders(status);
      setItems(data);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, "Gagal memuat daftar pesanan"));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, isLoading, error, refetch };
}
