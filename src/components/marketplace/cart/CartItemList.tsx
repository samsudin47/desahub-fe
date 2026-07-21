"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { CartItem } from "@/data/marketplace";
import { useCart } from "@/context/CartContext";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { getCheckoutPagePath } from "@/lib/checkout-routes";
import { formatCurrency } from "@/lib/format";
import { showErrorToast } from "@/lib/toast";
import ProductImage from "../ui/ProductImage";
import OrderSummary from "./OrderSummary";
import MktButton from "../ui/MktButton";

interface CartItemListProps {
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectedChange?: (selectedIds: Set<string>) => void;
  itemsOverride?: CartItem[];
  readOnlyQuantity?: boolean;
}

export default function CartItemList({
  selectable = false,
  selectedIds,
  onSelectedChange,
  itemsOverride,
  readOnlyQuantity = false,
}: CartItemListProps) {
  const { items, incrementItem, decrementItem, removeItem } = useCart();
  const resolvedItems = itemsOverride ?? items;
  const [manualInternalSelected, setManualInternalSelected] =
    useState<Set<string> | null>(null);
  const allItemIds = new Set(resolvedItems.map((item) => item.id));
  const internalSelected = manualInternalSelected ?? allItemIds;
  const selected = selectedIds ?? internalSelected;

  const updateSelected = (next: Set<string>) => {
    if (selectedIds && onSelectedChange) {
      onSelectedChange(next);
      return;
    }

    setManualInternalSelected(next);
  };
  const visibleSelected = new Set(
    [...selected].filter((id) => resolvedItems.some((item) => item.id === id)),
  );
  const allSelected =
    resolvedItems.length > 0 && visibleSelected.size === resolvedItems.length;

  const toggleAll = () => {
    if (allSelected) {
      updateSelected(new Set());
    } else {
      updateSelected(new Set(resolvedItems.map((i) => i.id)));
    }
  };

  const toggleItem = (id: string) => {
    const next = new Set(visibleSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateSelected(next);
  };

  if (resolvedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Keranjang belanja Anda masih kosong.</p>
        <Link
          href="/marketplace-umkm"
          className="mt-4 inline-block text-sm font-medium text-desahub-600 hover:underline"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {selectable && (
        <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="size-4 accent-desahub-500"
          />
          <span className="text-sm font-medium text-gray-700">Pilih Semua</span>
        </label>
      )}

      {resolvedItems.map((item) => {
        const { id, product, quantity, subtotal } = item;

        return (
          <div
            key={id}
            className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-4 sm:p-4"
          >
            {selectable && (
              <input
                type="checkbox"
                checked={visibleSelected.has(id)}
                onChange={() => toggleItem(id)}
                className="mt-1 size-4 shrink-0 accent-desahub-500"
              />
            )}
            <ProductImage
              product={product}
              className="size-16 shrink-0 sm:size-20"
              size="sm"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/marketplace-umkm/produk/${product.id}`}
                  className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-desahub-600"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-gray-500">{product.seller.name}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                {readOnlyQuantity ? (
                  <span className="text-sm text-gray-500">x{quantity}</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-1 hover:bg-gray-50"
                      onClick={() => void decrementItem(id)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-1 hover:bg-gray-50"
                      onClick={() => void incrementItem(id)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-desahub-600">
                    {formatCurrency(subtotal)}
                  </span>
                  {selectable && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-error-500"
                      onClick={() => void removeItem(id)}
                      aria-label="Hapus item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CartPageContent() {
  const router = useRouter();
  const { items, itemCount, isLoading, refreshCart } = useCart();
  const { beginCheckout, isSubmitting } = useCheckoutFlow();
  const [manualSelectedIds, setManualSelectedIds] = useState<Set<string> | null>(
    null,
  );

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);
  const allItemIds = new Set(items.map((item) => item.id));
  const selectedIds = manualSelectedIds ?? allItemIds;

  const selectedItems = items.filter((item) => selectedIds.has(item.id));
  const selectedItemCount = selectedItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  const handleCheckout = async () => {
    if (selectedIds.size === 0) {
      showErrorToast("Pilih minimal satu item untuk checkout");
      return;
    }

    const checkout = await beginCheckout(Array.from(selectedIds));
    await refreshCart();
    router.push(getCheckoutPagePath(checkout.uuid));
  };

  if (isLoading && items.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">Memuat keranjang...</p>
    );
  }

  return (
    <>
      <div className="space-y-4 pb-28 lg:space-y-6 lg:pb-0">
        <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">
          Keranjang Belanja
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItemList
              selectable
              selectedIds={selectedIds}
              onSelectedChange={setManualSelectedIds}
            />
          </div>
          <div className="hidden lg:block">
            <OrderSummary
              showCheckoutButton
              itemCount={selectedItemCount}
              total={selectedTotal}
              checkoutLabel={isSubmitting ? "Memproses..." : "Lanjut ke Checkout"}
              checkoutDisabled={selectedIds.size === 0 || isSubmitting}
              onCheckout={() => void handleCheckout()}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">
          <h3 className="mb-3 font-semibold text-gray-900">Ringkasan Belanja</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal ({selectedItemCount} item)</dt>
              <dd>{formatCurrency(selectedTotal)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-gray-200 bg-white p-3 lg:hidden">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-desahub-600">
              {formatCurrency(selectedTotal)}
            </span>
          </div>
          <MktButton
            className="w-full"
            disabled={selectedIds.size === 0 || isSubmitting}
            onClick={() => void handleCheckout()}
          >
            {isSubmitting ? "Memproses..." : "Checkout"}
          </MktButton>
        </div>
      )}
    </>
  );
}