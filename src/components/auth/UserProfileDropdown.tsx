"use client";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import type { ProfileMenuItem } from "@/config/profile-menu";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/cn";
import { formatDisplayName, getUserInitials } from "@/lib/user-display";
import { logout } from "@/services/auth.service";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserProfileDropdownProps = {
  menuItems: ProfileMenuItem[];
  variant?: "admin" | "marketplace";
  avatarUrl?: string;
  className?: string;
};

const itemClassName =
  "flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300";

const iconClassName =
  "size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300";

export default function UserProfileDropdown({
  menuItems,
  variant = "admin",
  avatarUrl = "/images/user/owner.jpg",
  className,
}: UserProfileDropdownProps) {
  const router = useRouter();
  const { user, isReady } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    closeDropdown();
    setIsLoggingOut(true);

    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isReady) {
    return (
      <div
        className={cn(
          "h-11 animate-pulse rounded-lg bg-gray-100",
          variant === "marketplace" && "h-10 w-28",
          variant === "admin" && "w-40",
          className,
        )}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium text-desahub-600 hover:bg-desahub-50",
          className,
        )}
      >
        Masuk
      </Link>
    );
  }

  const displayName = formatDisplayName(user.username);
  const initials = getUserInitials(user.username);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "dropdown-toggle flex items-center text-gray-700 dark:text-gray-400",
          variant === "marketplace" &&
            "h-10 gap-1.5 rounded-lg px-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
        )}
      >
        {variant === "admin" ? (
          <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
            {avatarUrl ? (
              <Image width={44} height={44} src={avatarUrl} alt={displayName} />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-desahub-100 text-sm font-semibold text-desahub-700">
                {initials}
              </span>
            )}
          </span>
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-desahub-100 text-[11px] font-semibold text-desahub-700">
            {initials}
          </span>
        )}

        <span
          className={cn(
            "font-medium text-theme-sm",
            variant === "admin" ? "mr-1 block" : "hidden md:inline",
          )}
        >
          {displayName}
        </span>

        <ChevronDown
          className={cn(
            "text-gray-400 transition-transform duration-200",
            variant === "admin" ? "size-[18px]" : "size-4",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {displayName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 py-3 dark:border-gray-800">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href={item.href}
                  className={itemClassName}
                >
                  <Icon className={iconClassName} />
                  {item.label}
                </DropdownItem>
              </li>
            );
          })}
        </ul>

        <DropdownItem
          onItemClick={handleLogout}
          tag="button"
          className={cn(itemClassName, "mt-3 w-full", isLoggingOut && "opacity-60")}
        >
          <LogOut className={iconClassName} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
