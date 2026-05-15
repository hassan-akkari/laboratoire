import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.PUBLIC_ALLOWED_ORIGINS = "https://itshassan.it,http://localhost:5173";
  process.env.PRIVACY_VERSION = "v1-2026-05";
});

const createLeadMock = vi.fn();
const recordLeadNotificationMock = vi.fn();
vi.mock("@/lib/admin/leads", () => ({
  createLead: (input: unknown) => createLeadMock(input),
  recordLeadNotification: (id: string, outcome: unknown) =>
    recordLeadNotificationMock(id, outcome),
}));

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

const sendMock = vi.fn();
vi.mock("@/lib/email", async () => {
  const actual = await vi.importActual<typeof import("@/lib/email")>("@/lib/email");
  return {
    ...actual,
    sendLeadNotification: (...args: unknown[]) => sendMock(...args),
  };
});

import { OPTIONS, POST } from "./route";

function makeRequest(
  body: unknown,
  origin: string | null = "https://itshassan.it",
) {
  return new Request("https://admin.itshassan.it/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

const validBody = (overrides: Record<string, unknown> = {}) => ({
  name: "Mara",
  email: "mara@example.com",
  message: "Hi from the contact form",
  company_website: "",
  started_at: Date.now() - 5000, // 5s ago — passes the 3s min-delay
  privacy_accepted: true,
  ...overrides,
});

describe("POST /api/leads", () => {
  beforeEach(() => {
    createLeadMock.mockReset();
    recordLeadNotificationMock.mockReset();
    getSiteConfigMock.mockReset();
    sendMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      phone: "",
      contactEmail: "h@x.com",
      notifyEmail: null,
    });
    sendMock.mockResolvedValue({ ok: true, id: "msg-1" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("OPTIONS preflight returns 204 with CORS headers", async () => {
    const req = new Request("https://admin.itshassan.it/api/leads", {
      method: "OPTIONS",
      headers: { origin: "https://itshassan.it" },
    });
    const res = await OPTIONS(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("rejects requests from disallowed origins (403)", async () => {
    const res = await POST(makeRequest(validBody(), "https://evil.com"));
    expect(res.status).toBe(403);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("returns 400 on malformed body", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("silently 200s when honeypot is filled (no insert, no email)", async () => {
    const res = await POST(makeRequest(validBody({ company_website: "https://spam.example" })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently 200s when submit happens within 3s of started_at", async () => {
    const res = await POST(makeRequest(validBody({ started_at: Date.now() - 1000 })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when privacy_accepted is false", async () => {
    const res = await POST(makeRequest(validBody({ privacy_accepted: false })));
    expect(res.status).toBe(400);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("inserts a lead with PRIVACY_VERSION stamped and triggers Resend", async () => {
    createLeadMock.mockResolvedValueOnce({ id: "lead-1", email: "mara@example.com" });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "contact_form",
        name: "Mara",
        email: "mara@example.com",
        message: "Hi from the contact form",
        privacyVersion: "v1-2026-05",
      }),
    );
    expect(sendMock).toHaveBeenCalledWith(
      "h@x.com",
      expect.objectContaining({ name: "Mara", source: "contact_form" }),
    );
    expect(recordLeadNotificationMock).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ ok: true }),
    );
  });

  it("still returns 200 when Resend fails, and records the notification error", async () => {
    createLeadMock.mockResolvedValueOnce({ id: "lead-2" });
    sendMock.mockResolvedValueOnce({ ok: false, error: "Resend down" });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    expect(recordLeadNotificationMock).toHaveBeenCalledWith(
      "lead-2",
      expect.objectContaining({ ok: false, error: "Resend down" }),
    );
  });

  it("returns 500 when createLead fails to insert (no row returned)", async () => {
    createLeadMock.mockResolvedValueOnce(null);
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
    expect(recordLeadNotificationMock).not.toHaveBeenCalled();
  });
});
