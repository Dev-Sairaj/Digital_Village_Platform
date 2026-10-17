import Link from "next/link";
import {
  PermissionSummary,
  ScopeCard,
} from "@/components/features/dashboard/DashboardWidgets";
import type { SessionUser } from "@/types/auth";

export function SuperAdminDashboard({ user }: { user: SessionUser }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-text">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-text-muted">
          Welcome, {user.name}. You manage the entire platform: all hierarchy
          levels, users and role assignments.
        </p>
      </header>
      <ScopeCard user={user} />
      <PermissionSummary user={user} />
      <Link
        href="/operator"
        className="inline-block rounded-lg border border-border-strong bg-card px-4 py-2 text-sm font-semibold text-text-strong hover:bg-page"
      >
        Open Operator dashboard
      </Link>
    </div>
  );
}
