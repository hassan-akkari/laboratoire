import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.CAL_WEBHOOK_SECRET = "test-secret-xyz";
});

const verifyMock = vi.fn();
vi.mock("@/lib/cal/verifySignature", () => ({
  verifyCalSignature: (...args: unknown[]) => verifyMock(...args),
}));

const extractMock = vi.fn();
vi.mock("@/lib/cal/extract", () => ({
  extractCalBooking: (body: unknown) => extractMock(body),
}));

const upsertMock = vi.fn();
const recordNotifMock = vi.fn();
vi.mock("@/lib/admin/leads", () => ({
  upsertCalLead: (input: unknown) => upsertMock(input),
  recordLeadNotification: (id: string, outcome: unknown) => recordNotifMock(id, outcome),
}));

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

const sendMock = vi.fn();
vi.mock("@/lib/email", async () => {
  const actual = await vi.importActual<typeof import("@/lib/email")>("@/lib/email");
  return { ...actual, sendLeadNotification: (...args: unknown[]) => sendMock(...args) };
});

import { POST } from "./route";

function makeRequest(body: string, sig: string | null = null) {
  return new Request("https://admin.itshassan.it/api/cal/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(sig ? { "x-cal-signature-256": sig } : {}),
    },
    body,
  });
}

const validExtract = {
  bookingId: "uid-abc123",
  trigger: "BOOKING_CREATED" as const,
  name: "Alice Rossi",
  email: "alice@example.com",
  startTime: new Date("2026-06-01T09:00:00Z"),
  eventType: "Discovery Call",
  rawPayload: {},
};

describe("POST /api/cal/webhook", () => {
  beforeEach(() => {
    verifyMock.mockReset();
    extractMock.mockReset();
    upsertMock.mockReset();
    recordNotifMock.mockReset();
    getSiteConfigMock.mockReset();
    sendMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      contactEmail: "admin@example.com",
      notifyEmail: null,
    });
    sendMock.mockResolvedValue({ ok: true, id: "msg-1" });
  });

  afterEach(() => vi.restoreAllMocks());

  it("returns 500 when CAL_WEBHOOK_SECRET is not set", async () => {
    const saved = process.env.CAL_WEBHOOK_SECRET;
    delete process.env.CAL_WEBHOOK_SECRET;
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(500);
    process.env.CAL_WEBHOOK_SECRET = saved;
  });

  it("returns 401 when signature verification fails", async () => {
    verifyMock.mockReturnValue(false);
    const res = await POST(makeRequest("{}", "sha256=bad"));
    expect(res.status).toBe(401);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("returns 200 with skipped:true when extract returns null (unknown event)", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(null);
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.skipped).toBe(true);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("upserts lead and sends email on BOOKING_CREATED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        calBookingId: "uid-abc123",
        name: "Alice Rossi",
        email: "alice@example.com",
        bookingStatus: "scheduled",
      }),
    );
    expect(sendMock).toHaveBeenCalledWith(
      "admin@example.com",
      expect.objectContaining({ name: "Alice Rossi", source: "cal" }),
    );
    expect(recordNotifMock).toHaveBeenCalledWith("lead-1", expect.objectContaining({ ok: true }));
  });

  it("does NOT send email on BOOKING_RESCHEDULED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue({ ...validExtract, trigger: "BOOKING_RESCHEDULED" });
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ bookingStatus: "rescheduled" }),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("does NOT send email on BOOKING_CANCELLED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue({ ...validExtract, trigger: "BOOKING_CANCELLED" });
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ bookingStatus: "cancelled" }),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 500 when upsert fails", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue(null);
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("still returns 200 when Resend fails (DB is truth)", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue({ id: "lead-1" });
    sendMock.mockResolvedValue({ ok: false, error: "Resend down" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(recordNotifMock).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ ok: false }),
    );
  });
});
