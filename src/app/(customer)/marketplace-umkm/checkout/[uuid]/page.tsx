"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CartItemList from "@/components/marketplace/cart/CartItemList";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import CheckoutInfoCard from "@/components/marketplace/checkout/CheckoutInfoCard";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { mapCheckoutDatasToItems } from "@/lib/map-marketplace-checkout";
import { getApiErrorMessage } from "@/lib/api-message";
import { getPembayaranPagePath } from "@/lib/checkout-routes";
import { showErrorToast } from "@/lib/toast";
import {
  fetchCheckout,
  fetchCheckoutShipping,
} from "@/services/checkout.service";
import type { CheckoutDatas } from "@/types/checkout";

export default function CheckoutDetailPage() {
  const router = useRouter();
  const params = useParams<{ uuid: string }>();
  const { clearActiveCheckout, setActiveCheckout } = useCheckoutFlow();
  const [checkout, setCheckout] = useState<CheckoutDatas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutUuid, setCheckoutUuid] = useState("");
  const [hasSavedShipping, setHasSavedShipping] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const uuid = params.uuid;
    setCheckoutUuid(uuid);
    setIsLoading(true);
    setHasSavedShipping(false);

    void (async () => {
      try {
        const [checkoutResult, shippingResult] = await Promise.allSettled([
          fetchCheckout(uuid),
          fetchCheckoutShipping(uuid),
        ]);
        if (!isMounted) return;

        if (checkoutResult.status === "rejected") {
          showErrorToast(
            getApiErrorMessage(checkoutResult.reason, "Gagal memuat checkout"),
          );
          return;
        }

        const datas = checkoutResult.value;
        setCheckout(datas);

        if (shippingResult.status === "fulfilled") {
          setHasSavedShipping(true);
        }

        if (datas.status === "pending") {
          setActiveCheckout({ uuid: datas.uuid, status: datas.status });
        } else {
          clearActiveCheckout();
        }
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

  const handleContinueToPayment = () => {
    if (!checkout || checkout.status === "cancelled") return;

    if (!hasSavedShipping) {
      showErrorToast("Simpan alamat pengiriman terlebih dahulu");
      return;
    }

    router.push(getPembayaranPagePath(checkout.uuid));
  };

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
  const continueDisabled = checkout.status === "cancelled" || !hasSavedShipping;

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
          <CheckoutInfoCard
            checkoutUuid={checkoutUuid}
            status={checkout.status}
            disabled={checkout.status === "cancelled"}
            onShippingSaved={() => setHasSavedShipping(true)}
          />

          <div>
            <h2 className="mb-3 font-semibold text-gray-900">Item Pesanan</h2>
            <CartItemList itemsOverride={items} readOnlyQuantity />
          </div>
        </div>

        <div className="space-y-4">
          <OrderSummary itemCount={checkout.total_item} total={checkout.total_harga} />
          <MktButton
            className="hidden w-full lg:inline-flex"
            disabled={continueDisabled}
            onClick={handleContinueToPayment}
          >
            Lanjut ke Pembayaran
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <MktButton
          className="w-full"
          disabled={continueDisabled}
          onClick={handleContinueToPayment}
        >
          Lanjut ke Pembayaran
        </MktButton>
      </div>
    </div>
  );
}
