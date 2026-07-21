"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCheckoutFlow } from "@/context/CheckoutContext";
import { getCheckoutPagePath } from "@/lib/checkout-routes";

export default function CheckoutPage() {
  const router = useRouter();
  const { activeCheckoutUuid } = useCheckoutFlow();

  useEffect(() => {
    if (activeCheckoutUuid) {
      router.replace(getCheckoutPagePath(activeCheckoutUuid));
      return;
    }

    router.replace("/marketplace-umkm/keranjang");
  }, [activeCheckoutUuid, router]);

  return (
    <div className="py-12 text-center">
      <p className="text-gray-500">Mengarahkan ke checkout aktif...</p>
      <MktButton
        className="mt-4"
        onClick={() => router.push("/marketplace-umkm/keranjang")}
      >
        Kembali ke Keranjang
      </MktButton>
    </div>
  );
}
