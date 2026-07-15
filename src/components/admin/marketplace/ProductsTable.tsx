"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import AdminProductThumbnail from "@/components/admin/marketplace/AdminProductThumbnail";
import TableRowActions from "@/components/admin/marketplace/TableRowActions";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Belum ada produk terdaftar. Klik &quot;Tambah Produk&quot; untuk
          memulai.
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
              <TableCell isHeader className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Gambar
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Produk
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Kategori
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Penjual
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Harga
              </TableCell>
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Stok
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => (
              <TableRow key={product.uuid}>
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <AdminProductThumbnail product={product} />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {product.nama_product}
                  </p>
                  {product.deskripsi && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {product.deskripsi}
                    </p>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {product.nama_kategori}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {product.nama_penjual}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(product.harga)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    size="sm"
                    color={product.stock < 20 ? "warning" : "success"}
                  >
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="min-w-[120px] px-4 py-4 align-middle">
                  <TableRowActions
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
