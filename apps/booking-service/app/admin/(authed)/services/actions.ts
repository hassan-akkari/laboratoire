"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminSession";
import { db, dbReady, schema } from "@/lib/db/client";
import { getServiceBySlugAny } from "@/features/services/queries";
import { serviceSchema, type ServiceInput } from "@/lib/serviceSchemas";

// Authed admin server actions for the SERVICES catalogue (Phase 5). Siblings of
// the bookings `updateBookingStatus` action: each one re-checks the session
// server-side (defence in depth — the client is NEVER trusted and middleware is
// only the first gate), validates input with zod BEFORE any DB write, guards on
// `dbReady`, mutates through Drizzle TABLE OBJECTS only (no raw SQL / no string
// interpolation), and never leaks a raw DB error to the client.
//
// NOTE: a "use server" module may export ONLY async functions, so the shared
// zod schema + inferred type live in the pure `@/lib/serviceSchemas` module
// (imported by both this file and the client form). This file just consumes it.

const idSchema = z.string().uuid();

export type ServiceActionResult = { ok: true } | { ok: false; error: string };

/** Postgres unique_violation. Used as a backstop when a concurrent insert wins
 *  the race after our pre-check — we map it to the same friendly slug error. */
function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const code = (err as { code?: unknown }).code;
  // node-postgres / Neon surface the SQLSTATE on `.code`; "23505" = unique.
  if (code === "23505") return true;
  const message = (err as { message?: unknown }).message;
  return typeof message === "string" && message.includes("23505");
}

// ── Create ──────────────────────────────────────────────────────────────────
export async function createService(
  input: ServiceInput,
): Promise<ServiceActionResult> {
  // 1) AuthN — reject anyone without a valid sealed session.
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Not authorized" };

  // 2) Validate + normalise server-side (the client cannot smuggle a bad value).
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service details.",
    };
  }
  const data = parsed.data;

  // 3) DB guard.
  if (!dbReady) return { ok: false, error: "Database not configured" };

  // 4) Slug uniqueness pre-check (slug is UNIQUE in the DB). A duplicate must
  //    NOT 500 — return a friendly error instead.
  const existing = await getServiceBySlugAny(data.slug);
  if (existing) return { ok: false, error: "That slug is already in use." };

  try {
    // 5) Drizzle objects only — parameterised, no interpolation.
    await db.insert(schema.services).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category,
      durationMin: data.durationMin,
      priceFromCents: data.priceFromCents,
      priceToCents: data.priceToCents,
      imageUrl: data.imageUrl,
      images: data.images,
      active: data.active,
      sortOrder: data.sortOrder,
    });
  } catch (err) {
    // Backstop for a slug race that beat the pre-check.
    if (isUniqueViolation(err)) {
      return { ok: false, error: "That slug is already in use." };
    }
    console.error("[booking-service] createService failed:", err);
    return { ok: false, error: "Could not create the service. Please try again." };
  }

  // 6) Refresh the admin list + the public catalogue (a new service changes it).
  revalidatePath("/admin/services");
  revalidatePath("/services");

  // redirect() throws a control-flow signal, so it MUST live outside the
  // try/catch (otherwise the catch would swallow the redirect).
  redirect("/admin/services");
}

// ── Update ──────────────────────────────────────────────────────────────────
export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Not authorized" };

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid service id" };

  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service details.",
    };
  }
  const data = parsed.data;

  if (!dbReady) return { ok: false, error: "Database not configured" };

  // Slug uniqueness — allow the row to KEEP its own slug; reject only a clash
  // with a DIFFERENT row.
  const existing = await getServiceBySlugAny(data.slug);
  if (existing && existing.id !== parsedId.data) {
    return { ok: false, error: "That slug is already in use." };
  }

  try {
    await db
      .update(schema.services)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        durationMin: data.durationMin,
        priceFromCents: data.priceFromCents,
        priceToCents: data.priceToCents,
        imageUrl: data.imageUrl,
        images: data.images,
        active: data.active,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(schema.services.id, parsedId.data));
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, error: "That slug is already in use." };
    }
    console.error("[booking-service] updateService failed:", err);
    return { ok: false, error: "Could not update the service. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

// ── Activate / deactivate ─────────────────────────────────────────────────────
// Called from the row toggle island; returns {ok:true} (no redirect) so the
// island can revert optimistic UI on failure. revalidatePath refreshes the row.
export async function setServiceActive(
  id: string,
  active: boolean,
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Not authorized" };

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid service id" };

  if (typeof active !== "boolean") {
    return { ok: false, error: "Invalid active value" };
  }

  if (!dbReady) return { ok: false, error: "Database not configured" };

  try {
    await db
      .update(schema.services)
      .set({ active, updatedAt: new Date() })
      .where(eq(schema.services.id, parsedId.data));
  } catch (err) {
    console.error("[booking-service] setServiceActive failed:", err);
    return { ok: false, error: "Could not update the service. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

// ── Delete ────────────────────────────────────────────────────────────────────
// HARD delete. The FK `bookings.serviceId` is onDelete:set null, so existing
// bookings survive (the dashboard renders "Deleted service"). The confirm step
// lives in the client AlertDialog — this action just performs the delete.
export async function deleteService(id: string): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Not authorized" };

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid service id" };

  if (!dbReady) return { ok: false, error: "Database not configured" };

  try {
    await db
      .delete(schema.services)
      .where(eq(schema.services.id, parsedId.data));
  } catch (err) {
    console.error("[booking-service] deleteService failed:", err);
    return { ok: false, error: "Could not delete the service. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}
