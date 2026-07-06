import { Truck } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-desahub-200 bg-desahub-50 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-desahub-500 text-white">
        <Truck className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-desahub-700">Gratis Ongkir</p>
        <p className="text-xs text-desahub-600">
          Min. belanja Rp50.000 untuk wilayah desa
        </p>
      </div>
    </div>
  );
}
