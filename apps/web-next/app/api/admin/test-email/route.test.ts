import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

let configReturn: unknown = null;
let sendReturn: unknown = null;

vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: async () => configReturn,
}));

vi.mock("@/lib/email", () => ({
  getNotificationRecipient: (c: { contactEmail: string; notifyEmail: string | null }) =>
    c.notifyEmail?.trim() ? c.notifyEmail : c.contactEmail,
  sendTestEmail: async () => sendReturn,
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { sealAdminSession } from "@/lib/adminSession";
import { POST } from "./route";

function makeRequest(origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/test-email", {
    method: "POST",
    headers: origin ? { origin } : {},
  });
}

describe("POST /api/admin/test-email", () => {
  beforeEach(async () => {
    cookieStore.clear();
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
    configReturn = { id: 1, phone: "", contactEmail: "owner@itshassan.it", notifyEmail: null };
    sendReturn = { ok: true, id: "msg_123" };
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin", async () => {
    const res = await POST(makeRequest("https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 500 when site_config row is missing", async () => {
    configReturn = null;
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });

  it("returns 502 when Resend reports a failure (e.g. unconfigured)", async () => {
    sendReturn = { ok: false, error: "Resend not configured (set RESEND_API_KEY and RESEND_FROM)" };
    const res = await POST(makeRequest());
    expect(res.status).toBe(502);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toMatch(/Resend not configured/);
  });

  it("returns 200 + recipient on success", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; recipient: string };
    expect(body.ok).toBe(true);
    expect(body.recipient).toBe("owner@itshassan.it");
  });
});
