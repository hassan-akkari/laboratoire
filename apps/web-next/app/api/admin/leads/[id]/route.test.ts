import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const mockCalls: { updateLead: Array<[string, unknown]> } = { updateLead: [] };
let updateLeadReturn: unknown = null;

vi.mock("@/lib/admin/leads", () => ({
  updateLead: async (id: string, patch: unknown) => {
    mockCalls.updateLead.push([id, patch]);
    return updateLeadReturn;
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
import { PATCH } from "./route";

function makeRequest(body: unknown, opts: { origin?: string | null; signedIn?: boolean } = {}) {
  return new Request("https://admin.itshassan.it/api/admin/leads/abc", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(opts.origin !== null ? { origin: opts.origin ?? "https://admin.itshassan.it" } : {}),
    },
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("PATCH /api/admin/leads/[id]", () => {
  beforeEach(async () => {
    cookieStore.clear();
    mockCalls.updateLead.length = 0;
    updateLeadReturn = null;
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin with 403", async () => {
    const res = await PATCH(makeRequest({ status: "contacted" }, { origin: "https://evil.com" }), ctx);
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await PATCH(makeRequest({ status: "contacted" }), ctx);
    expect(res.status).toBe(401);
  });

  it("rejects invalid payload with 400", async () => {
    const res = await PATCH(makeRequest({ status: "not-a-valid-status" }), ctx);
    expect(res.status).toBe(400);
  });

  it("returns 404 when the lead doesn't exist", async () => {
    updateLeadReturn = null;
    const res = await PATCH(makeRequest({ status: "contacted" }), ctx);
    expect(res.status).toBe(404);
  });

  it("returns 200 + updated lead on success and forwards the patch", async () => {
    updateLeadReturn = { id: "abc", status: "contacted", notes: "hi" };
    const res = await PATCH(makeRequest({ status: "contacted", notes: "hi" }), ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { lead: { id: string } };
    expect(body.lead.id).toBe("abc");
    expect(mockCalls.updateLead).toEqual([["abc", { status: "contacted", notes: "hi" }]]);
  });
});
