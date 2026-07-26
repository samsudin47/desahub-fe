import Badge from "@/components/ui/badge/Badge";
import {
  getOrderBadgeColor,
  getOrderStatusLabel,
} from "@/lib/order-status";

export default function OrderStatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string | null;
}) {
  return (
    <Badge size="sm" variant="light" color={getOrderBadgeColor(status)}>
      {getOrderStatusLabel(status, label)}
    </Badge>
  );
}
