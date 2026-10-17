import type { ReactNode } from "react";
import { villageService } from "@/api/services/villageService";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireSession } from "@/lib/session";
import { workspaceNavFor } from "@/lib/workspaceNav";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const user = await requireSession();
  const items = workspaceNavFor(user);
  const badges = await villageService.getNavBadges(user.scope.id);

  return (
    <DashboardShell user={user} items={items} badges={badges}>
      {children}
    </DashboardShell>
  );
}
