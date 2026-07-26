"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea";
import { getAdminOrderActions } from "@/lib/order-status";
import { formatCurrency, formatDate } from "@/lib/format";
import { formatPaymentType } from "@/lib/payment-label";
import type { AdminOrder } from "@/types/order";

type OrderDetailModalProps = {
  order: AdminOrder | null;
  isOpen: boolean;
  isSubmitting: boolean;
  shipCourier: string;
  shipTracking: string;
  cancelReason: string;
  onShipCourierChange: (value: string) => void;
  onShipTrackingChange: (value: string) => void;
  onCancelReasonChange: (value: string) => void;
  onClose: () => void;
  onProcess: () => void;
  onShip: () => void;
  onComplete: () => void;
  onCancel: () => void;
};

export default function OrderDetailModal({
  order,
  isOpen,
  isSubmitting,
  shipCourier,
  shipTracking,
  cancelReason,
  onShipCourierChange,
  onShipTrackingChange,
  onCancelReasonChange,
  onClose,
  onProcess,
  onShip,
  onComplete,
  onCancel,
}: OrderDetailModalProps) {
  if (!order) return null;

  const actions = getAdminOrderActions(order.status);
  const canShipSubmit =
    shipCourier.trim().length > 0 && shipTracking.trim().length > 0;
  const canCancelSubmit = cancelReason.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="flex max-h-[85vh] max-w-[720px] flex-col p-5 lg:p-8"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 pr-10">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Detail Pesanan
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {order.order_number}
          </p>
        </div>
        <OrderStatusBadge status={order.status} label={order.status_label} />
      </div>

      <ScrollArea
        className="h-[min(56vh,calc(85vh-12rem))]"
        viewportClassName="pr-3"
      >
        <div className="space-y-6 pb-1">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoBlock label="Tanggal pesanan">
              {formatDate(order.created_at, {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </InfoBlock>
            <InfoBlock label="Total">
              {formatCurrency(order.total_harga)} · {order.total_item} item
            </InfoBlock>
            <InfoBlock label="Pembeli">
              {order.pembeli.username}
              <span className="mt-0.5 block text-xs text-gray-400">
                {order.pembeli.email}
              </span>
            </InfoBlock>
            <InfoBlock label="Pembayaran">
              {formatPaymentType(order.payment?.payment_type)}
              {order.payment?.status ? (
                <span className="mt-0.5 block text-xs text-gray-400">
                  Status: {order.payment.status}
                </span>
              ) : null}
            </InfoBlock>
          </section>

          <section>
            <h5 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">
              Pengiriman
            </h5>
            {order.shipping ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBlock label="Penerima">
                  {order.shipping.nama_penerima}
                  <span className="mt-0.5 block text-xs text-gray-400">
                    {order.shipping.no_hp_penerima}
                  </span>
                </InfoBlock>
                <InfoBlock label="Alamat">
                  {order.shipping.alamat_penerima}
                </InfoBlock>
                <InfoBlock label="Kurir">
                  {order.shipping.courier ?? "—"}
                </InfoBlock>
                <InfoBlock label="No. resi">
                  {order.shipping.tracking_number ?? "—"}
                </InfoBlock>
                {order.shipping.cancel_reason ? (
                  <InfoBlock label="Alasan batal">
                    {order.shipping.cancel_reason}
                  </InfoBlock>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada data pengiriman.
              </p>
            )}
          </section>

          <section>
            <h5 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
              Item pesanan
            </h5>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.uuid}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {item.produk.gambar ? (
                      <Image
                        src={item.produk.gambar}
                        alt={item.produk.nama_produk}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                      {item.produk.nama_produk}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.harga_satuan)} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {actions.canShip ? (
            <section className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Kirim pesanan
              </h5>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label>Kurir</Label>
                  <Input
                    type="text"
                    value={shipCourier}
                    onChange={(e) => onShipCourierChange(e.target.value)}
                    placeholder="Contoh: JNE"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label>No. resi</Label>
                  <Input
                    type="text"
                    value={shipTracking}
                    onChange={(e) => onShipTrackingChange(e.target.value)}
                    placeholder="Contoh: JNE123"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {actions.canCancel ? (
            <section className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Batalkan pesanan
              </h5>
              <div>
                <Label>Alasan</Label>
                <TextArea
                  value={cancelReason}
                  onChange={onCancelReasonChange}
                  placeholder="Contoh: Stok habis"
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </section>
          ) : null}
        </div>
      </ScrollArea>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button
          size="sm"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Tutup
        </Button>
        {actions.canCancel ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || !canCancelSubmit}
            className="!bg-error-50 !text-error-600 ring-error-200 hover:!bg-error-100 dark:!bg-error-500/10 dark:!text-error-400"
          >
            Batalkan
          </Button>
        ) : null}
        {actions.canProcess ? (
          <Button size="sm" onClick={onProcess} disabled={isSubmitting}>
            Proses
          </Button>
        ) : null}
        {actions.canShip ? (
          <Button
            size="sm"
            onClick={onShip}
            disabled={isSubmitting || !canShipSubmit}
          >
            Kirim
          </Button>
        ) : null}
        {actions.canComplete ? (
          <Button size="sm" onClick={onComplete} disabled={isSubmitting}>
            Selesaikan
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 text-sm text-gray-800 dark:text-white/90">
        {children}
      </div>
    </div>
  );
}
