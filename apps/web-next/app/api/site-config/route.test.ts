import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.PUBLIC_ALLOWED_ORIGINS = "https://itshassan.it,http://localhost:5173";
});

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

import { GET, OPTIONS } from "./route";

function makeRequest(method: "GET" | "OPTIONS", origin: string | null) {
  return new Request("https://admin.itshassan.it/api/site-config", {
    method,
    headers: origin ? { origin } : {},
  });
}

describe("public /api/site-config", () => {
  beforeEach(() => {
    getSiteConfigMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      phone: "+39 333 1234567",
      contactEmail: "hello@itshassan.it",
      notifyEmail: "admin-only@itshassan.it",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("OPTIONS preflight returns 204 with CORS headers", async () => {
    const res = await OPTIONS(makeRequest("OPTIONS", "https://itshassan.it"));
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
  });

  it("OPTIONS rejects disallowed origins", async () => {
    const res = await OPTIONS(makeRequest("OPTIONS", "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("rejects GET from disallowed origins (403)", async () => {
    const res = await GET(makeRequest("GET", "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns only phone + contactEmail (never notifyEmail)", async () => {
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toEqual({
      phone: "+39 333 1234567",
      contactEmail: "hello@itshassan.it",
    });
    expect(body.notifyEmail).toBeUndefined();
  });

  it("sets CORS + cache headers on success", async () => {
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(res.headers.get("Cache-Control")).toMatch(/s-maxage=60/);
    expect(res.headers.get("Cache-Control")).toMatch(/stale-while-revalidate=600/);
  });

  it("returns 503 when getSiteConfig throws (DB down / not seeded)", async () => {
    getSiteConfigMock.mockRejectedValueOnce(new Error("seed missing"));
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.status).toBe(503);
  });

  it("returns 503 when getSiteConfig resolves null (singleton row missing)", async () => {
    getSiteConfigMock.mockResolvedValueOnce(null);
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/not seeded/i);
  });
});
