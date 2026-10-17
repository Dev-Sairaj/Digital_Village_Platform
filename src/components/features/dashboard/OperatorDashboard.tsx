import {
  PermissionSummary,
  ScopeCard,
} from "@/components/features/dashboard/DashboardWidgets";
import type { SessionUser } from "@/types/auth";

interface OperatorDashboardProps {
  user: SessionUser;
  denied: boolean;
}

export function OperatorDashboard({ user, denied }: OperatorDashboardProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {denied && (
        <p
          role="alert"
          className="rounded-lg border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning-strong"
        >
          You do not have permission for this action.
        </p>
      )}
      <header>
        <h1 className="text-2xl font-bold text-text">
          Operator Dashboard
        </h1>
        <p className="text-sm text-text-muted">
          Welcome, {user.name}. You manage day-to-day operations within your
          assigned area.
        </p>
      </header>
      <ScopeCard user={user} />
      <PermissionSummary user={user} />
    </div>
  );
}
