import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const calls: { update: Array<unknown> } = { update: [] };
let updateReturn: unknown = null;

vi.mock("@/lib/admin/siteConfig", () => ({
  updateSiteConfig: async (patch: unknown) => {
    calls.update.push(patch);
    return updateReturn;
  },
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
import { PUT } from "./route";

function makeRequest(body: unknown, origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/site-config", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("PUT /api/admin/site-config", () => {
  beforeEach(async () => {
    cookieStore.clear();
    calls.update.length = 0;
    updateReturn = null;
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin", async () => {
    const res = await PUT(makeRequest({}, "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await PUT(makeRequest({ phone: "+39", contactEmail: "a@b.com", notifyEmail: null }));
    expect(res.status).toBe(401);
  });

  it("rejects invalid email with 400", async () => {
    const res = await PUT(makeRequest({ phone: "x", contactEmail: "not-an-email", notifyEmail: null }));
    expect(res.status).toBe(400);
  });

  it("returns 200 + config on success, with notifyEmail null preserved", async () => {
    updateReturn = { id: 1, phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null };
    const res = await PUT(makeRequest({ phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { config: { phone: string; notifyEmail: string | null } };
    expect(body.config.phone).toBe("+39 333");
    expect(body.config.notifyEmail).toBeNull();
    expect(calls.update[0]).toMatchObject({ phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null });
  });
});
