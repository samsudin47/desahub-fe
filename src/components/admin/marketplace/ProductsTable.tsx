"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { categories, type Product } from "@/data/marketplace";
import { formatCurrency } from "@/lib/format";
import TableRowActions from "@/components/admin/marketplace/TableRowActions";
import AdminProductThumbnail from "@/components/admin/marketplace/AdminProductThumbnail";

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
              <TableCell isHeader className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                Terjual
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
            {products.map((product) => {
              const category = categories.find(
                (c) => c.slug === product.category,
              );
              return (
                <TableRow key={product.id}>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AdminProductThumbnail product={product} />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {category?.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {product.seller.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      size="sm"
                      color={product.stock < 20 ? "warning" : "success"}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                    {product.sold}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      size="sm"
                      color={product.featured ? "success" : "light"}
                    >
                      {product.featured ? "Unggulan" : "Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[120px] px-4 py-4 align-middle">
                    <TableRowActions
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(product)}
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
