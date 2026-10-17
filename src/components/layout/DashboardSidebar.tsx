"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { WheelMark } from "@/components/ui/WheelMark";
import { useSignOut } from "@/hooks/useSignOut";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { LEVEL_LABEL, ROLE_LABEL } from "@/lib/permissions";
import type { WorkspaceNavItem } from "@/lib/workspaceNav";
import type { SessionUser } from "@/types/auth";
import type { NavBadges } from "@/types/ui";

interface DashboardSidebarProps {
  items: readonly WorkspaceNavItem[];
  badges: NavBadges;
  user: SessionUser;
  variant: "desktop" | "drawer";
  onNavigate?: () => void;
}

const SLIDE = { duration: DURATION.interaction + 0.07, ease: EASE_OUT };

export function DashboardSidebar({ items, badges, user, variant, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { signOut, loading, error } = useSignOut();

  return (
    <LayoutGroup id={variant}>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-5 pb-5 pt-6 text-white">
          <WheelMark />
          <div>
            <p className="font-serif text-[20px] font-bold leading-none">GramSetu</p>
            <p className="mt-1 text-[12.5px] text-n4">Digital village platform</p>
          </div>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const badge = item.badgeKey ? (badges[item.badgeKey] ?? 0) : 0;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const content = (
                <>
                  {item.enabled && active && (
                    <>
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-control bg-white/10"
                        transition={SLIDE}
                      />
                      <motion.span
                        layoutId="nav-bar"
                        className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-o"
                        transition={SLIDE}
                      />
                    </>
                  )}
                  <Icon name={item.icon} size={18} className="relative" />
                  <span className="relative">{item.label}</span>
                  {badge > 0 ? (
                    <span className="relative ml-auto rounded-full bg-o px-2 py-0.5 text-[11.5px] font-bold text-n9">
                      {badge}
                    </span>
                  ) : (
                    !item.enabled && (
                      <span className="relative ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11.5px] font-semibold text-n3">
                        Soon
                      </span>
                    )
                  )}
                </>
              );

              return (
                <li key={item.id}>
                  {item.enabled ? (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 rounded-control px-3 py-2.5 text-[14px] font-semibold transition-colors duration-150 ${
                        active ? "text-white" : "text-n3 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="relative flex items-center gap-3 rounded-control px-3 py-2.5 text-[14px] font-semibold text-n4/70"
                    >
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 px-2 pb-3">
            <Avatar name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-white">{user.name}</p>
              <p className="truncate text-[12.5px] text-n4">
                {ROLE_LABEL[user.role]}, {LEVEL_LABEL[user.scope.level]}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-[14px] font-semibold text-n3 transition-colors duration-150 hover:bg-white/5 hover:text-white disabled:opacity-60"
          >
            <Icon name="signOut" size={18} />
            {loading ? "Signing out..." : "Sign out"}
          </button>
          {error && (
            <p role="alert" className="px-3 pt-1 text-[12.5px] text-o0">
              {error}
            </p>
          )}
        </div>
      </div>
    </LayoutGroup>
  );
}
