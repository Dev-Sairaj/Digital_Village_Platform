import { localClient } from "@/api/apiClient";
import { apiUrl } from "@/api/apiUrl";
import type { LoginPayload, LoginResult } from "@/types/auth";

export const authRepository = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    const response = await localClient.post<LoginResult>(
      apiUrl.auth.login,
      payload,
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await localClient.post(apiUrl.auth.logout);
  },
};
