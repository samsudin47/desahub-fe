"use client";

import type { Product } from "@/data/marketplace";
import { categories } from "@/data/marketplace";
import { cn } from "@/lib/cn";

export default function AdminProductThumbnail({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const category = categories.find((c) => c.slug === product.category);

  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={cn(
          "h-11 w-11 shrink-0 rounded-lg object-cover",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg",
        className,
      )}
      style={{ backgroundColor: product.imageColor }}
    >
      {category?.icon ?? "📦"}
    </div>
  );
}
