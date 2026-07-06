"use client";



import { useState } from "react";

import { useRouter } from "next/navigation";

import { Minus, Plus, Trash2 } from "lucide-react";

import Link from "next/link";

import { useCart } from "@/context/CartContext";

import { formatCurrency } from "@/lib/format";

import ProductImage from "../ui/ProductImage";

import OrderSummary from "./OrderSummary";

import MktButton from "../ui/MktButton";



interface CartItemListProps {

  selectable?: boolean;

}



export default function CartItemList({ selectable = false }: CartItemListProps) {

  const { items, updateQuantity, removeItem } = useCart();

  const [selected, setSelected] = useState<Set<string>>(

    () => new Set(items.map((i) => i.product.id))

  );



  const allSelected = items.length > 0 && selected.size === items.length;



  const toggleAll = () => {

    if (allSelected) {

      setSelected(new Set());

    } else {

      setSelected(new Set(items.map((i) => i.product.id)));

    }

  };



  const toggleItem = (id: string) => {

    setSelected((prev) => {

      const next = new Set(prev);

      if (next.has(id)) next.delete(id);

      else next.add(id);

      return next;

    });

  };



  if (items.length === 0) {

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



      {items.map(({ product, quantity }) => (

        <div

          key={product.id}

          className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-4 sm:p-4"

        >

          {selectable && (

            <input

              type="checkbox"

              checked={selected.has(product.id)}

              onChange={() => toggleItem(product.id)}

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

              <div className="flex items-center gap-1.5">

                <button

                  type="button"

                  className="rounded-lg border border-gray-200 p-1 hover:bg-gray-50"

                  onClick={() => updateQuantity(product.id, quantity - 1)}

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

                  onClick={() => updateQuantity(product.id, quantity + 1)}

                >

                  <Plus className="size-3.5" />

                </button>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-sm font-semibold text-desahub-600">

                  {formatCurrency(product.price * quantity)}

                </span>

                {selectable && (

                  <button

                    type="button"

                    className="text-gray-400 hover:text-error-500"

                    onClick={() => removeItem(product.id)}

                    aria-label="Hapus item"

                  >

                    <Trash2 className="size-4" />

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}



export function CartPageContent() {

  const router = useRouter();

  const { items, total } = useCart();

  const shippingCost = 10000;

  const grandTotal = total + (items.length > 0 ? shippingCost : 0);



  return (

    <>

      <div className="space-y-4 pb-28 lg:space-y-6 lg:pb-0">

        <h1 className="hidden text-xl font-semibold text-gray-900 sm:text-2xl lg:block">

          Keranjang Belanja

        </h1>

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <CartItemList selectable />

          </div>

          <div className="hidden lg:block">

            <OrderSummary

              showCheckoutButton

              onCheckout={() => router.push("/marketplace-umkm/checkout")}

            />

          </div>

        </div>



        <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">

          <h3 className="mb-3 font-semibold text-gray-900">Ringkasan Belanja</h3>

          <dl className="space-y-2 text-sm">

            <div className="flex justify-between text-gray-600">

              <dt>Subtotal</dt>

              <dd>{formatCurrency(total)}</dd>

            </div>

            <div className="flex justify-between text-gray-600">

              <dt>Ongkos Kirim</dt>

              <dd>{formatCurrency(items.length > 0 ? shippingCost : 0)}</dd>

            </div>

          </dl>

        </div>

      </div>



      {items.length > 0 && (

        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-gray-200 bg-white p-3 lg:hidden">

          <div className="mb-2 flex items-center justify-between text-sm">

            <span className="text-gray-600">Total</span>

            <span className="font-bold text-desahub-600">

              {formatCurrency(grandTotal)}

            </span>

          </div>

          <MktButton

            className="w-full"

            onClick={() => router.push("/marketplace-umkm/checkout")}

          >

            Checkout

          </MktButton>

        </div>

      )}

    </>

  );

}


