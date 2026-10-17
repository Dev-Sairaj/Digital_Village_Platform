import { villageRepository } from "@/api/repositories/villageRepository";
import { toServiceError } from "@/api/services/serviceError";
import type { NavBadges } from "@/types/ui";
import type { VillageOverview } from "@/types/village";

export const villageService = {
  async getOverview(villageId: string): Promise<VillageOverview> {
    try {
      return await villageRepository.getOverview(villageId);
    } catch (error) {
      throw toServiceError(error);
    }
  },

  async getNavBadges(villageId: string): Promise<NavBadges> {
    try {
      return await villageRepository.getNavBadges(villageId);
    } catch (error) {
      throw toServiceError(error);
    }
  },
};
