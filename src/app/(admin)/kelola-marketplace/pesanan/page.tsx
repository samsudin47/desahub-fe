import type { Metadata } from "next";
import OrdersManager from "@/components/admin/marketplace/OrdersManager";

export const metadata: Metadata = {
  title: "Kelola Pesanan | Marketplace UMKM | DesaHub",
  description: "Kelola pesanan marketplace UMKM desa",
};

export default function KelolaPesananPage() {
  return <OrdersManager />;
}
