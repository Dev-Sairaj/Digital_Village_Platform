import { LEVEL_LABEL, ROLE_LABEL, permissionsFor } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

export function ScopeCard({ user }: { user: SessionUser }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-text-subtle">Your access</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-text-subtle">Role</dt>
          <dd className="text-sm font-semibold text-text">
            {ROLE_LABEL[user.role]}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-text-subtle">Assigned node</dt>
          <dd className="text-sm font-semibold text-text">
            {LEVEL_LABEL[user.scope.level]}: {user.scope.name}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-text-subtle">Visibility</dt>
          <dd className="text-sm font-semibold text-text">
            This node and all nodes below it
          </dd>
        </div>
      </dl>
    </section>
  );
}

export function PermissionSummary({ user }: { user: SessionUser }) {
  const items = permissionsFor(user.role);
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-text-subtle">What you can do</h2>
      <ul className="mt-3 divide-y divide-border-subtle">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="text-text-strong">{item.label}</span>
            <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-medium text-primary-strong">
              {item.scope}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
