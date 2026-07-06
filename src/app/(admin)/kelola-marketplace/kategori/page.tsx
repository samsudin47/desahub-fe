import type { Metadata } from "next";
import CategoryGrid from "@/components/admin/marketplace/CategoryGrid";
import { categories, products } from "@/data/marketplace";

export const metadata: Metadata = {
  title: "Kategori Produk | Marketplace UMKM | DesaHub",
  description: "Kelola kategori produk marketplace UMKM desa",
};

export default function KelolaKategoriPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Kategori Produk
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {categories.length} kategori · {products.length} produk total
        </p>
      </div>

      <CategoryGrid />
    </div>
  );
}
