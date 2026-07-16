import Link from "next/link";

import type { Product } from "@/data/marketplace";
import ProductListing from "../ui/ProductListing";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductSection({
  title,
  products,
  viewAllHref,
}: ProductSectionProps) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-medium text-desahub-600 hover:text-desahub-700 sm:text-sm"
          >
            Lihat Semua
          </Link>
        )}
      </div>

      <ProductListing products={products} />
    </section>
  );
}
