export function formatDisplayName(username: string): string {
  if (!username) return "Pengguna";
  return username.charAt(0).toUpperCase() + username.slice(1);
}

export function getUserInitials(username: string): string {
  if (!username) return "U";
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}
