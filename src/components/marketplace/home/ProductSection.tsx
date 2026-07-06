import Link from "next/link";

import type { Product } from "@/data/marketplace";

import ProductCard from "../ui/ProductCard";

import ProductGrid from "../ui/ProductGrid";



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



      {/* Mobile: horizontal scroll */}

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:hidden">

        {products.slice(0, 6).map((product) => (

          <div key={product.id} className="w-[140px] shrink-0">

            <ProductCard product={product} />

          </div>

        ))}

      </div>



      {/* Desktop: grid */}

      <div className="hidden sm:block">

        <ProductGrid products={products} />

      </div>

    </section>

  );

}


