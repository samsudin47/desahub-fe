import Link from "next/link";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { OrderListItem } from "@/types/order";
import { cn } from "@/lib/cn";

const MAX_THUMBNAILS = 3;

type OrderListCardProps = {
  order: OrderListItem;
  className?: string;
};

export default function OrderListCard({ order, className }: OrderListCardProps) {
  const visibleItems = order.items.slice(0, MAX_THUMBNAILS);
  const remainingCount = order.items.length - visibleItems.length;

  return (
    <Link
      href={`/marketplace-umkm/pesanan/${order.uuid}`}
      className={cn(
        "block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-desahub-200 hover:shadow-theme-sm",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {order.order_number}
          </p>
          <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge
          status={order.status}
          label={order.status_label}
        />
      </div>

      <div className="flex items-center gap-3">
        {visibleItems.map((item) => (
          <div
            key={item.uuid}
            className="size-12 shrink-0 overflow-hidden rounded-xl bg-gray-100"
          >
            {item.produk.gambar ? (
              <img
                src={item.produk.gambar}
                alt={item.produk.nama_produk}
                className="size-full object-cover"
              />
            ) : (
              <div
                className="flex size-full items-center justify-center text-xs text-gray-400"
                aria-hidden
              >
                —
              </div>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <span className="text-xs text-gray-400">
            +{remainingCount} lainnya
          </span>
        )}

        <span className="ml-auto font-semibold text-desahub-600">
          {formatCurrency(order.total_harga)}
        </span>
      </div>
    </Link>
  );
}
