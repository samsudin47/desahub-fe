"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AppLogo from "@/components/common/AppLogo";
import UserProfileDropdown from "@/components/auth/UserProfileDropdown";
import { MARKETPLACE_PROFILE_MENU } from "@/config/profile-menu";
import {
  Search,
  ShoppingCart,
  ChevronLeft,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/marketplace-umkm/kategori/makanan", label: "Kategori" },
  { href: "/marketplace-umkm/pesanan", label: "Pesanan Saya" },
  { href: "/marketplace-umkm#tentang", label: "Tentang Desa" },
  { href: "/marketplace-umkm#bantuan", label: "Bantuan" },
];

const pageTitles: Record<string, string> = {
  "/marketplace-umkm/keranjang": "Keranjang",
  "/marketplace-umkm/checkout": "Checkout",
  "/marketplace-umkm/pembayaran": "Pembayaran",
  "/marketplace-umkm/selesai": "Pembayaran Berhasil",
  "/marketplace-umkm/pesanan": "Pesanan Saya",
  "/marketplace-umkm/akun": "Akun Saya",
};

function getMobileTitle(pathname: string): string | null {
  if (pathname === "/marketplace-umkm") return null;
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/marketplace-umkm/kategori")) return "Kategori";
  if (pathname.startsWith("/marketplace-umkm/pesanan/")) return "Detail Pesanan";
  if (pathname.startsWith("/marketplace-umkm/produk/")) return "Detail Produk";
  return null;
}

export default function MarketplaceHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileTitle = getMobileTitle(pathname);
  const isHome = pathname === "/marketplace-umkm";
  const showMobileBack = mobileTitle && !isHome;

  const closeMenu = () => setMobileMenuOpen(false);
  const toggleMenu = () => {
    setSearchOpen(false);
    setMobileMenuOpen((prev) => !prev);
  };
  const toggleSearch = () => {
    setMobileMenuOpen(false);
    setSearchOpen((prev) => !prev);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
          {isHome && (
            <div className="grid grid-cols-3 items-center lg:hidden">
              <button
                type="button"
                className="justify-self-start rounded-lg p-1.5 text-gray-700 hover:bg-gray-100"
                onClick={toggleMenu}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>

              <div className="justify-self-center">
                <AppLogo href="/marketplace-umkm" size="md" />
              </div>

              <div className="flex items-center justify-self-end gap-0.5">
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  onClick={toggleSearch}
                  aria-label="Cari produk"
                >
                  <Search className="size-5" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Notifikasi"
                >
                  <Bell className="size-5" />
                </button>
              </div>
            </div>
          )}

          {!isHome && (
            <div className="flex items-center justify-between gap-2 lg:hidden">
              <div className="flex min-w-0 items-center gap-2">
                {showMobileBack && (
                  <>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="shrink-0 rounded-lg p-1.5 text-gray-700 hover:bg-gray-100"
                      aria-label="Kembali"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <h1 className="truncate text-base font-semibold text-gray-900">
                      {mobileTitle}
                    </h1>
                  </>
                )}
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                onClick={toggleSearch}
                aria-label="Cari produk"
              >
                <Search className="size-5" />
              </button>
            </div>
          )}

          <div className="hidden items-center justify-between gap-3 lg:flex">
            <AppLogo href="/marketplace-umkm" size="sm" className="shrink-0" />

            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition hover:text-desahub-600",
                    pathname.startsWith(link.href.split("#")[0])
                      ? "text-desahub-600"
                      : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Cari produk UMKM..."
                  className="h-10 w-56 rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100 xl:w-72"
                />
              </div>

              <Link
                href="/marketplace-umkm/keranjang"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Keranjang"
              >
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-desahub-500 text-[10px] font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              <UserProfileDropdown
                variant="marketplace"
                menuItems={MARKETPLACE_PROFILE_MENU}
              />
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-100 px-4 py-3 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Cari produk UMKM..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay — tidak mendorong konten ke bawah */}
      {mobileMenuOpen && isHome && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Tutup menu"
          />
          <nav className="absolute left-3 right-3 top-14 max-w-xs">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-lg">
              {[...navLinks, { href: "/marketplace-umkm/akun", label: "Akun Saya" }].map(
                (link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-desahub-50 hover:text-desahub-700 active:bg-desahub-100 ${
                      i > 0 ? "border-t border-gray-100" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
