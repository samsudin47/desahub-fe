"use client";

import TableRowActions from "@/components/admin/marketplace/TableRowActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MasterKategori } from "@/types/master-kategori";

interface MasterKategoriTableProps {
  items: MasterKategori[];
  onEdit: (item: MasterKategori) => void;
  onDelete: (item: MasterKategori) => void;
}

export default function MasterKategoriTable({
  items,
  onEdit,
  onDelete,
}: MasterKategoriTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Belum ada kategori. Klik &quot;Tambah Kategori&quot; untuk memulai.
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
              <TableCell
                isHeader
                className="w-16 px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                No
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Nama Kategori
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Deskripsi
              </TableCell>
              <TableCell
                isHeader
                className="min-w-[120px] px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, index) => (
              <TableRow key={item.uuid}>
                <TableCell className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {item.nama_kategori}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {item.deskripsi || "—"}
                </TableCell>
                <TableCell className="min-w-[120px] px-4 py-4 align-middle">
                  <TableRowActions
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item)}
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
