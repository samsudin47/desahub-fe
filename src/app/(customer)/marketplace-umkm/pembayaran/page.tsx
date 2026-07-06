"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Clock } from "lucide-react";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import MktButton from "@/components/marketplace/ui/MktButton";
import { paymentMethods } from "@/data/marketplace";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";

export default function PembayaranPage() {
  const router = useRouter();
  const { items } = useCart();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [uploaded, setUploaded] = useState(false);

  const method = paymentMethods.find((m) => m.id === selectedMethod)!;

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Tidak ada item untuk dibayar.</p>
        <MktButton className="mt-4" onClick={() => router.push("/marketplace-umkm")}>
          Mulai Belanja
        </MktButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:space-y-8 lg:pb-0">
      <CheckoutSteps current={2} />
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Pembayaran
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">
              Pilih Metode Pembayaran
            </h2>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                    selectedMethod === pm.id
                      ? "border-desahub-500 bg-desahub-50"
                      : "border-gray-200 hover:border-desahub-200"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={selectedMethod === pm.id}
                    onChange={() => setSelectedMethod(pm.id)}
                    className="accent-desahub-500"
                  />
                  <span className="font-medium text-gray-900">{pm.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-900">
              Detail Pembayaran
            </h2>
            <p className="text-sm text-gray-600">
              Transfer ke: <strong>{method.account}</strong>
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-700">
              <Clock className="size-4 shrink-0" />
              Selesaikan pembayaran dalam{" "}
              <strong>23:59:45</strong>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-900">
              Upload Bukti Transfer
            </h2>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 transition hover:border-desahub-400 hover:bg-desahub-50">
              <Upload className="size-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                Klik atau seret file ke sini
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={() => setUploaded(true)}
              />
            </label>
            {uploaded && (
              <p className="mt-2 text-sm text-success-600">
                Bukti transfer berhasil diunggah.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <OrderSummary />
          <MktButton
            className="hidden w-full lg:inline-flex"
            disabled={!uploaded}
            onClick={() => router.push("/marketplace-umkm/selesai")}
          >
            Konfirmasi Pembayaran
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <MktButton
          className="w-full"
          disabled={!uploaded}
          onClick={() => router.push("/marketplace-umkm/selesai")}
        >
          Bayar Sekarang
        </MktButton>
      </div>
    </div>
  );
}
