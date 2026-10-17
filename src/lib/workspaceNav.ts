import { canAccessPath } from "@/lib/permissions";
import type { HierarchyLevel, Role, SessionUser } from "@/types/auth";
import type { IconName, NavBadgeKey } from "@/types/ui";

export interface WorkspaceNavItem {
  id: string;
  href: string;
  label: string;
  icon: IconName;
  enabled: boolean;
  badgeKey?: NavBadgeKey;
}

interface NavDefinition extends Omit<WorkspaceNavItem, "enabled"> {
  roles: readonly Role[];
  levels?: readonly HierarchyLevel[];
  // false until the page exists; the item renders as "Soon" instead of a dead link.
  built: boolean;
}

// Fixed order from the design: Home, Revenue, Services, Assets, Grievances, Alerts, Reports, AI insights, Appointments.
const VILLAGE_NAV: readonly NavDefinition[] = [
  { id: "home", href: "/village", label: "Home", icon: "home", roles: ["OPERATOR"], levels: ["VILLAGE"], built: true },
  { id: "revenue", href: "/village/revenue", label: "Revenue", icon: "revenue", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
  { id: "services", href: "/village/services", label: "Services", icon: "services", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
  { id: "assets", href: "/village/assets", label: "Assets", icon: "assets", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
  { id: "grievances", href: "/village/grievances", label: "Grievances", icon: "grievances", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false, badgeKey: "grievances" },
  { id: "alerts", href: "/village/alerts", label: "Alerts", icon: "alerts", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false, badgeKey: "alerts" },
  { id: "reports", href: "/village/reports", label: "Reports", icon: "reports", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
  { id: "ai", href: "/village/ai-insights", label: "AI insights", icon: "ai", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
  { id: "appointments", href: "/village/appointments", label: "Appointments", icon: "appointments", roles: ["OPERATOR"], levels: ["VILLAGE"], built: false },
];

// Super admin navigation will be added here by the super admin dashboard task.
const DEFINITIONS: readonly NavDefinition[] = [...VILLAGE_NAV];

// Filters by the real auth model (role, hierarchy level) and by canAccessPath, never by JSX checks.
export function workspaceNavFor(user: SessionUser): WorkspaceNavItem[] {
  return DEFINITIONS.filter(
    (def) => def.roles.includes(user.role) && (def.levels?.includes(user.scope.level) ?? true),
  ).map((def) => ({
    id: def.id,
    href: def.href,
    label: def.label,
    icon: def.icon,
    badgeKey: def.badgeKey,
    enabled: def.built && canAccessPath(user.role, def.href),
  }));
}
