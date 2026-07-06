import type { LucideIcon } from "lucide-react";
import { CircleHelp, Package, Settings, User } from "lucide-react";

export type ProfileMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_PROFILE_MENU: ProfileMenuItem[] = [
  { label: "Edit profile", href: "/profile", icon: User },
  { label: "Account settings", href: "/profile", icon: Settings },
  { label: "Support", href: "/profile", icon: CircleHelp },
];

export const MARKETPLACE_PROFILE_MENU: ProfileMenuItem[] = [
  { label: "Akun Saya", href: "/marketplace-umkm/akun", icon: User },
  { label: "Pesanan Saya", href: "/marketplace-umkm/pesanan", icon: Package },
  { label: "Bantuan", href: "/marketplace-umkm#bantuan", icon: CircleHelp },
];
