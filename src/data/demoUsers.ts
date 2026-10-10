import type { DemoAccountHint, SessionUser } from "@/types/auth";

interface DemoUserRecord extends SessionUser {
  password: string;
}

export const DEMO_USERS: readonly DemoUserRecord[] = [
  {
    id: "usr-sa-001",
    loginId: "superadmin",
    password: "Admin@123",
    name: "Asha Deshmukh",
    role: "SUPER_ADMIN",
    scope: { id: "node-state-mh", name: "Maharashtra", level: "STATE" },
  },
  {
    id: "usr-op-002",
    loginId: "district.op",
    password: "District@123",
    name: "Rahul Patil",
    role: "OPERATOR",
    scope: { id: "node-dist-pune", name: "Pune", level: "DISTRICT" },
  },
  {
    id: "usr-op-003",
    loginId: "taluka.op",
    password: "Taluka@123",
    name: "Sneha Kulkarni",
    role: "OPERATOR",
    scope: { id: "node-talk-haveli", name: "Haveli", level: "TALUKA" },
  },
  {
    id: "usr-op-004",
    loginId: "village.op",
    password: "Village@123",
    name: "Vikas Jadhav",
    role: "OPERATOR",
    scope: { id: "node-vill-loni", name: "Loni Kalbhor", level: "VILLAGE" },
  },
];

export function toSessionUser(record: DemoUserRecord): SessionUser {
  return {
    id: record.id,
    loginId: record.loginId,
    name: record.name,
    role: record.role,
    scope: record.scope,
  };
}

const LEVEL_TEXT = {
  STATE: "State",
  DISTRICT: "District",
  TALUKA: "Taluka",
  VILLAGE: "Village",
} as const;

export const DEMO_ACCOUNT_HINTS: readonly DemoAccountHint[] = DEMO_USERS.map(
  (u) => ({
    name: u.name,
    role: u.role,
    scopeLabel: `${LEVEL_TEXT[u.scope.level]}: ${u.scope.name}`,
    loginId: u.loginId,
    password: u.password,
  }),
);
