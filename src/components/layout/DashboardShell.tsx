"use client";

import { MotionConfig } from "motion/react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { ShellContext } from "@/components/layout/ShellContext";
import { ToastProvider } from "@/components/ui/Toast";
import type { WorkspaceNavItem } from "@/lib/workspaceNav";
import type { SessionUser } from "@/types/auth";
import type { NavBadges } from "@/types/ui";

interface DashboardShellProps {
  user: SessionUser;
  items: readonly WorkspaceNavItem[];
  badges: NavBadges;
  children: ReactNode;
}

// Shared by every workspace dashboard. Navigation arrives as typed config, already filtered by role and scope.
export function DashboardShell({ user, items, badges, children }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const context = useMemo(() => ({ openDrawer }), [openDrawer]);

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <ShellContext.Provider value={context}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-control focus:bg-white focus:px-3 focus:py-2 focus:text-n8"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen bg-s1 text-s6">
            <aside
              aria-label="Sidebar"
              className="sticky top-0 hidden h-screen w-[236px] shrink-0 bg-linear-to-b from-n8 to-n9 min-[900px]:block"
            >
              <DashboardSidebar items={items} badges={badges} user={user} variant="desktop" />
            </aside>
            <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
              <DashboardSidebar
                items={items}
                badges={badges}
                user={user}
                variant="drawer"
                onNavigate={closeDrawer}
              />
            </MobileDrawer>
            <main id="main-content" className="min-w-0 flex-1">
              {children}
            </main>
          </div>
        </ShellContext.Provider>
      </ToastProvider>
    </MotionConfig>
  );
}
