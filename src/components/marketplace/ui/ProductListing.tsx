"use client";

import type { Product } from "@/data/marketplace";
import ProductCarousel from "./ProductCarousel";
import ProductGrid from "./ProductGrid";

type ProductListingProps = {
  products: Product[];
  /**
   * - responsive: grid on mobile (multi-row), carousel on desktop
   * - grid: always multi-row grid
   * - carousel: always horizontal carousel
   */
  layout?: "responsive" | "grid" | "carousel";
  /** Desktop carousel slides (responsive/carousel only). Default: 5 */
  slidesPerView?: number;
};

/**
 * Reusable product listing.
 * Mobile → wrapping grid (scroll page vertically).
 * Desktop → Swiper carousel (5 visible, swipe/arrows).
 */
export default function ProductListing({
  products,
  layout = "responsive",
  slidesPerView = 5,
}: ProductListingProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">
        Tidak ada produk ditemukan.
      </p>
    );
  }

  if (layout === "grid") {
    return <ProductGrid products={products} />;
  }

  if (layout === "carousel") {
    return (
      <ProductCarousel products={products} slidesPerView={slidesPerView} />
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <ProductGrid products={products} />
      </div>
      <div className="hidden min-w-0 lg:block">
        <ProductCarousel products={products} slidesPerView={slidesPerView} />
      </div>
    </>
  );
}
