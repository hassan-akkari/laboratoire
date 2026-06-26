"use server";

import { db, dbReady, schema } from "@/lib/db/client";
import { getActiveServiceBySlug } from "@/features/services/queries";
import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/lib/bookingSchemas";

// Server Action for the public booking form. The form island calls this
// directly (the documented "import the action function" pattern); all the
// server-only modules it touches (db/client, queries) stay on the server.
//
// Contract (discriminated by `ok`):
//   { ok: true }                      → saved (status defaults to "pending")
//   { ok: true, demo: true }          → no DB configured; validated but NOT saved
//   { ok: false, error, fieldErrors } → validation failed (per-field messages)
//   { ok: false, error }              → service not found / unexpected error
export type CreateBookingResult =
  | { ok: true; demo?: boolean }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

/** "" → undefined so optional columns store NULL, not an empty string. */
function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  // 1) Validate on the server — never trust the client. Mirrors the resolver
  //    the form uses, so a bypassed client still can't write a bad row.
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return {
      ok: false,
      error:
        formErrors[0] ??
        "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    // 2) Resolve the service by slug to get its real id (the FK we persist).
    //    Works against the DB or the demo fallback (queries.ts handles both).
    const service = await getActiveServiceBySlug(data.serviceSlug);
    if (!service) {
      return { ok: false, error: "Service not found" };
    }

    // 3) No DB configured → don't throw; report a friendly demo success so the
    //    form still works on the fallback catalogue (nothing is persisted).
    if (!dbReady) {
      return { ok: true, demo: true };
    }

    // 4) Persist via the Drizzle table object only (never raw SQL). `status`
    //    is left to its column default ("pending"). Empty optional inputs are
    //    normalised to undefined → NULL.
    await db.insert(schema.bookings).values({
      serviceId: service.id,
      customerName: data.customerName,
      customerPhone: emptyToUndefined(data.customerPhone),
      customerEmail: emptyToUndefined(data.customerEmail),
      preferredDate: data.preferredDate,
      preferredTime: emptyToUndefined(data.preferredTime),
      notes: emptyToUndefined(data.notes),
    });

    return { ok: true };
  } catch (err) {
    // 5) Never leak raw DB/driver errors to the client. Log server-side for
    //    diagnosis; return a generic, safe message.
    console.error("[booking-service] createBooking failed:", err);
    return { ok: false, error: "Something went wrong, please try again" };
  }
}
