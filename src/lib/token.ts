import type { HierarchyLevel, Role, SessionUser } from "@/types/auth";

export const SESSION_COOKIE = "dvp_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const ROLES: readonly Role[] = ["SUPER_ADMIN", "OPERATOR"];
const LEVELS: readonly HierarchyLevel[] = [
  "STATE",
  "DISTRICT",
  "TALUKA",
  "VILLAGE",
];
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type TokenPayload = SessionUser & { exp: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET must be set (32+ characters) in production.",
    );
  }
  return "dev-only-insecure-secret-change-me-0000";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 =
    value.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function isTokenPayload(value: unknown): value is TokenPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const scope = v.scope as Record<string, unknown> | undefined;
  return (
    typeof v.id === "string" &&
    typeof v.loginId === "string" &&
    typeof v.name === "string" &&
    typeof v.exp === "number" &&
    ROLES.includes(v.role as Role) &&
    typeof scope === "object" &&
    scope !== null &&
    typeof scope.id === "string" &&
    typeof scope.name === "string" &&
    LEVELS.includes(scope.level as HierarchyLevel)
  );
}

export async function signToken(user: SessionUser): Promise<string> {
  const payload: TokenPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    encoder.encode(body),
  );
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const [body, signature, extra] = token.split(".");
    if (!body || !signature || extra !== undefined) return null;

    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      fromBase64Url(signature),
      encoder.encode(body),
    );
    if (!valid) return null;

    const payload: unknown = JSON.parse(decoder.decode(fromBase64Url(body)));
    if (!isTokenPayload(payload)) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return {
      id: payload.id,
      loginId: payload.loginId,
      name: payload.name,
      role: payload.role,
      scope: payload.scope,
    };
  } catch {
    return null;
  }
}
