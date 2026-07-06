import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MarketplaceAdminNav from "@/components/admin/marketplace/MarketplaceAdminNav";

export default function KelolaMarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Marketplace UMKM" />
      <MarketplaceAdminNav />
      {children}
    </div>
  );
}
