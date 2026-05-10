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
  email: z.string().email(),
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

  // === DEV-ONLY ESCAPE HATCH ===
  // When DEV_NO_DB=1 and not in production, validate against ADMIN_EMAIL +
  // ADMIN_PASSWORD env vars directly (no bcrypt, no DB). Used to exercise
  // the auth wiring before Neon is provisioned. Remove this branch once
  // DATABASE_URL is set everywhere.
  if (
    process.env.DEV_NO_DB === "1" &&
    process.env.NODE_ENV !== "production"
  ) {
    const expectedEmail = process.env.ADMIN_EMAIL;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedEmail || !expectedPassword) {
      return Response.json(
        { error: "DEV_NO_DB requires ADMIN_EMAIL and ADMIN_PASSWORD in .env.local" },
        { status: 500 },
      );
    }
    if (
      parsed.data.email !== expectedEmail ||
      parsed.data.password !== expectedPassword
    ) {
      await new Promise((r) => setTimeout(r, 200));
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const sealed = await sealAdminSession({ userId: "dev-mock-user-id" });
    const store = await cookies();
    store.set(ADMIN_COOKIE_NAME, sealed, ADMIN_COOKIE_OPTIONS);
    return Response.json({ ok: true, mode: "dev-no-db" });
  }
  // === END DEV-ONLY ===

  const found = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);

  const user = found[0];
  if (!user) {
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
