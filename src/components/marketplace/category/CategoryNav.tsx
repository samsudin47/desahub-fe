"use client";

import Link from "next/link";

import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slugify";
import type { DropdownKategori } from "@/types/dropdown-kategori";

type CategoryNavProps = {
  activeSlug: string;
  items: DropdownKategori[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

export default function CategoryNav({
  activeSlug,
  items,
  isLoading = false,
  error = null,
  className,
}: CategoryNavProps) {
  if (isLoading) {
    return (
      <nav
        className={cn(
          "flex w-full justify-center px-3 py-3 lg:flex-col lg:justify-start lg:gap-1 lg:p-0",
          className,
        )}
      >
        <p className="text-sm text-gray-400">Memuat kategori...</p>
      </nav>
    );
  }

  if (error) {
    return (
      <nav
        className={cn(
          "flex w-full justify-center px-3 py-3 lg:flex-col lg:justify-start lg:gap-1 lg:p-0",
          className,
        )}
      >
        <p className="text-sm text-red-500">{error}</p>
      </nav>
    );
  }

  if (items.length === 0) {
    return (
      <nav
        className={cn(
          "flex w-full justify-center px-3 py-3 lg:flex-col lg:justify-start lg:gap-1 lg:p-0",
          className,
        )}
      >
        <p className="text-sm text-gray-400">Belum ada kategori</p>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "flex w-full justify-center overflow-x-auto no-scrollbar lg:flex-col lg:justify-start lg:gap-2.5 lg:overflow-visible lg:p-0",
        className,
      )}
    >
      {items.map((item) => {
        const slug = slugify(item.nama_kategori);
        const isActive = slug === activeSlug;

        return (
          <Link
            key={item.uuid}
            href={`/marketplace-umkm/kategori/${slug}`}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 border-r border-gray-100 px-3 py-3 text-center transition last:border-r-0 lg:flex-row lg:gap-2 lg:rounded-lg lg:border-0 lg:px-3 lg:py-2.5 lg:text-left",
              isActive
                ? "bg-desahub-50 text-desahub-600 lg:bg-desahub-500 lg:text-white"
                : "text-gray-600 hover:bg-gray-50 lg:hover:bg-desahub-50 lg:hover:text-desahub-600",
            )}
          >
            <span className="text-[10px] font-medium leading-tight lg:text-sm">
              {item.nama_kategori}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
