import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  sealAdminSession,
} from "@/lib/adminSession";
import { db, schema } from "@/lib/db/client";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const found = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);

  const user = found[0];
  if (!user) {
    // Don't leak whether the email exists; small fixed delay.
    await new Promise((r) => setTimeout(r, 200));
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sealed = await sealAdminSession({ userId: user.id });
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, sealed, ADMIN_COOKIE_OPTIONS);
  return Response.json({ ok: true });
}
