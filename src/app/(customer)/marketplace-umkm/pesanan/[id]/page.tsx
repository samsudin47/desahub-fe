import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { mockOrders } from "@/data/marketplace";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import OrderTimeline from "@/components/marketplace/orders/OrderTimeline";
import ProductImage from "@/components/marketplace/ui/ProductImage";
import { formatCurrency } from "@/lib/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return mockOrders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Pesanan ${id} | DesaHub` };
}

export default async function PesananDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/marketplace-umkm/pesanan"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-desahub-600"
      >
        <ChevronLeft className="size-4" />
        Kembali ke Pesanan
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{order.id}</h1>
          <p className="text-sm text-gray-500">{order.shippingAddress}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-6 font-semibold text-gray-900">Lacak Pesanan</h2>
        <OrderTimeline status={order.status} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Detail Item</h2>
        <div className="space-y-3">
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-4">
              <ProductImage product={product} className="size-14" size="sm" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {quantity}x · {product.seller.name}
                </p>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-semibold">
          <span>Total</span>
          <span className="text-desahub-600">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
