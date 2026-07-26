"use client";

import { useMemo, useState } from "react";
import OrderDetailModal from "@/components/admin/marketplace/OrderDetailModal";
import OrdersTable from "@/components/admin/marketplace/OrdersTable";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useAdminOrderList } from "@/hooks/useAdminOrderList";
import { getApiErrorMessage } from "@/lib/api-message";
import {
  ADMIN_ORDER_LIST_TABS,
  matchesAdminOrderTab,
  type AdminOrderListTab,
} from "@/lib/order-status";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  cancelAdminOrder,
  completeAdminOrder,
  fetchAdminOrderByUuid,
  processAdminOrder,
  shipAdminOrder,
} from "@/services/admin-order.service";
import type { AdminOrder } from "@/types/order";

export default function OrdersManager() {
  const { items, isLoading, error, refetch } = useAdminOrderList("all");
  const [activeTab, setActiveTab] = useState<AdminOrderListTab>(
    ADMIN_ORDER_LIST_TABS[0],
  );
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [shipCourier, setShipCourier] = useState("");
  const [shipTracking, setShipTracking] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const tab of ADMIN_ORDER_LIST_TABS) {
      next[tab.value] = tab.statuses
        ? items.filter((order) => matchesAdminOrderTab(order.status, tab))
            .length
        : items.length;
    }
    return next;
  }, [items]);

  const filteredOrders = useMemo(() => {
    return items
      .filter((order) => matchesAdminOrderTab(order.status, activeTab))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [items, activeTab]);

  const resetActionForms = () => {
    setShipCourier("");
    setShipTracking("");
    setCancelReason("");
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
    resetActionForms();
  };

  const openDetail = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    resetActionForms();
    setIsDetailLoading(true);

    try {
      const detail = await fetchAdminOrderByUuid(order.uuid);
      setSelectedOrder(detail);
    } catch (err) {
      showErrorToast(
        getApiErrorMessage(err, "Gagal memuat detail pesanan"),
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const afterMutation = async (order: AdminOrder, message: string) => {
    showSuccessToast(message);
    setSelectedOrder(order);
    resetActionForms();
    await refetch();
  };

  const handleProcess = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      const result = await processAdminOrder(selectedOrder.uuid);
      await afterMutation(result.data, result.message);
    } catch (err) {
      showErrorToast(getApiErrorMessage(err, "Gagal memproses pesanan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShip = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      const result = await shipAdminOrder(selectedOrder.uuid, {
        courier: shipCourier.trim(),
        tracking_number: shipTracking.trim(),
      });
      await afterMutation(result.data, result.message);
    } catch (err) {
      showErrorToast(getApiErrorMessage(err, "Gagal mengirim pesanan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      const result = await completeAdminOrder(selectedOrder.uuid);
      await afterMutation(result.data, result.message);
    } catch (err) {
      showErrorToast(getApiErrorMessage(err, "Gagal menyelesaikan pesanan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      const result = await cancelAdminOrder(selectedOrder.uuid, {
        reason: cancelReason.trim(),
      });
      await afterMutation(result.data, result.message);
    } catch (err) {
      showErrorToast(getApiErrorMessage(err, "Gagal membatalkan pesanan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manajemen Pesanan
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isLoading
            ? "Memuat data..."
            : `Pantau dan kelola ${items.length} pesanan marketplace`}
        </p>
      </div>

      {error ? (
        <div className="space-y-3">
          <Alert variant="error" title="Gagal memuat data" message={error} />
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat daftar pesanan...
          </p>
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          activeTab={activeTab}
          counts={counts}
          onTabChange={setActiveTab}
          onRowClick={(order) => void openDetail(order)}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        isSubmitting={isSubmitting || isDetailLoading}
        shipCourier={shipCourier}
        shipTracking={shipTracking}
        cancelReason={cancelReason}
        onShipCourierChange={setShipCourier}
        onShipTrackingChange={setShipTracking}
        onCancelReasonChange={setCancelReason}
        onClose={closeDetail}
        onProcess={() => void handleProcess()}
        onShip={() => void handleShip()}
        onComplete={() => void handleComplete()}
        onCancel={() => void handleCancel()}
      />
    </div>
  );
}
