import type { Metadata } from "next";

import HeroSection from "@/components/marketplace/home/HeroSection";

import CategoryGrid from "@/components/marketplace/home/CategoryGrid";

import ProductSection from "@/components/marketplace/home/ProductSection";

import PromoBanner from "@/components/marketplace/home/PromoBanner";

import { getFeaturedProducts } from "@/data/marketplace";



export const metadata: Metadata = {

  title: "Marketplace UMKM | DesaHub",

  description:

    "Belanja produk UMKM lokal dari desa Anda. Makanan, kerajinan, pertanian, dan lainnya.",

};



export default function MarketplaceHomePage() {

  const featured = getFeaturedProducts();



  return (

    <div className="space-y-6 sm:space-y-10">

      <HeroSection />

      <section className="space-y-3">

        <h2 className="text-base font-semibold text-gray-900 sm:text-xl">

          Kategori Populer

        </h2>

        <CategoryGrid />

      </section>

      <ProductSection

        title="Produk Terlaris"

        products={featured}

        viewAllHref="/marketplace-umkm/kategori/makanan"

      />

      <PromoBanner />

    </div>

  );

}


