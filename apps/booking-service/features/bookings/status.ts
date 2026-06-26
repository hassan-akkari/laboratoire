import { z } from "zod";

// Pure, isomorphic booking-status helpers — NO `server-only`, NO next/headers,
// NO db — so this is safe to import from client islands (the status <Select>)
// AND from a unit test, while the server action reuses the SAME validator. The
// literals mirror the pgEnum `bookingStatusEnum` in lib/db/schema.ts.

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/**
 * Narrow an arbitrary string to a BookingStatus, or null if it isn't one of the
 * four allowed values. Used server-side to reject hand-crafted/invalid input
 * before any DB write.
 */
export function parseBookingStatus(value: unknown): BookingStatus | null {
  const parsed = bookingStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
