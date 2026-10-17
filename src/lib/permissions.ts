import type { HierarchyLevel, Role, SessionUser } from "@/types/auth";

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

export function homeFor(user: SessionUser): string {
  if (user.role === "OPERATOR" && user.scope.level === "VILLAGE") {
    return "/village";
  }
  return ROLE_HOME[user.role];
}

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

// Routes a role may open that are not part of the legacy sidebar above
// (the workspace shell has its own navigation, see lib/workspaceNav.ts).
const EXTRA_PATHS: Record<Role, readonly string[]> = {
  SUPER_ADMIN: [],
  OPERATOR: ["/village"],
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

function matches(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function canAccessPath(role: Role, pathname: string): boolean {
  if (pathname === "/") return true;

  return (
    NAV_ITEMS[role].some(({ href, enabled }) => enabled && matches(pathname, href)) ||
    EXTRA_PATHS[role].some((href) => matches(pathname, href))
  );
}
