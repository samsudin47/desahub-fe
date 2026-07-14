import MasterKategoriManager from "@/components/admin/data-management/MasterKategoriManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Kategori | Data Management | DesaHub",
  description: "Kelola master kategori data desa",
};

export default function MasterKategoriPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Kategori" hideTitle />
      <MasterKategoriManager />
    </div>
  );
}
