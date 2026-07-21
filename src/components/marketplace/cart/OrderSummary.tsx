"use client";

import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import MktButton from "../ui/MktButton";

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  itemCount?: number;
  total?: number;
  checkoutLabel?: string;
  checkoutDisabled?: boolean;
}

export default function OrderSummary({
  showCheckoutButton = false,
  onCheckout,
  itemCount: itemCountProp,
  total: totalProp,
  checkoutLabel = "Lanjut ke Checkout",
  checkoutDisabled = false,
}: OrderSummaryProps) {
  const { itemCount, total } = useCart();
  const resolvedItemCount = itemCountProp ?? itemCount;
  const resolvedTotal = totalProp ?? total;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Ringkasan Belanja</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <dt>Subtotal ({resolvedItemCount} item)</dt>
          <dd>{formatCurrency(resolvedTotal)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 font-semibold text-gray-900">
          <dt>Total</dt>
          <dd className="text-desahub-600">{formatCurrency(resolvedTotal)}</dd>
        </div>
      </dl>
      {showCheckoutButton && resolvedItemCount > 0 && (
        <MktButton
          className="mt-4 w-full"
          onClick={onCheckout}
          disabled={checkoutDisabled}
        >
          {checkoutLabel}
        </MktButton>
      )}
    </div>
  );
}