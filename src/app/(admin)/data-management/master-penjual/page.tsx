import MasterPenjualManager from "@/components/admin/data-management/MasterPenjualManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Penjual | Data Management | DesaHub",
  description: "Kelola master penjual data desa",
};

export default function MasterPenjualPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Penjual" hideTitle />
      <MasterPenjualManager />
    </div>
  );
}
