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
        <h1 className="text-2xl font-bold text-slate-900">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Welcome, {user.name}. You manage the entire platform: all hierarchy
          levels, users and role assignments.
        </p>
      </header>
      <ScopeCard user={user} />
      <PermissionSummary user={user} />
      <Link
        href="/operator"
        className="inline-block rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        Open Operator dashboard
      </Link>
    </div>
  );
}
