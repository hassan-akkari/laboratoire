import "server-only";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Iron-session admin auth for booking-service. Cloned from web-next's proven
// pattern (apps/web-next/lib/adminSession.ts): a single sealed, httpOnly cookie
// carrying only the user id. The secret comes from ADMIN_SESSION_SECRET and is
// NEVER hardcoded, logged, or sent to the client.
//
// `server-only` guards against this module (which reads the secret + cookies)
// ever being pulled into a client bundle. Client components import only the
// pure types / the server-action functions, never this file's internals.

export const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type AdminSessionData = {
  userId: string;
};

/**
 * The iron-session password (HMAC/encryption key). Read lazily inside the
 * seal/unseal helpers — NEVER at module load — so importing this module during
 * `next build` (which has no env) cannot crash the build. Throws only when an
 * auth operation is actually attempted without a valid secret.
 */
function getPassword(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 chars");
  }
  return secret;
}

export async function sealAdminSession(data: AdminSessionData): Promise<string> {
  return sealData(data, { password: getPassword(), ttl: ADMIN_TTL_SECONDS });
}

export async function unsealAdminSession(
  raw: string | null | undefined,
): Promise<AdminSessionData | null> {
  if (!raw) return null;
  try {
    const data = await unsealData<AdminSessionData>(raw, {
      password: getPassword(),
      ttl: ADMIN_TTL_SECONDS,
    });
    if (!data?.userId) return null;
    return data;
  } catch {
    // Tampered / expired / wrong-secret seals fail closed (treated as signed out).
    return null;
  }
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/" as const,
  maxAge: ADMIN_TTL_SECONDS,
};

/** For Route Handlers / Server Actions: returns null when not signed in. */
export async function getAdminSession(): Promise<AdminSessionData | null> {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE_NAME)?.value ?? null;
  return unsealAdminSession(raw);
}

/** For Server Component pages/layouts: redirects to /admin/login when not signed in. */
export async function requireAdminSession(): Promise<AdminSessionData> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
