import type { HierarchyLevel, Role } from "@/types/auth";

export interface NavItem {
  href: string;
  label: string;
  enabled: boolean;
}

export interface PermissionItem {
  label: string;
  scope: string;
}

export const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: "/super-admin",
  OPERATOR: "/operator",
};

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  OPERATOR: "Operator",
};

export const LEVEL_LABEL: Record<HierarchyLevel, string> = {
  STATE: "State",
  DISTRICT: "District",
  TALUKA: "Taluka",
  VILLAGE: "Village",
};

const NAV_ITEMS: Record<Role, readonly NavItem[]> = {
  SUPER_ADMIN: [
    { href: "/super-admin", label: "Overview", enabled: true },
    { href: "/operator", label: "Operator view", enabled: true },
  ],
  OPERATOR: [{ href: "/operator", label: "Overview", enabled: true }],
};

const PERMISSIONS: Record<Role, readonly PermissionItem[]> = {
  SUPER_ADMIN: [
    { label: "Manage hierarchy, users and role assignments", scope: "All levels" },
    { label: "View and manage platform data", scope: "All nodes" },
  ],
  OPERATOR: [
    { label: "Manage day-to-day operations", scope: "Assigned node" },
    { label: "View data", scope: "Assigned node and all nodes below it" },
  ],
};

export function navItemsFor(role: Role): NavItem[] {
  return [...NAV_ITEMS[role]];
}

export function permissionsFor(role: Role): readonly PermissionItem[] {
  return PERMISSIONS[role];
}

export function canAccessPath(role: Role, pathname: string): boolean {
  if (pathname === "/") return true;

  return NAV_ITEMS[role].some(
    ({ href, enabled }) =>
      enabled && (pathname === href || pathname.startsWith(`${href}/`)),
  );
}
