"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CartItemList from "@/components/marketplace/cart/CartItemList";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import CheckoutShippingInfo from "@/components/marketplace/checkout/CheckoutShippingInfo";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCart } from "@/context/CartContext";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import {
  cleanupCheckoutPayment,
  embedCheckoutPayment,
  pollCheckoutPayment,
  prepareCheckoutPayment,
} from "@/lib/checkout-payment";
import { getApiErrorMessage } from "@/lib/api-message";
import { formatCurrency } from "@/lib/format";
import { mapCheckoutDatasToItems } from "@/lib/map-marketplace-checkout";
import { SNAP_EMBED_CONTAINER_ID } from "@/lib/midtrans-snap";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  fetchCheckout,
  fetchCheckoutPayment,
  fetchCheckoutShipping,
} from "@/services/checkout.service";
import type {
  CheckoutDatas,
  CheckoutPaymentDatas,
  CheckoutShippingDatas,
} from "@/types/checkout";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu pembayaran",
  paid: "Sudah dibayar",
  failed: "Pembayaran gagal",
  expired: "Pembayaran kedaluwarsa",
  cancelled: "Dibatalkan",
};

function paymentStatusClass(status: string): string {
  switch (status) {
    case "paid":
      return "text-desahub-600";
    case "pending":
      return "text-amber-600";
    case "failed":
    case "expired":
    case "cancelled":
      return "text-error-500";
    default:
      return "text-gray-900";
  }
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
  const [shipping, setShipping] = useState<CheckoutShippingDatas | null>(null);
  const [payment, setPayment] = useState<CheckoutPaymentDatas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const handledPaidRef = useRef(false);
  const embeddedTokenRef = useRef<string | null>(null);

  const completePaidCheckout = useCallback(async () => {
    if (handledPaidRef.current) return;
    handledPaidRef.current = true;
    cleanupCheckoutPayment({ hard: true });
    markCheckoutCompleted();
    await refreshCart();
    showSuccessToast("Pembayaran berhasil");
    router.push("/marketplace-umkm/selesai");
  }, [markCheckoutCompleted, refreshCart, router]);

  const applyPayment = useCallback(
    async (nextPayment: CheckoutPaymentDatas) => {
      setPayment(nextPayment);
      if (nextPayment.status === "paid") {
        await completePaidCheckout();
      }
    },
    [completePaidCheckout],
  );

  const applyPaymentRef = useRef(applyPayment);
  applyPaymentRef.current = applyPayment;

  useEffect(() => {
    let isMounted = true;
    const uuid = params.uuid;
    setIsLoading(true);
    handledPaidRef.current = false;
    embeddedTokenRef.current = null;
    setEmbedError(null);

    void (async () => {
      try {
        const [checkoutResult, shippingResult] = await Promise.allSettled([
          fetchCheckout(uuid),
          fetchCheckoutShipping(uuid),
        ]);
        if (!isMounted) return;

        if (checkoutResult.status === "rejected") {
          showErrorToast(
            getApiErrorMessage(checkoutResult.reason, "Gagal memuat pembayaran"),
          );
          return;
        }

        const checkoutDatas = checkoutResult.value;
        setCheckout(checkoutDatas);

        if (shippingResult.status === "fulfilled") {
          setShipping(shippingResult.value);
        } else {
          setShipping(null);
        }

        if (checkoutDatas.status === "pending") {
          setActiveCheckout({
            uuid: checkoutDatas.uuid,
            status: checkoutDatas.status,
          });
        } else {
          clearActiveCheckout();
        }

        if (checkoutDatas.status === "cancelled") {
          setPayment(null);
          return;
        }

        try {
          const paymentDatas = await prepareCheckoutPayment(uuid);
          if (!isMounted) return;
          await applyPaymentRef.current(paymentDatas);
        } catch (error) {
          if (!isMounted) return;
          try {
            const existingPayment = await fetchCheckoutPayment(uuid);
            await applyPaymentRef.current(existingPayment);
          } catch {
            setPayment(null);
            setEmbedError(
              getApiErrorMessage(error, "Gagal memulai pembayaran"),
            );
            showErrorToast(
              getApiErrorMessage(error, "Gagal memulai pembayaran"),
            );
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      cleanupCheckoutPayment();
      embeddedTokenRef.current = null;
    };
  }, [clearActiveCheckout, params.uuid, setActiveCheckout]);

  useEffect(() => {
    if (!payment?.snap_token || payment.status === "paid") return;
    if (embeddedTokenRef.current === payment.snap_token) return;

    let cancelled = false;
    const token = payment.snap_token;
    setIsEmbedding(true);
    setEmbedError(null);

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      embeddedTokenRef.current = token;

      void embedCheckoutPayment(payment, {
        embedId: SNAP_EMBED_CONTAINER_ID,
        onPaymentResolved: (latest) => {
          if (!cancelled) {
            void applyPaymentRef.current(latest);
          }
        },
      })
        .catch((error) => {
          if (cancelled) return;
          embeddedTokenRef.current = null;
          setEmbedError(
            getApiErrorMessage(error, "Gagal memuat halaman pembayaran"),
          );
          showErrorToast(
            getApiErrorMessage(error, "Gagal memuat halaman pembayaran"),
          );
        })
        .finally(() => {
          if (!cancelled) {
            setIsEmbedding(false);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (embeddedTokenRef.current === token) {
        embeddedTokenRef.current = null;
      }
      cleanupCheckoutPayment();
    };
  }, [payment]);

  useEffect(() => {
    if (!checkout || payment?.status !== "pending") return;

    const abortController = new AbortController();

    void pollCheckoutPayment(checkout.uuid, {
      maxAttempts: 20,
      intervalMs: 3000,
      signal: abortController.signal,
    }).then((latest) => {
      if (!abortController.signal.aborted) {
        void applyPaymentRef.current(latest);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [checkout, payment?.status]);

  const handleCancel = () => {
    if (!checkout) return;
    requestLeaveCheckout();
  };

  const handleRefreshPayment = async () => {
    if (!checkout || isRefreshing) return;

    setIsRefreshing(true);
    try {
      const latest = await fetchCheckoutPayment(checkout.uuid);
      await applyPayment(latest);
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Gagal memeriksa status pembayaran"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReloadSnap = async () => {
    if (!checkout || checkout.status === "cancelled") return;

    setIsEmbedding(true);
    setEmbedError(null);
    embeddedTokenRef.current = null;
    cleanupCheckoutPayment();

    try {
      const paymentDatas = await prepareCheckoutPayment(checkout.uuid);
      await applyPayment(paymentDatas);
    } catch (error) {
      setEmbedError(getApiErrorMessage(error, "Gagal memuat ulang pembayaran"));
      showErrorToast(getApiErrorMessage(error, "Gagal memuat ulang pembayaran"));
    } finally {
      setIsEmbedding(false);
    }
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
  const actionsDisabled = checkout.status === "cancelled";
  const showSnapEmbed =
    checkout.status !== "cancelled" && payment?.status !== "paid";
  const paymentStatusLabel = payment
    ? (PAYMENT_STATUS_LABEL[payment.status] ?? payment.status)
    : "Menyiapkan pembayaran";

  return (
    <div className="space-y-6 pb-24 sm:space-y-8 lg:pb-0">
      <CheckoutSteps current={2} />
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Pembayaran
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {showSnapEmbed ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Metode Pembayaran</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih metode pembayaran di bawah ini untuk menyelesaikan pesanan.
                </p>
              </div>
              <div className="p-2 sm:p-4">
                {isEmbedding ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    Memuat pembayaran...
                  </p>
                ) : null}
                {embedError ? (
                  <div className="space-y-3 px-3 py-8 text-center">
                    <p className="text-sm text-error-500">{embedError}</p>
                    <MktButton onClick={() => void handleReloadSnap()}>
                      Muat Ulang Pembayaran
                    </MktButton>
                  </div>
                ) : null}
                <div
                  id={SNAP_EMBED_CONTAINER_ID}
                  className="min-h-[560px] w-full overflow-hidden rounded-xl"
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-gray-900">Status Pembayaran</h2>
            <dl className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between gap-4">
                <dt>ID Checkout</dt>
                <dd className="break-all text-right font-medium text-gray-900">
                  {checkout.uuid}
                </dd>
              </div>
              {payment?.order_id ? (
                <div className="flex justify-between gap-4">
                  <dt>Order ID</dt>
                  <dd className="break-all text-right font-medium text-gray-900">
                    {payment.order_id}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd
                  className={`font-medium capitalize ${paymentStatusClass(
                    payment?.status ?? "",
                  )}`}
                >
                  {paymentStatusLabel}
                </dd>
              </div>
              {payment ? (
                <div className="flex justify-between gap-4">
                  <dt>Total Tagihan</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(payment.gross_amount)}
                  </dd>
                </div>
              ) : null}
              {payment?.bank ? (
                <div className="flex justify-between gap-4">
                  <dt>Bank</dt>
                  <dd className="font-medium uppercase text-gray-900">
                    {payment.bank}
                  </dd>
                </div>
              ) : null}
              {payment?.va_number ? (
                <div className="flex justify-between gap-4">
                  <dt>Nomor VA</dt>
                  <dd className="break-all text-right font-medium text-gray-900">
                    {payment.va_number}
                  </dd>
                </div>
              ) : null}
            </dl>

            {payment?.status === "pending" ? (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Pembayaran masih menunggu. Selesaikan metode di atas atau cek status
                setelah transfer VA berhasil.
              </p>
            ) : null}

            {shipping ? <CheckoutShippingInfo shipping={shipping} className="mt-4" /> : null}
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
            disabled={isRefreshing || !payment}
            onClick={() => void handleRefreshPayment()}
          >
            {isRefreshing ? "Memeriksa..." : "Cek Status Pembayaran"}
          </MktButton>
          {showSnapEmbed ? (
            <MktButton
              variant="outline"
              className="hidden w-full lg:inline-flex"
              disabled={isEmbedding}
              onClick={() => void handleReloadSnap()}
            >
              {isEmbedding ? "Memuat..." : "Muat Ulang Pembayaran"}
            </MktButton>
          ) : null}
          <MktButton
            variant="outline"
            className="hidden w-full lg:inline-flex"
            disabled={actionsDisabled}
            onClick={handleCancel}
          >
            Batalkan Checkout
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex gap-2">
          <MktButton
            variant="outline"
            className="flex-1"
            disabled={actionsDisabled}
            onClick={handleCancel}
          >
            Batalkan
          </MktButton>
          <MktButton
            className="flex-1"
            disabled={isRefreshing || !payment}
            onClick={() => void handleRefreshPayment()}
          >
            {isRefreshing ? "Memeriksa..." : "Cek Status"}
          </MktButton>
        </div>
      </div>
    </div>
  );
}
