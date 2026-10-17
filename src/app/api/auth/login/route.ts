import { NextResponse } from "next/server";
import { ROLE_HOME } from "@/lib/permissions";
import { createSession } from "@/lib/session";
import { DEMO_USERS, toSessionUser } from "@/data/demoUsers";
import type { LoginResult } from "@/types/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// In-memory limiter: fine for a demo. Use the backend / a shared store in production.
const attempts = new Map<string, { count: number; resetAt: number }>();

function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const loginId =
    typeof record.loginId === "string" ? record.loginId.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";

  const fieldErrors: Record<string, string> = {};
  if (!loginId) fieldErrors.loginId = "Enter your login ID.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${loginId.toLowerCase()}`;
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { message: "Too many failed attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const user = DEMO_USERS.find(
    (candidate) => candidate.loginId.toLowerCase() === loginId.toLowerCase(),
  );
  const passwordOk = safeEqual(
    password,
    user?.password ?? "invalid-placeholder",
  );

  if (!user || !passwordOk) {
    const current =
      entry && entry.resetAt > now
        ? entry
        : { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
    return NextResponse.json(
      { message: "Invalid login ID or password." },
      { status: 401 },
    );
  }

  attempts.delete(key);
  const sessionUser = toSessionUser(user);
  await createSession(sessionUser);

  const result: LoginResult = {
    user: sessionUser,
    redirectTo: ROLE_HOME[sessionUser.role],
  };
  return NextResponse.json(result);
}
