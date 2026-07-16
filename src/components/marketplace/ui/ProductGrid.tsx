import type { Product } from "@/data/marketplace";
import { cn } from "@/lib/cn";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

/** Multi-row product grid. Use on mobile or when wrapping is preferred. */
export default function ProductGrid({ products, className }: ProductGridProps) {
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
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
