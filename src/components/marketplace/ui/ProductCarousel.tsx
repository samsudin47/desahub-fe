"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import type { Product } from "@/data/marketplace";
import { cn } from "@/lib/cn";
import ProductCard from "./ProductCard";

type ProductCarouselProps = {
  products: Product[];
  /** Visible slides on large desktop. Default: 5 */
  slidesPerView?: number;
  className?: string;
};

/** Horizontal product carousel (desktop). Swipe or use arrows when overflow. */
export default function ProductCarousel({
  products,
  slidesPerView = 5,
  className,
}: ProductCarouselProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">
        Tidak ada produk ditemukan.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "product-carousel relative w-full min-w-0 max-w-full",
        className,
      )}
    >
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={Math.min(3, slidesPerView)}
        navigation
        watchOverflow
        grabCursor
        breakpoints={{
          1024: { slidesPerView: Math.min(4, slidesPerView) },
          1280: { slidesPerView },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
