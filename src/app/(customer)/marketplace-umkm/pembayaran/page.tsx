"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { getPembayaranPagePath } from "@/lib/checkout-routes";

export default function PembayaranPage() {
  const router = useRouter();
  const { activeCheckoutUuid } = useCheckoutFlow();

  useEffect(() => {
    if (activeCheckoutUuid) {
      router.replace(getPembayaranPagePath(activeCheckoutUuid));
      return;
    }

    router.replace("/marketplace-umkm/keranjang");
  }, [activeCheckoutUuid, router]);

  return (
    <div className="py-12 text-center">
      <p className="text-gray-500">Mengarahkan ke pembayaran aktif...</p>
      <MktButton
        className="mt-4"
        onClick={() => router.push("/marketplace-umkm/keranjang")}
      >
        Kembali ke Keranjang
      </MktButton>
    </div>
  );
}
