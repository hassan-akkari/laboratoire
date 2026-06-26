import { z } from "zod";

// Booking-request validation. Shared by the client form (zodResolver) and the
// server action (safeParse) so the browser and the server enforce the SAME
// rules. Pure module — no `server-only`, no `next/headers` — so it is safe to
// import from the "use client" form island.
//
// NOTE ON DATES: the no-past-date check uses `new Date()` inside a `.refine`.
// That callback runs at VALIDATION time (a request / a keystroke), never at
// module load, so it is correct here — unlike a workflow script, a runtime
// validator may read the wall clock.

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Local-midnight Date for a YYYY-MM-DD string (date-only, no TZ shift). */
function startOfDay(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const createBookingSchema = z
  .object({
    serviceSlug: z.string().trim().min(1, "Missing service."),
    customerName: z
      .string()
      .trim()
      .min(2, "Please enter your name (at least 2 characters).")
      .max(80, "Name is too long (max 80 characters)."),
    // Phone/email are each individually optional here; the cross-field
    // `.refine` below requires AT LEAST ONE so we can confirm the booking.
    customerPhone: z
      .string()
      .trim()
      .min(5, "Phone number looks too short.")
      .max(30, "Phone number is too long (max 30 characters).")
      .optional()
      .or(z.literal("")),
    customerEmail: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long (max 254 characters).")
      .optional()
      .or(z.literal("")),
    preferredDate: z
      .string()
      .date("Choose a valid date (YYYY-MM-DD).")
      .refine(
        (value) => startOfDay(value).getTime() >= startOfDay(today()).getTime(),
        "Pick today or a future date.",
      ),
    preferredTime: z
      .string()
      .regex(TIME_RE, "Use 24-hour time, e.g. 14:30.")
      .optional()
      .or(z.literal("")),
    notes: z
      .string()
      .trim()
      .max(1000, "Notes are too long (max 1000 characters).")
      .optional()
      .or(z.literal("")),
  })
  // Require a phone OR an email so we have a way to reach the customer. Attach
  // the issue to `customerPhone` so it renders inline next to the contact
  // fields (the action also surfaces it as a top-level error for safety).
  .refine(
    (data) => Boolean(data.customerPhone) || Boolean(data.customerEmail),
    {
      message: "Provide a phone or email so we can confirm.",
      path: ["customerPhone"],
    },
  );

/** Today's wall-clock date — isolated so the refine reads it lazily. */
function today(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
