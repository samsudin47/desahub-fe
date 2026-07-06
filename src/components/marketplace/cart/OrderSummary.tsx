"use client";

import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import MktButton from "../ui/MktButton";

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  shippingCost?: number;
}

export default function OrderSummary({
  showCheckoutButton = false,
  onCheckout,
  shippingCost = 10000,
}: OrderSummaryProps) {
  const { items, total } = useCart();
  const grandTotal = total + (items.length > 0 ? shippingCost : 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Ringkasan Belanja</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <dt>Subtotal ({items.length} item)</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
        <div className="flex justify-between text-gray-600">
          <dt>Ongkos Kirim</dt>
          <dd>
            {items.length > 0 ? formatCurrency(shippingCost) : formatCurrency(0)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 font-semibold text-gray-900">
          <dt>Total</dt>
          <dd className="text-desahub-600">{formatCurrency(grandTotal)}</dd>
        </div>
      </dl>
      {showCheckoutButton && items.length > 0 && (
        <MktButton className="mt-4 w-full" onClick={onCheckout}>
          Lanjut ke Checkout
        </MktButton>
      )}
    </div>
  );
}
