import { cn } from "@/lib/cn";
import {
  getOrderStatusLabel,
  getOrderStatusStyle,
} from "@/lib/order-status";

export default function OrderStatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  /** Prefer BE `status_label` when available. */
  label?: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getOrderStatusStyle(status),
        className,
      )}
    >
      {getOrderStatusLabel(status, label)}
    </span>
  );
}
