import type { Metadata } from "next";
import ProductsManager from "@/components/admin/marketplace/ProductsManager";

export const metadata: Metadata = {
  title: "Kelola Produk | Marketplace UMKM | DesaHub",
  description: "Kelola produk marketplace UMKM desa",
};

export default function KelolaProdukPage() {
  return <ProductsManager />;
}
