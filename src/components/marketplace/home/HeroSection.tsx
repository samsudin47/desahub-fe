"use client";

import Link from "next/link";
import MktButton from "../ui/MktButton";
import { useMarketplaceBanner } from "@/hooks/useMarketplaceBanner";

export default function HeroSection() {
  const { banner, isLoading } = useMarketplaceBanner();

  if (isLoading) {
    return (
      <section
        className="h-48 animate-pulse rounded-2xl bg-gradient-to-br from-desahub-500 via-desahub-600 to-desahub-800 shadow-theme-lg sm:h-56 lg:h-64"
        aria-hidden
      />
    );
  }

  if (!banner) return null;

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-desahub-500 via-desahub-600 to-desahub-800 shadow-theme-lg">
      <div className="flex flex-col lg:grid lg:grid-cols-2">
        <div className="relative flex flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-8 lg:p-12">
          <div
            className="pointer-events-none absolute -left-16 -top-20 size-56 rounded-full bg-desahub-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 right-0 size-48 rounded-full bg-desahub-300/15 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-4xl">
              {banner.title}
            </h1>
            <p className="max-w-md text-xs text-desahub-100 sm:text-sm lg:text-base">
              {banner.subtitle}
            </p>
            <div>
              <Link href="/marketplace-umkm/kategori">
                <MktButton
                  variant="outline"
                  size="md"
                  className="border-white bg-white text-desahub-600 hover:bg-desahub-50"
                >
                  Belanja Sekarang
                </MktButton>
              </Link>
            </div>
          </div>
        </div>

        {banner.gambar ? (
          <div className="relative hidden min-h-[180px] bg-desahub-700 sm:block lg:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.gambar}
              alt={banner.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
