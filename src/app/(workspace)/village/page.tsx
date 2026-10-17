import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { villageService } from "@/api/services/villageService";
import { VillageDashboard } from "@/components/features/village/VillageDashboard";
import { ROLE_HOME } from "@/lib/permissions";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Village dashboard | GramSetu",
};

export default async function VillagePage() {
  const user = await requireRole(["OPERATOR"]);
  if (user.scope.level !== "VILLAGE") redirect(`${ROLE_HOME[user.role]}?denied=1`);

  const overview = await villageService.getOverview(user.scope.id);
  return <VillageDashboard villageName={user.scope.name} overview={overview} />;
}
