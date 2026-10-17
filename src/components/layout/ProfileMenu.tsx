"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/api/services/authService";
import { Button } from "@/components/ui/Button";
import { LEVEL_LABEL, ROLE_LABEL } from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

export function ProfileMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
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
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
        <p className="text-xs text-slate-500">
          {ROLE_LABEL[user.role]} · {LEVEL_LABEL[user.scope.level]}:{" "}
          {user.scope.name}
        </p>
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
      <Button variant="secondary" onClick={handleLogout} loading={loading}>
        Sign out
      </Button>
    </div>
  );
}
