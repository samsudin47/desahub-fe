import AccountProfileCard from "@/components/auth/AccountProfileCard";
import LogoutButton from "@/components/auth/LogoutButton";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Package,
  Heart,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Akun | Marketplace UMKM | DesaHub",
};

const menuItems = [
  {
    href: "/marketplace-umkm/pesanan",
    label: "Pesanan Saya",
    icon: Package,
  },
  { href: "#", label: "Alamat Saya", icon: MapPin },
  { href: "#", label: "Favorit", icon: Heart },
  { href: "/marketplace-umkm#bantuan", label: "Bantuan", icon: HelpCircle },
];

export default function AkunPage() {
  return (
    <div className="space-y-6">
      <AccountProfileCard />

      <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {menuItems.map(({ href, label, icon: Icon }, i) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-desahub-50 ${
              i > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <Icon className="size-5 text-desahub-500" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="size-4 text-gray-300" />
          </Link>
        ))}
      </nav>

      <LogoutButton />
    </div>
  );
}
