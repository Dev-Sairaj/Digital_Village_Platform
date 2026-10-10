import { authRepository } from "@/api/repositories/authRepository";
import { toServiceError } from "@/api/services/serviceError";
import type { LoginPayload, LoginResult } from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    try {
      return await authRepository.login(payload);
    } catch (error) {
      throw toServiceError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } catch (error) {
      throw toServiceError(error);
    }
  },
};
