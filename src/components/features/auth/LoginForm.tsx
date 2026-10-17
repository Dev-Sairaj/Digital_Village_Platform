"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authService } from "@/api/services/authService";
import { ServiceError } from "@/api/services/serviceError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROLE_LABEL } from "@/lib/permissions";
import { getSafeRedirect } from "@/lib/utils";
import type { DemoAccountHint } from "@/types/auth";

interface LoginFormProps {
  next?: string;
  reason?: string;
  demoAccounts: readonly DemoAccountHint[];
}

const REASON_MESSAGE: Record<string, string> = {
  expired: "Your session has ended. Please sign in again.",
  signout: "You have been signed out.",
};

export function LoginForm({ next, reason, demoAccounts }: LoginFormProps) {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const notice = reason ? REASON_MESSAGE[reason] : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: Record<string, string> = {};
    if (!loginId.trim()) errors.loginId = "Enter your login ID.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await authService.login({
        loginId: loginId.trim(),
        password,
      });
      router.replace(getSafeRedirect(next) ?? result.redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof ServiceError) {
        setFieldErrors(error.fieldErrors);
        setFormError(error.code === "VALIDATION" ? null : error.message);
        if (error.code === "INVALID_CREDENTIALS") setPassword("");
        // On network/server errors the form values are kept so the user can simply retry.
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {notice && !formError && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Login ID"
          name="loginId"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          error={fieldErrors.loginId}
          disabled={submitting}
        />
        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          disabled={submitting}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {demoAccounts.length > 0 && (
        <section
          aria-label="Demo accounts"
          className="rounded-lg border border-dashed border-slate-300 p-3"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Demo accounts (click to fill)
          </h2>
          <ul className="space-y-1">
            {demoAccounts.map((account) => (
              <li key={account.loginId}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginId(account.loginId);
                    setPassword(account.password);
                    setFieldErrors({});
                    setFormError(null);
                  }}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-slate-100"
                >
                  <span>
                    <span className="font-medium text-slate-800">
                      {account.loginId}
                    </span>
                    <span className="ml-2 text-slate-500">
                      {account.scopeLabel}
                    </span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {ROLE_LABEL[account.role]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
