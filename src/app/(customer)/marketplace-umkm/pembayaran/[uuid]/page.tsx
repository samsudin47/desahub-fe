"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import CartItemList from "@/components/marketplace/cart/CartItemList";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCart } from "@/context/CartContext";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { mapCheckoutDatasToItems } from "@/lib/map-marketplace-checkout";
import { showErrorToast } from "@/lib/toast";
import { fetchCheckout } from "@/services/checkout.service";
import { ApiError } from "@/types/api";
import type { CheckoutDatas } from "@/types/checkout";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function PembayaranDetailPage() {
  const router = useRouter();
  const params = useParams<{ uuid: string }>();
  const { refreshCart } = useCart();
  const {
    clearActiveCheckout,
    markCheckoutCompleted,
    requestLeaveCheckout,
    setActiveCheckout,
  } = useCheckoutFlow();
  const [checkout, setCheckout] = useState<CheckoutDatas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const uuid = params.uuid;
    setIsLoading(true);

    void (async () => {
      try {
        const datas = await fetchCheckout(uuid);
        if (!isMounted) return;

        setCheckout(datas);
        if (datas.status === "pending") {
          setActiveCheckout({ uuid: datas.uuid, status: datas.status });
        } else {
          clearActiveCheckout();
        }
      } catch (error) {
        if (!isMounted) return;
        showErrorToast(getErrorMessage(error, "Gagal memuat pembayaran"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [clearActiveCheckout, params, setActiveCheckout]);

  const handleCancel = () => {
    if (!checkout) return;
    requestLeaveCheckout();
  };

  if (isLoading) {
    return <p className="py-12 text-center text-gray-500">Memuat pembayaran...</p>;
  }

  if (!checkout) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Data pembayaran tidak ditemukan.</p>
        <MktButton
          className="mt-4"
          onClick={() => router.push("/marketplace-umkm/keranjang")}
        >
          Kembali ke Keranjang
        </MktButton>
      </div>
    );
  }

  const items = mapCheckoutDatasToItems(checkout);

  return (
    <div className="space-y-6 pb-24 sm:space-y-8 lg:pb-0">
      <CheckoutSteps current={2} />
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Pembayaran
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-900">Status Pembayaran</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between gap-4">
                <span>ID Checkout</span>
                <span className="font-medium text-gray-900">{checkout.uuid}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="font-medium capitalize text-gray-900">
                  {checkout.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-700">
              <Clock className="size-4 shrink-0" />
              Jika Anda keluar dari alur checkout, Anda akan diminta konfirmasi
              sebelum checkout dibatalkan.
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-gray-900">Item Pesanan</h2>
            <CartItemList itemsOverride={items} readOnlyQuantity />
          </div>
        </div>

        <div className="space-y-4">
          <OrderSummary itemCount={checkout.total_item} total={checkout.total_harga} />
          <MktButton
            variant="outline"
            className="hidden w-full lg:inline-flex"
            disabled={checkout.status === "cancelled"}
            onClick={handleCancel}
          >
            Batalkan Checkout
          </MktButton>
          <MktButton
            className="hidden w-full lg:inline-flex"
            disabled={checkout.status === "cancelled"}
            onClick={async () => {
              markCheckoutCompleted();
              await refreshCart();
              router.push("/marketplace-umkm/selesai");
            }}
          >
            Saya Sudah Bayar
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex gap-2">
          <MktButton
            variant="outline"
            className="flex-1"
            disabled={checkout.status === "cancelled"}
            onClick={handleCancel}
          >
            Batalkan
          </MktButton>
          <MktButton
            className="flex-1"
            disabled={checkout.status === "cancelled"}
            onClick={async () => {
              markCheckoutCompleted();
              await refreshCart();
              router.push("/marketplace-umkm/selesai");
            }}
          >
            Saya Sudah Bayar
          </MktButton>
        </div>
      </div>
    </div>
  );
}
