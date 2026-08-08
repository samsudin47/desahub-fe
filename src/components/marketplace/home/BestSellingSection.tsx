"use client";

import ProductSection from "@/components/marketplace/home/ProductSection";
import { useBestSellingProducts } from "@/hooks/useBestSellingProducts";
import { mapToMarketplaceProduct } from "@/lib/map-marketplace-product";
import { DEFAULT_BEST_SELLING_LIMIT } from "@/services/best-selling-product.service";

type BestSellingSectionProps = {
  limit?: number;
  viewAllHref?: string;
};

export default function BestSellingSection({
  limit = DEFAULT_BEST_SELLING_LIMIT,
  viewAllHref = "/marketplace-umkm/kategori",
}: BestSellingSectionProps) {
  const { products: rawProducts, isLoading, error } =
    useBestSellingProducts(limit);

  const products = rawProducts.map((item) => mapToMarketplaceProduct(item));

  if (isLoading) {
    return (
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 animate-pulse rounded bg-gray-200 sm:h-7 sm:w-44" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
          Produk Terlaris
        </h2>
        <p className="py-8 text-center text-sm text-red-500">{error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductSection
      title="Produk Terlaris"
      products={products}
      viewAllHref={viewAllHref}
    />
  );
}
