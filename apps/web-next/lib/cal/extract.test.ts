import { describe, expect, it } from "vitest";
import { extractCalBooking } from "./extract";

const basePayload = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    uid: "uid-abc123",
    type: "Discovery Call",
    startTime: "2026-06-01T09:00:00.000Z",
    attendees: [{ name: "Alice Rossi", email: "alice@example.com" }],
  },
};

describe("extractCalBooking", () => {
  it("extracts name, email, bookingId, startTime, eventType from BOOKING_CREATED", () => {
    const result = extractCalBooking(basePayload);
    expect(result).not.toBeNull();
    expect(result?.bookingId).toBe("uid-abc123");
    expect(result?.trigger).toBe("BOOKING_CREATED");
    expect(result?.name).toBe("Alice Rossi");
    expect(result?.email).toBe("alice@example.com");
    expect(result?.startTime).toEqual(new Date("2026-06-01T09:00:00.000Z"));
    expect(result?.eventType).toBe("Discovery Call");
  });

  it("extracts from BOOKING_RESCHEDULED", () => {
    const result = extractCalBooking({ ...basePayload, triggerEvent: "BOOKING_RESCHEDULED" });
    expect(result?.trigger).toBe("BOOKING_RESCHEDULED");
  });

  it("extracts from BOOKING_CANCELLED", () => {
    const result = extractCalBooking({ ...basePayload, triggerEvent: "BOOKING_CANCELLED" });
    expect(result?.trigger).toBe("BOOKING_CANCELLED");
  });

  it("returns null when triggerEvent is unknown", () => {
    expect(extractCalBooking({ ...basePayload, triggerEvent: "MEETING_ENDED" })).toBeNull();
  });

  it("returns null when attendees array is empty", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, attendees: [] } };
    expect(extractCalBooking(body)).toBeNull();
  });

  it("returns null when payload is missing uid", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, uid: undefined } };
    expect(extractCalBooking(body)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(extractCalBooking(null)).toBeNull();
    expect(extractCalBooking("string")).toBeNull();
  });

  it("sets startTime to null when startTime is missing", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, startTime: undefined } };
    const result = extractCalBooking(body);
    expect(result?.startTime).toBeNull();
  });

  it("sets eventType to null when type is missing", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, type: undefined } };
    const result = extractCalBooking(body);
    expect(result?.eventType).toBeNull();
  });

  it("preserves rawPayload as-is", () => {
    const result = extractCalBooking(basePayload);
    expect(result?.rawPayload).toBe(basePayload);
  });
});
