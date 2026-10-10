import axios, { type AxiosInstance } from "axios";

function createClient(baseURL: string | undefined): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  const org = process.env.NEXT_PUBLIC_APP_ORG_HEADER;
  if (org) {
    instance.interceptors.request.use((config) => {
      config.headers.set("X-Org", org);
      return config;
    });
  }
  return instance;
}

// Real backend API (NEXT_PUBLIC_API_BASE_URL). Auth cookie is httpOnly and sent automatically.
export const apiClient = createClient(process.env.NEXT_PUBLIC_API_BASE_URL);

// Same-origin Next.js Route Handlers (session cookie endpoints).
export const localClient = createClient(undefined);

// 401 from the backend: clear the session and send the user to /login.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      typeof window !== "undefined" &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      await fetch("/api/auth/logout", { method: "POST" }).catch(
        () => undefined,
      );
      window.location.assign(
        `${window.location.origin}/login?reason=expired`,
      );
    }
    return Promise.reject(error);
  },
);
