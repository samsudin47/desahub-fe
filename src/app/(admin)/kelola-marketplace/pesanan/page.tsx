import type { Metadata } from "next";
import OrdersTable from "@/components/admin/marketplace/OrdersTable";
import { mockOrders } from "@/data/marketplace";

export const metadata: Metadata = {
  title: "Kelola Pesanan | Marketplace UMKM | DesaHub",
  description: "Kelola pesanan marketplace UMKM desa",
};

export default function KelolaPesananPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manajemen Pesanan
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pantau dan kelola {mockOrders.length} pesanan marketplace
        </p>
      </div>

      <OrdersTable />
    </div>
  );
}
