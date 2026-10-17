import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { villageService } from "@/api/services/villageService";
import { VillageDashboard } from "@/components/features/village/VillageDashboard";
import { homeFor } from "@/lib/permissions";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Village dashboard | GramSetu",
};

interface VillagePageProps {
  searchParams: Promise<{ denied?: string }>;
}

export default async function VillagePage({ searchParams }: VillagePageProps) {
  const user = await requireRole(["OPERATOR"]);
  if (user.scope.level !== "VILLAGE") redirect(`${homeFor(user)}?denied=1`);

  const { denied } = await searchParams;
  const overview = await villageService.getOverview(user.scope.id);
  return (
    <VillageDashboard
      villageName={user.scope.name}
      overview={overview}
      denied={denied === "1"}
    />
  );
}
