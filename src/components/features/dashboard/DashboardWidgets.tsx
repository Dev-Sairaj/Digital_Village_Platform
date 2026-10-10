import { LEVEL_LABEL, ROLE_LABEL, permissionsFor } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

export function ScopeCard({ user }: { user: SessionUser }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-500">Your access</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Role</dt>
          <dd className="text-sm font-semibold text-slate-900">
            {ROLE_LABEL[user.role]}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Assigned node</dt>
          <dd className="text-sm font-semibold text-slate-900">
            {LEVEL_LABEL[user.scope.level]}: {user.scope.name}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Visibility</dt>
          <dd className="text-sm font-semibold text-slate-900">
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
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-500">What you can do</h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="text-slate-800">{item.label}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {item.scope}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
