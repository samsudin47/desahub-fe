"use client";

import CategoryGrid from "@/components/marketplace/home/CategoryGrid";
import { usePopularCategories } from "@/hooks/usePopularCategories";

export default function PopularCategoriesSection() {
  const { categories, isLoading, error } = usePopularCategories();

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200 sm:h-7 sm:w-48" />
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-3 sm:w-auto sm:gap-2 sm:p-4"
            >
              <div className="size-11 animate-pulse rounded-full bg-gray-100 sm:size-12" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
          Kategori Populer
        </h2>
        <p className="py-6 text-center text-sm text-red-500">{error}</p>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
        Kategori Populer
      </h2>
      <CategoryGrid categories={categories} />
    </section>
  );
}
