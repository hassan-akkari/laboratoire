"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, getAdminSession } from "@/lib/adminSession";
import { db, dbReady, schema } from "@/lib/db/client";
import { parseBookingStatus } from "@/features/bookings/status";

// Authed admin server actions. Both are called from client components, so they
// re-check the session server-side (defence in depth) — the client is NEVER
// trusted, and middleware is only the first gate.
//
// NOTE: a "use server" module may export ONLY async functions, so the status
// enum/labels live in the pure `@/features/bookings/status` module (shared with
// the client <Select> and a unit test); this file just consumes the validator.

// ── Status update ───────────────────────────────────────────────────────────
// The enum is validated SERVER-SIDE against the four allowed literals. An
// arbitrary string (e.g. a hand-crafted request) is rejected before any DB
// write. The update goes through the Drizzle table object only — no raw SQL,
// no string interpolation — and bumps `updatedAt`.

const idSchema = z.string().uuid();

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<UpdateStatusResult> {
  // 1) AuthN — reject anyone without a valid sealed session. Never trust that
  //    middleware already ran; this action is independently reachable.
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, error: "Not authorized" };
  }

  // 2) Validate inputs server-side. An unknown status or a non-uuid id is
  //    rejected here — the client cannot smuggle an arbitrary value into SQL.
  const validStatus = parseBookingStatus(status);
  if (!validStatus) {
    return { ok: false, error: "Invalid status" };
  }
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { ok: false, error: "Invalid booking id" };
  }

  if (!dbReady) {
    return { ok: false, error: "Database not configured" };
  }

  try {
    // 3) Drizzle objects only — parameterised, no interpolation.
    await db
      .update(schema.bookings)
      .set({ status: validStatus, updatedAt: new Date() })
      .where(eq(schema.bookings.id, parsedId.data));
  } catch (err) {
    // Never leak raw DB errors to the client.
    console.error("[booking-service] updateBookingStatus failed:", err);
    return { ok: false, error: "Could not update status. Please try again." };
  }

  // 4) Refresh the dashboard so the new status (and any derived stats) render.
  revalidatePath("/admin");
  return { ok: true };
}

// ── Logout ────────────────────────────────────────────────────────────────
// Idempotent: always clears the cookie (even a stale/un-unsealable one) and
// redirects back to the login page.
export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
