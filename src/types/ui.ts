export type IconName =
  | "home"
  | "revenue"
  | "services"
  | "assets"
  | "grievances"
  | "alerts"
  | "reports"
  | "ai"
  | "appointments"
  | "menu"
  | "close"
  | "arrowUp"
  | "signOut"
  | "receipt"
  | "download"
  | "clock";

export type NavBadgeKey = "grievances" | "alerts";

export type NavBadges = Partial<Record<NavBadgeKey, number>>;
