import type { Metadata } from "next";
import SellersManager from "@/components/admin/marketplace/SellersManager";

export const metadata: Metadata = {
  title: "Penjual UMKM | Marketplace UMKM | DesaHub",
  description: "Kelola penjual UMKM di marketplace desa",
};

export default function KelolaPenjualPage() {
  return <SellersManager />;
}
