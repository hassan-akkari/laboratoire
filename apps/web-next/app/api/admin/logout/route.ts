import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
} from "@/lib/adminSession";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return Response.json({ ok: true });
}
