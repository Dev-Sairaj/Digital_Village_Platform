import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { homeFor } from "@/lib/permissions";
import { getSession } from "@/lib/session";
import { DEMO_ACCOUNT_HINTS } from "@/data/demoUsers";

export const metadata: Metadata = {
  title: "Sign in | GramSetu",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) redirect(homeFor(session));

  const { next, reason } = await searchParams;
  const demoAccounts =
    process.env.DEMO_MODE === "true" ? DEMO_ACCOUNT_HINTS : [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            GramSetu
          </p>
          <h1 className="text-2xl font-bold text-text">Sign in</h1>
          <p className="text-sm text-text-muted">
            Use your assigned login ID to access your dashboard.
          </p>
        </header>
        <LoginForm next={next} reason={reason} demoAccounts={demoAccounts} />
      </div>
    </main>
  );
}
