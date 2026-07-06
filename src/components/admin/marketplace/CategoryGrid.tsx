import Badge from "@/components/ui/badge/Badge";
import {
  categories,
  getProductCountByCategory,
  products,
} from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const productCount = getProductCountByCategory(category.slug);
        const categoryProducts = products.filter(
          (p) => p.category === category.slug,
        );
        const totalSold = categoryProducts.reduce((sum, p) => sum + p.sold, 0);
        const avgPrice =
          categoryProducts.length > 0
            ? categoryProducts.reduce((sum, p) => sum + p.price, 0) /
              categoryProducts.length
            : 0;

        return (
          <div
            key={category.slug}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-500/10">
                {category.icon}
              </div>
              <Badge size="sm" color="light">
                {productCount} produk
              </Badge>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              {category.name}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Terjual
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {totalSold} unit
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Harga Rata-rata
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {formatCurrency(avgPrice)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
