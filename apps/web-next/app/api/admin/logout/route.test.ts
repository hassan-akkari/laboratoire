import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

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
  return new Request("https://admin.itshassan.it/api/admin/logout", {
    method: "POST",
    headers: origin ? { origin } : {},
  });
}

describe("POST /api/admin/logout", () => {
  beforeEach(() => cookieStore.clear());
  afterEach(() => vi.restoreAllMocks());

  it("rejects disallowed Origin", async () => {
    const res = await POST(makeRequest("https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("clears the cookie and returns 200 even when there's no session (idempotent)", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(false);
  });

  it("clears a stale/tampered cookie even though unseal would fail", async () => {
    cookieStore.set("admin_session", "not-a-real-seal-xxxxxxxxxx");
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(false);
  });

  it("clears the cookie and returns 200 when signed in", async () => {
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(false);
  });
});
