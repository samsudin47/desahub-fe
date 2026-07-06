import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/marketplace/ui/OrderStatusBadge";
import { mockOrders } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function RecentOrdersTable() {
  const recentOrders = [...mockOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pesanan Terbaru
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pesanan marketplace yang perlu ditindaklanjuti
          </p>
        </div>
        <Link
          href="/kelola-marketplace/pesanan"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Lihat semua
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                ID Pesanan
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Produk
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Total
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Tanggal
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                  {order.id}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {order.items.map((i) => i.product.name).join(", ")}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="py-3">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
