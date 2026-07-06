import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { products } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";

export default function TopProductsTable() {
  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Produk Terlaris
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Produk UMKM dengan penjualan tertinggi
          </p>
        </div>
        <Link
          href="/kelola-marketplace/produk"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Kelola produk
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Produk
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Penjual
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Terjual
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Stok
              </TableCell>
              <TableCell isHeader className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Harga
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {topProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: product.imageColor }}
                    >
                      📦
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {product.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {product.seller.name}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-800 dark:text-white/90">
                  {product.sold}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={product.stock < 20 ? "warning" : "success"}
                  >
                    {product.stock} unit
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(product.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
