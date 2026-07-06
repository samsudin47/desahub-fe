import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/data/marketplace";
import { orderStatusLabels } from "@/data/marketplace";

const statusStyles: Record<OrderStatus, string> = {
  menunggu_pembayaran: "bg-orange-50 text-orange-600",
  diproses: "bg-blue-light-50 text-blue-light-600",
  dikirim: "bg-desahub-50 text-desahub-600",
  selesai: "bg-success-50 text-success-600",
  dibatalkan: "bg-error-50 text-error-600",
};

export default function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
