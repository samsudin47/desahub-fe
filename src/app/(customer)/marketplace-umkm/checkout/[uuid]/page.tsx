"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CartItemList from "@/components/marketplace/cart/CartItemList";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { mapCheckoutDatasToItems } from "@/lib/map-marketplace-checkout";
import { getPembayaranPagePath } from "@/lib/checkout-routes";
import { fetchCheckout } from "@/services/checkout.service";
import type { CheckoutDatas } from "@/types/checkout";
import { showErrorToast } from "@/lib/toast";
import { ApiError } from "@/types/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function CheckoutDetailPage() {
  const router = useRouter();
  const params = useParams<{ uuid: string }>();
  const { clearActiveCheckout, setActiveCheckout } = useCheckoutFlow();
  const [checkout, setCheckout] = useState<CheckoutDatas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutUuid, setCheckoutUuid] = useState("");

  useEffect(() => {
    let isMounted = true;
    const uuid = params.uuid;
    setCheckoutUuid(uuid);
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
        showErrorToast(getErrorMessage(error, "Gagal memuat checkout"));
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

  if (isLoading) {
    return <p className="py-12 text-center text-gray-500">Memuat checkout...</p>;
  }

  if (!checkout) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Checkout tidak ditemukan.</p>
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
      <CheckoutSteps current={1} />
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Checkout
      </h1>

      {checkout.status === "cancelled" && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Checkout ini sudah dibatalkan. Silakan kembali ke keranjang untuk
          membuat checkout baru.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-2 font-semibold text-gray-900">Informasi Checkout</h2>
            <dl className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between gap-4">
                <dt>ID Checkout</dt>
                <dd className="text-right font-medium text-gray-900">
                  {checkoutUuid}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd className="font-medium capitalize text-gray-900">
                  {checkout.status}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-gray-900">Item Pesanan</h2>
            <CartItemList itemsOverride={items} readOnlyQuantity />
          </div>
        </div>

        <div className="space-y-4">
          <OrderSummary itemCount={checkout.total_item} total={checkout.total_harga} />
          <MktButton
            className="hidden w-full lg:inline-flex"
            disabled={checkout.status === "cancelled"}
            onClick={() => router.push(getPembayaranPagePath(checkout.uuid))}
          >
            Lanjut ke Pembayaran
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <MktButton
          className="w-full"
          disabled={checkout.status === "cancelled"}
          onClick={() => router.push(getPembayaranPagePath(checkout.uuid))}
        >
          Lanjut ke Pembayaran
        </MktButton>
      </div>
    </div>
  );
}
