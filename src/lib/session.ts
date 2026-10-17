import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { homeFor } from "@/lib/permissions";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signToken,
  verifyToken,
} from "@/lib/token";
import type { Role, SessionUser } from "@/types/auth";

export async function createSession(user: SessionUser): Promise<void> {
  const token = await signToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login?reason=expired");
  return session;
}

// Defense in depth: proxy.ts already checks, but layouts don't re-run on client navigation.
export async function requireRole(
  allowed: readonly Role[],
): Promise<SessionUser> {
  const session = await requireSession();
  if (!allowed.includes(session.role))
    redirect(`${homeFor(session)}?denied=1`);
  return session;
}
