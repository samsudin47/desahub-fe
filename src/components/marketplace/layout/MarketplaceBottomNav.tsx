"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Package, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/marketplace-umkm", label: "Beranda", icon: Home, exact: true },
  {
    href: "/marketplace-umkm/kategori/makanan",
    label: "Kategori",
    icon: LayoutGrid,
    match: "/marketplace-umkm/kategori",
  },
  {
    href: "/marketplace-umkm/keranjang",
    label: "Keranjang",
    icon: ShoppingCart,
    match: "/marketplace-umkm/keranjang",
  },
  {
    href: "/marketplace-umkm/pesanan",
    label: "Pesanan",
    icon: Package,
    match: "/marketplace-umkm/pesanan",
  },
  {
    href: "/marketplace-umkm/akun",
    label: "Akun",
    icon: User,
    match: "/marketplace-umkm/akun",
  },
];

const hiddenOnPaths = [
  "/marketplace-umkm/checkout",
  "/marketplace-umkm/pembayaran",
  "/marketplace-umkm/selesai",
];

function isActive(
  pathname: string,
  href: string,
  exact?: boolean,
  match?: string
) {
  if (exact) return pathname === href;
  if (match) return pathname.startsWith(match);
  return pathname.startsWith(href);
}

export default function MarketplaceBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const hidden =
    hiddenOnPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/marketplace-umkm/produk/");

  if (hidden) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {navItems.map(({ href, label, icon: Icon, exact, match }) => {
          const active = isActive(pathname, href, exact, match);
          const isCart = label === "Keranjang";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
                active ? "text-desahub-500" : "text-gray-400"
              )}
            >
              <Icon
                className={cn("size-5", active && "stroke-[2.5]")}
                strokeWidth={active ? 2.5 : 2}
              />
              {isCart && itemCount > 0 && (
                <span className="absolute right-[calc(50%-18px)] top-1 flex size-4 items-center justify-center rounded-full bg-desahub-500 text-[9px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
