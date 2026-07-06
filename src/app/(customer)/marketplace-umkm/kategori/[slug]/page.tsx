import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import ProductGrid from "@/components/marketplace/ui/ProductGrid";

import {

  categories,

  getCategoryBySlug,

  getProductsByCategory,

  type ProductCategory,

} from "@/data/marketplace";

import { cn } from "@/lib/cn";



type PageProps = {

  params: Promise<{ slug: string }>;

};



export async function generateStaticParams() {

  return categories.map((c) => ({ slug: c.slug }));

}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { slug } = await params;

  const category = getCategoryBySlug(slug);

  return {

    title: category

      ? `${category.name} | Marketplace UMKM | DesaHub`

      : "Kategori | DesaHub",

  };

}



export default async function KategoriDetailPage({ params }: PageProps) {

  const { slug } = await params;

  const category = getCategoryBySlug(slug);



  if (!category) {

    notFound();

  }



  const products = getProductsByCategory(slug as ProductCategory);



  return (

    <div className="-mx-4 flex min-h-[calc(100dvh-8rem)] flex-col sm:mx-0 lg:min-h-0 lg:flex-row lg:gap-6">

      {/* Mobile + desktop: vertical category sidebar */}

      <aside className="shrink-0 border-b border-gray-200 bg-white lg:w-56 lg:border-b-0 lg:border-r lg:bg-transparent">

        <nav className="flex w-full justify-center lg:flex-col lg:justify-start lg:gap-1 lg:p-0">

          {categories.map((cat) => (

            <Link

              key={cat.slug}

              href={`/marketplace-umkm/kategori/${cat.slug}`}

              className={cn(

                "flex shrink-0 flex-col items-center gap-1 border-r border-gray-100 px-3 py-3 text-center transition last:border-r-0 lg:flex-row lg:gap-2 lg:rounded-lg lg:border-0 lg:px-3 lg:py-2 lg:text-left",

                cat.slug === slug

                  ? "bg-desahub-50 text-desahub-600 lg:bg-desahub-500 lg:text-white"

                  : "text-gray-600 hover:bg-gray-50 lg:hover:bg-desahub-50 lg:hover:text-desahub-600"

              )}

            >

              <span className="text-lg lg:text-base">{cat.icon}</span>

              <span className="text-[10px] font-medium leading-tight lg:text-sm">

                {cat.name}

              </span>

            </Link>

          ))}

        </nav>

      </aside>



      <div className="flex-1 space-y-4 px-4 py-4 lg:px-0 lg:py-0">

        <div className="hidden lg:block">

          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">

            {category.icon} {category.name}

          </h1>

          <p className="mt-1 text-sm text-gray-500">

            {products.length} produk tersedia

          </p>

        </div>



        {/* Mobile filter chips */}

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">

          {["Filter", "Urutkan", "Terlaris"].map((chip) => (

            <button

              key={chip}

              type="button"

              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"

            >

              {chip}

            </button>

          ))}

        </div>



        <ProductGrid products={products} />

      </div>

    </div>

  );

}


