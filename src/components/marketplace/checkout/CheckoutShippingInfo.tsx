import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CheckoutShippingDatas } from "@/types/checkout";

type CheckoutShippingInfoProps = {
  shipping: CheckoutShippingDatas;
  className?: string;
};

function ShippingRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-gray-600">{label}</dt>
      <dd className="wrap-break-word text-right font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export default function CheckoutShippingInfo({
  shipping,
  className,
}: CheckoutShippingInfoProps) {
  const mapsUrl = `https://www.google.com/maps?q=${shipping.latitude},${shipping.longitude}`;

  return (
    <div className={cn("border-t border-gray-100 pt-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="size-4 text-desahub-600" />
        <h3 className="text-sm font-semibold text-gray-900">Alamat Pengiriman</h3>
      </div>

      <dl className="space-y-2 text-sm">
        <ShippingRow label="Nama Penerima" value={shipping.nama_penerima} />
        <ShippingRow label="No. HP" value={shipping.no_hp_penerima} />
        <ShippingRow label="Alamat" value={shipping.alamat_penerima} />
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-gray-600">Lokasi</dt>
          <dd className="text-right">
            <p className="break-all font-medium text-gray-900">
              {shipping.latitude}, {shipping.longitude}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs font-medium text-desahub-600 underline-offset-2 hover:underline"
            >
              Lihat di peta
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
