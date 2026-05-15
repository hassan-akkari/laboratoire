import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminSession";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  // Idempotent: always clear the cookie. Stale/tampered cookies that cannot
  // be unsealed must still be evictable by clicking "Sign out" — otherwise
  // users get stuck with a zombie cookie that the proxy presence-check
  // forwards but requireAdminSession() rejects.
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return Response.json({ ok: true });
}
