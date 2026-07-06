"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { getProductsBySeller, type Seller } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import TableRowActions from "@/components/admin/marketplace/TableRowActions";

interface SellersTableProps {
  sellers: Seller[];
  onEdit: (seller: Seller) => void;
  onDelete: (seller: Seller) => void;
}

export default function SellersTable({
  sellers,
  onEdit,
  onDelete,
}: SellersTableProps) {
  if (sellers.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Belum ada toko terdaftar. Klik &quot;Tambah Toko&quot; untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="min-w-full">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Penjual UMKM
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Desa
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Produk
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Terjual
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Rating
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sellers.map((seller) => {
              const sellerProducts = getProductsBySeller(seller.id);
              const totalSold = sellerProducts.reduce((sum, p) => sum + p.sold, 0);
              const totalRevenue = sellerProducts.reduce(
                (sum, p) => sum + p.sold * p.price,
                0,
              );

              return (
                <TableRow key={seller.id}>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg dark:bg-brand-500/10">
                        🏪
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {seller.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(totalRevenue)} pendapatan
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {seller.village}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {sellerProducts.length} produk
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {totalSold} unit
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge size="sm" color="success">
                      ⭐ {seller.rating}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge size="sm" color="success">
                      Aktif
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[120px] px-4 py-4 align-middle">
                    <TableRowActions
                      onEdit={() => onEdit(seller)}
                      onDelete={() => onDelete(seller)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
