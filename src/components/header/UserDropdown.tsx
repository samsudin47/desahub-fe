"use client";

import UserProfileDropdown from "@/components/auth/UserProfileDropdown";
import { ADMIN_PROFILE_MENU } from "@/config/profile-menu";

export default function UserDropdown() {
  return (
    <UserProfileDropdown variant="admin" menuItems={ADMIN_PROFILE_MENU} />
  );
}
