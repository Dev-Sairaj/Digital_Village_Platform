"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { authService } from "@/api/services/authService";

export function useSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      router.replace("/login?reason=signout");
      router.refresh();
    } catch {
      setError("Sign out failed. Retry.");
      setLoading(false);
    }
  }, [router]);

  return { signOut, loading, error };
}
