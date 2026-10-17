import { VILLAGE_OVERVIEW_MOCK } from "@/data/villageMock";
import type { NavBadges } from "@/types/ui";
import type { VillageOverview } from "@/types/village";

export const villageRepository = {
  // MOCK: replace with apiClient.get<VillageOverview>(apiUrl.village.overview(villageId)).
  async getOverview(villageId: string): Promise<VillageOverview> {
    return { ...VILLAGE_OVERVIEW_MOCK, villageId };
  },

  // MOCK: replace with a lightweight counts endpoint.
  async getNavBadges(villageId: string): Promise<NavBadges> {
    const overview = await villageRepository.getOverview(villageId);
    return {
      grievances: overview.kpis.find((kpi) => kpi.id === "grievances")?.value ?? 0,
      alerts: overview.alerts.length,
    };
  },
};
