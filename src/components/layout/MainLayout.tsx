import type { ReactNode } from "react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { navItemsFor } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

export function MainLayout({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar items={navItemsFor(user.role)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-slate-200 bg-white px-6 py-3">
          <ProfileMenu user={user} />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
