"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import CheckoutSteps from "@/components/marketplace/checkout/CheckoutSteps";
import MktButton from "@/components/marketplace/ui/MktButton";
import { useCart } from "@/context/CartContext";

export default function SelesaiPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-lg space-y-8 py-12 text-center">
      <CheckoutSteps current={3} />
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="size-16 text-desahub-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          Pembayaran Berhasil!
        </h1>
        <p className="text-sm text-gray-500">
          Terima kasih telah berbelanja. Pesanan Anda sedang diproses dan akan
          segera dikonfirmasi oleh penjual.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/marketplace-umkm/pesanan">
          <MktButton variant="outline">Lihat Pesanan</MktButton>
        </Link>
        <Link href="/marketplace-umkm">
          <MktButton>Kembali ke Beranda</MktButton>
        </Link>
      </div>
    </div>
  );
}
