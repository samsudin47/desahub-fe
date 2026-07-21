"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import MktButton from "@/components/marketplace/ui/MktButton";
import { cn } from "@/lib/cn";

interface CheckoutLeaveModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CheckoutLeaveModal({
  isOpen,
  isLoading = false,
  title = "Batalkan Checkout?",
  description = "Checkout sedang berlangsung. Jika Anda keluar sekarang, checkout akan dibatalkan dan Anda akan kembali ke keranjang belanja.",
  confirmLabel = "Ya, Batalkan",
  cancelLabel = "Tidak, Lanjutkan",
  onConfirm,
  onCancel,
}: CheckoutLeaveModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onCancel}
      className="max-w-md p-6 sm:p-8"
      showCloseButton={!isLoading}
    >
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-orange-50">
          <AlertTriangle className="size-8 text-orange-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <MktButton
            variant="outline"
            className="w-full sm:min-w-[140px]"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </MktButton>

          <button
            type="button"
            className={cn(
              "inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition",
              "bg-error-500 hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-50",
              "sm:min-w-[140px]",
            )}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Membatalkan..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
