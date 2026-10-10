import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { ROLE_HOME } from "@/lib/permissions";
import { getSession } from "@/lib/session";
import { DEMO_ACCOUNT_HINTS } from "@/data/demoUsers";

export const metadata: Metadata = {
  title: "Sign in | Digital Village Platform",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) redirect(ROLE_HOME[session.role]);

  const { next, reason } = await searchParams;
  const demoAccounts =
    process.env.DEMO_MODE === "true" ? DEMO_ACCOUNT_HINTS : [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Smart Digital Village
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-600">
            Use your assigned login ID to access your dashboard.
          </p>
        </header>
        <LoginForm next={next} reason={reason} demoAccounts={demoAccounts} />
      </div>
    </main>
  );
}
