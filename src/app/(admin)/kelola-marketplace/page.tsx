import type { Metadata } from "next";
import MarketplaceMetrics from "@/components/admin/marketplace/MarketplaceMetrics";
import MarketplaceSalesChart from "@/components/admin/marketplace/MarketplaceSalesChart";
import MarketplaceTarget from "@/components/admin/marketplace/MarketplaceTarget";
import RecentOrdersTable from "@/components/admin/marketplace/RecentOrdersTable";
import TopProductsTable from "@/components/admin/marketplace/TopProductsTable";
import { getMarketplaceStats } from "@/data/marketplace";

export const metadata: Metadata = {
  title: "Kelola Marketplace UMKM | DesaHub",
  description: "Dashboard pengelolaan marketplace UMKM desa",
};

export default function KelolaMarketplacePage() {
  const stats = getMarketplaceStats();

  return (
    <div className="space-y-6">
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="rounded-2xl border border-warning-200 bg-warning-50 px-5 py-4 dark:border-warning-500/30 dark:bg-warning-500/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-800 dark:text-warning-400">
                Perlu perhatian
              </p>
              <p className="mt-0.5 text-sm text-warning-700 dark:text-warning-500/80">
                {stats.pendingOrders > 0 &&
                  `${stats.pendingOrders} pesanan menunggu tindakan. `}
                {stats.lowStockProducts > 0 &&
                  `${stats.lowStockProducts} produk stok rendah.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <MarketplaceMetrics />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7">
          <MarketplaceSalesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MarketplaceTarget />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7">
          <RecentOrdersTable />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <TopProductsTable />
        </div>
      </div>
    </div>
  );
}
