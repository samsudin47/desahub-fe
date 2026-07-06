"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import MktButton from "./MktButton";

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export default function ProductCard({
  product,
  showAddButton = true,
}: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-desahub-200 hover:shadow-theme-sm">
      <Link href={`/marketplace-umkm/produk/${product.id}`}>
        <ProductImage
          product={product}
          className="aspect-square w-full transition group-hover:scale-[1.02]"
          size="lg"
        />
      </Link>
      <div className="space-y-2 p-4">
        <Link href={`/marketplace-umkm/produk/${product.id}`}>
          <h3 className="line-clamp-2 font-medium text-gray-900 hover:text-desahub-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500">{product.seller.name}</p>
        <div className="flex items-center justify-between">
          <StarRating rating={product.rating} />
          <span className="font-semibold text-desahub-600">
            {formatCurrency(product.price)}
          </span>
        </div>
        {showAddButton && (
          <MktButton
            variant="outline"
            size="sm"
            className="w-full"
            startIcon={<Plus className="size-4" />}
            onClick={() => addItem(product)}
          >
            Tambah
          </MktButton>
        )}
      </div>
    </div>
  );
}
