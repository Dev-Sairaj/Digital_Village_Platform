"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/permissions";

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          GramSetu
        </p>
        <p className="text-sm font-semibold text-text">
          Digital Village Management
        </p>
      </div>
      <nav aria-label="Main" className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (!item.enabled) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-text-placeholder"
              >
                {item.label}
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium uppercase">
                  Soon
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary-subtle text-primary-strong"
                  : "text-text-secondary hover:bg-surface-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
