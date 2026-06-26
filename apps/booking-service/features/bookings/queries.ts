import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, dbReady, schema } from "@/lib/db/client";
import type { BookingStatus } from "@/features/bookings/status";

// Repository layer for the admin bookings view (mirrors features/services/
// queries.ts). Pages/actions call these; they never touch Drizzle directly.
// `server-only` keeps the DB client out of any client bundle.

/** A booking row enriched with the (possibly deleted) service's title. */
export type AdminBookingRow = {
  id: string;
  serviceId: string | null;
  serviceTitle: string | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  preferredDate: string;
  preferredTime: string | null;
  notes: string | null;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * All bookings, NEWEST FIRST, each with its service title.
 *
 * LEFT JOIN on services (not inner): a booking whose service was later deleted
 * keeps `serviceId` NULL (FK is onDelete:set null) and would vanish under an
 * inner join — the left join preserves booking history, with `serviceTitle`
 * coming back null for an orphaned/deleted service.
 *
 * Returns [] when no DB is configured (the dashboard renders an empty state).
 */
export async function listBookings(): Promise<AdminBookingRow[]> {
  if (!dbReady) return [];

  const rows = await db
    .select({
      id: schema.bookings.id,
      serviceId: schema.bookings.serviceId,
      serviceTitle: schema.services.title,
      customerName: schema.bookings.customerName,
      customerPhone: schema.bookings.customerPhone,
      customerEmail: schema.bookings.customerEmail,
      preferredDate: schema.bookings.preferredDate,
      preferredTime: schema.bookings.preferredTime,
      notes: schema.bookings.notes,
      status: schema.bookings.status,
      createdAt: schema.bookings.createdAt,
      updatedAt: schema.bookings.updatedAt,
    })
    .from(schema.bookings)
    .leftJoin(schema.services, eq(schema.bookings.serviceId, schema.services.id))
    .orderBy(desc(schema.bookings.createdAt));

  return rows;
}
