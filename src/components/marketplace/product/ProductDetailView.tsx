"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/marketplace/ui/ProductImage";
import StarRating from "@/components/marketplace/ui/StarRating";
import MktButton from "@/components/marketplace/ui/MktButton";

export default function ProductDetailView({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"info" | "policy">("info");
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = async () => {
    await addItem(product, quantity);
    router.push("/marketplace-umkm/checkout");

  };

  const handleAddToCart = async () => {
    await addItem(product, quantity);
    router.push("/marketplace-umkm/keranjang");
  };
  return (
    <>
      <div className="-mx-4 space-y-4 px-4 pb-24 sm:mx-0 sm:space-y-6 sm:px-0 sm:pb-0">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ProductImage
            product={product}
            className="aspect-square w-full rounded-none sm:rounded-2xl"
            size="lg"
          />
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {product.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {product.seller.name} · {product.seller.village}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-400">
                  Terjual {product.sold}+
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-desahub-600 sm:text-3xl">
              {formatCurrency(product.price)}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Jumlah:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                Stok: {product.stock}
              </span>
            </div>
            <div className="hidden gap-3 sm:flex">
              <MktButton
                variant="outline"
                className="flex-1"
                onClick={() => addItem(product, quantity)}
              >
                Tambah ke Keranjang
              </MktButton>
              <MktButton className="flex-1" onClick={handleBuyNow}>
                Beli Sekarang
              </MktButton>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex border-b border-gray-100">
            {(
              [
                { key: "info", label: "Deskripsi" },
                { key: "policy", label: "Kebijakan Toko" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`flex-1 px-4 py-3 text-sm font-medium transition sm:flex-none sm:px-5 ${
                  activeTab === tab.key
                    ? "border-b-2 border-desahub-500 text-desahub-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-4 text-sm text-gray-600 sm:p-5">
            {activeTab === "info" ? (
              <p>{product.description}</p>
            ) : (
              <p>{product.seller.policy}</p>
            )}
            {activeTab === "info" && (
              <button
                type="button"
                className="mt-2 text-sm font-medium text-desahub-600"
              >
                Lihat selengkapnya
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-gray-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <MktButton
          variant="outline"
          className="flex-1"
          onClick={handleAddToCart}
          startIcon={<ShoppingCart className="size-4" />}
        >
          Keranjang
        </MktButton>
        <MktButton className="flex-1" onClick={handleBuyNow}>
          Beli Sekarang
        </MktButton>
      </div>
    </>
  );
}


