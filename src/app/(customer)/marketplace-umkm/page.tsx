import type { Metadata } from "next";

import BestSellingSection from "@/components/marketplace/home/BestSellingSection";
import HeroSection from "@/components/marketplace/home/HeroSection";
import PopularCategoriesSection from "@/components/marketplace/home/PopularCategoriesSection";
import PromoBanner from "@/components/marketplace/home/PromoBanner";

export const metadata: Metadata = {
  title: "Marketplace UMKM | DesaHub",
  description:
    "Belanja produk UMKM lokal dari desa Anda. Makanan, kerajinan, pertanian, dan lainnya.",
};

export default function MarketplaceHomePage() {
  return (
    <div className="space-y-6 sm:space-y-10">
      <HeroSection />
      <PopularCategoriesSection />
      <BestSellingSection />
      <PromoBanner />
    </div>
  );
}
