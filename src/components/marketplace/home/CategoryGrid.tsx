"use client";

import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { getCategoryIcon } from "@/lib/category-icon";
import { slugify } from "@/lib/slugify";
import type { PopularCategory } from "@/types/popular-category";

type CategoryGridProps = {
  categories: PopularCategory[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const slides =
    categories.length > 0
      ? [...categories, ...categories, ...categories]
      : [];

  return (
    <div className="category-carousel product-carousel relative w-full min-w-0 max-w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={3.2}
        loop
        speed={5000}
        allowTouchMove={false}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 5, spaceBetween: 12 },
          1024: { slidesPerView: 6, spaceBetween: 16 },
        }}
      >
        {slides.map((cat, index) => {
          const slug = slugify(cat.nama_kategori);
          const Icon = getCategoryIcon(cat.nama_kategori);

          return (
            <SwiperSlide key={`${cat.uuid}-${index}`}>
              <Link
                href={`/marketplace-umkm/kategori/${slug}`}
                className="flex h-full w-full flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-desahub-300 hover:bg-desahub-50 sm:gap-2 sm:p-4"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-desahub-50 text-desahub-600 sm:size-12">
                  <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
                </span>
                <span className="text-center text-[11px] font-medium text-gray-700 sm:text-sm">
                  {cat.nama_kategori}
                </span>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
