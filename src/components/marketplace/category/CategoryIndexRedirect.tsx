"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDropdownKategori } from "@/hooks/useDropdownKategori";
import { slugify } from "@/lib/slugify";

const FALLBACK_HREF = "/marketplace-umkm";

export default function CategoryIndexRedirect() {
  const router = useRouter();
  const { items, isLoading, error } = useDropdownKategori();

  useEffect(() => {
    if (isLoading) return;

    if (error || items.length === 0) {
      router.replace(FALLBACK_HREF);
      return;
    }

    router.replace(
      `/marketplace-umkm/kategori/${slugify(items[0].nama_kategori)}`,
    );
  }, [error, isLoading, items, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-gray-500">Memuat kategori...</p>
    </div>
  );
}
