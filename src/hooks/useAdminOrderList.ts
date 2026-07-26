"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-message";
import { fetchAdminOrders } from "@/services/admin-order.service";
import type { AdminOrder, OrderListStatusFilter } from "@/types/order";

export function useAdminOrderList(status: OrderListStatusFilter = "all") {
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAdminOrders(status);
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
