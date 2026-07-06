"use client";

import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import OrderSummary from "@/components/marketplace/cart/OrderSummary";
import CartItemList from "@/components/marketplace/cart/CartItemList";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Keranjang kosong. Tidak dapat checkout.</p>
        <MktButton className="mt-4" onClick={() => router.push("/marketplace-umkm")}>
          Mulai Belanja
        </MktButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:space-y-8 lg:pb-0">
      <CheckoutSteps current={1} />
      <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
        Checkout
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">
              Alamat Pengiriman
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama penerima"
                defaultValue="Rina Wulandari"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100"
              />
              <input
                type="tel"
                placeholder="No. telepon"
                defaultValue="0812-3456-7890"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100"
              />
              <textarea
                placeholder="Alamat lengkap"
                rows={3}
                defaultValue="Jl. Merdeka No. 12, Desa Sukamaju"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100"
              />
            </div>
          </div>
          <div>
            <h2 className="mb-3 font-semibold text-gray-900">Item Pesanan</h2>
            <CartItemList />
          </div>
        </div>
        <div className="space-y-4 lg:space-y-4">
          <OrderSummary />
          <MktButton
            className="hidden w-full lg:inline-flex"
            onClick={() => router.push("/marketplace-umkm/pembayaran")}
          >
            Lanjut ke Pembayaran
          </MktButton>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <MktButton
          className="w-full"
          onClick={() => router.push("/marketplace-umkm/pembayaran")}
        >
          Lanjutkan Pembayaran
        </MktButton>
      </div>
    </div>
  );
}
