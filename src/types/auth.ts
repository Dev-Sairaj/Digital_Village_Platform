export type Role = "SUPER_ADMIN" | "OPERATOR";

export type HierarchyLevel = "STATE" | "DISTRICT" | "TALUKA" | "VILLAGE";

export interface ScopeNode {
  id: string;
  name: string;
  level: HierarchyLevel;
}

export interface SessionUser {
  id: string;
  loginId: string;
  name: string;
  role: Role;
  scope: ScopeNode;
}

export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface LoginResult {
  user: SessionUser;
  redirectTo: string;
}

export interface DemoAccountHint {
  name: string;
  role: Role;
  scopeLabel: string;
  loginId: string;
  password: string;
}
