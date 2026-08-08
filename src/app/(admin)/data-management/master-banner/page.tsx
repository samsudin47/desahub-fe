import MasterBannerManager from "@/components/admin/data-management/MasterBannerManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Banner | Data Management | DesaHub",
  description: "Kelola master banner marketplace",
};

export default function MasterBannerPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Banner" hideTitle />
      <MasterBannerManager />
    </div>
  );
}
