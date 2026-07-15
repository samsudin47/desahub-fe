"use client";

import CategoryNav from "@/components/marketplace/category/CategoryNav";
import ProductGrid from "@/components/marketplace/ui/ProductGrid";
import { useDropdownKategori } from "@/hooks/useDropdownKategori";
import { useProductCategory } from "@/hooks/useProductCategory";
import { mapToMarketplaceProduct } from "@/lib/map-marketplace-product";
import { formatSlugLabel } from "@/lib/slugify";
import { findDropdownKategoriBySlug } from "@/services/dropdown.service";

type CategoryDetailViewProps = {
  slug: string;
};

export default function CategoryDetailView({ slug }: CategoryDetailViewProps) {
  const {
    items,
    isLoading: isNavLoading,
    error: navError,
  } = useDropdownKategori();

  const activeCategory = findDropdownKategoriBySlug(items, slug);

  const {
    data,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProductCategory(activeCategory?.uuid);

  const categoryName =
    data?.nama_kategori ??
    activeCategory?.nama_kategori ??
    formatSlugLabel(slug);

  const products =
    data?.produk.map((item) => mapToMarketplaceProduct(item, slug)) ?? [];

  const totalProduk = data?.total_produk ?? products.length;
  const showHeaderLoading = (isNavLoading || isProductsLoading) && !data;

  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-8rem)] flex-col sm:mx-0 lg:min-h-0 lg:flex-row lg:gap-6">
      <aside className="shrink-0 border-b border-gray-200 bg-white lg:w-56 lg:border-b-0 lg:border-r lg:bg-transparent">
        <CategoryNav
          activeSlug={slug}
          items={items}
          isLoading={isNavLoading}
          error={navError}
        />
      </aside>

      <div className="flex-1 space-y-4 px-4 py-4 lg:px-0 lg:py-0">
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            {showHeaderLoading ? "Memuat..." : categoryName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {showHeaderLoading
              ? "Memuat produk..."
              : `${totalProduk} produk tersedia`}
          </p>
        </div>

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

        {productsError ? (
          <p className="py-12 text-center text-red-500">{productsError}</p>
        ) : isProductsLoading && !data ? (
          <p className="py-12 text-center text-gray-500">Memuat produk...</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
