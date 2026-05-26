import type { NextRequest } from "next/server";
import { verifyCalSignature } from "@/lib/cal/verifySignature";
import { extractCalBooking } from "@/lib/cal/extract";
import { upsertCalLead, recordLeadNotification } from "@/lib/admin/leads";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { getNotificationRecipient, sendLeadNotification } from "@/lib/email";

export const runtime = "nodejs";

const BOOKING_STATUS = {
  BOOKING_CREATED: "scheduled",
  BOOKING_RESCHEDULED: "rescheduled",
  BOOKING_CANCELLED: "cancelled",
} as const;

export async function POST(request: NextRequest | Request): Promise<Response> {
  const rawBody = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const sig = request.headers.get("X-Cal-Signature-256");
  if (!verifyCalSignature(rawBody, sig, secret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(rawBody) as unknown;
  const booking = extractCalBooking(body);
  if (!booking) {
    return Response.json({ ok: true, skipped: true });
  }

  const bookingStatus = BOOKING_STATUS[booking.trigger];

  const lead = await upsertCalLead({
    calBookingId: booking.bookingId,
    name: booking.name,
    email: booking.email,
    scheduledAt: booking.startTime,
    sourceDetail: booking.eventType,
    calPayload: booking.rawPayload,
    bookingStatus,
  });

  if (!lead) {
    return Response.json({ error: "Upsert failed" }, { status: 500 });
  }

  if (booking.trigger === "BOOKING_CREATED") {
    const config = await getSiteConfig().catch(() => null);
    if (config) {
      const recipient = getNotificationRecipient(config);
      const scheduledStr = booking.startTime
        ? booking.startTime.toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Rome",
          })
        : "time unknown";
      const result = await sendLeadNotification(recipient, {
        name: booking.name,
        email: booking.email,
        message: `Booked: ${booking.eventType ?? "Discovery Call"} on ${scheduledStr}`,
        source: "cal",
      });
      try {
        await recordLeadNotification(lead.id, result);
      } catch {
        // non-fatal — lead is already saved
      }
    }
  }

  return Response.json({ ok: true });
}
