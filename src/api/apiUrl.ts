export const apiUrl = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  village: {
    overview: (villageId: string) => `/villages/${villageId}/overview`,
  },
} as const;
