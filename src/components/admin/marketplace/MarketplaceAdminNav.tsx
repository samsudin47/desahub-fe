"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { marketplaceAdminNav } from "@/config/marketplace-admin-menu";
import { cn } from "@/lib/cn";

export default function MarketplaceAdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
      {marketplaceAdminNav.map((item) => {
        const isActive =
          item.href === "/kelola-marketplace"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-brand-600 shadow-theme-xs dark:bg-gray-800 dark:text-brand-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
