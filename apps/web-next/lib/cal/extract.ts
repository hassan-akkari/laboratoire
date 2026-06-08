import { z } from "zod";

const attendeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const payloadSchema = z.object({
  uid: z.string(),
  type: z.string().optional(),
  startTime: z.string().optional(),
  attendees: z.array(attendeeSchema).optional(),
});

const webhookSchema = z.object({
  triggerEvent: z.enum(["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"]),
  payload: payloadSchema,
});

export type CalExtract = {
  bookingId: string;
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  name: string;
  email: string;
  startTime: Date | null;
  eventType: string | null;
  rawPayload: unknown;
};

export function extractCalBooking(body: unknown): CalExtract | null {
  const result = webhookSchema.safeParse(body);
  if (!result.success) return null;
  const { triggerEvent, payload } = result.data;
  const attendee = payload.attendees?.[0];
  if (!attendee) return null;
  return {
    bookingId: payload.uid,
    trigger: triggerEvent,
    name: attendee.name,
    email: attendee.email,
    startTime: payload.startTime ? new Date(payload.startTime) : null,
    eventType: payload.type ?? null,
    rawPayload: body,
  };
}
