import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const mockUsers: { id: string; email: string; passwordHash: string }[] = [];
let bcryptCompareImpl: (pw: string, hash: string) => Promise<boolean> = async () => false;

vi.mock("@/lib/db/client", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => mockUsers,
        }),
      }),
    }),
  },
  schema: {
    users: { email: "email" },
  },
}));

vi.mock("bcryptjs", () => ({
  default: { compare: (pw: string, hash: string) => bcryptCompareImpl(pw, hash) },
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { POST } from "./route";

function makeRequest(body: unknown, origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    mockUsers.length = 0;
    cookieStore.clear();
    bcryptCompareImpl = async () => false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects requests with disallowed Origin", async () => {
    const res = await POST(makeRequest({ email: "a@b.com", password: "x" }, "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("rejects malformed body", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 401 for unknown email", async () => {
    const res = await POST(makeRequest({ email: "unknown@x.com", password: "pw" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 when password mismatch", async () => {
    mockUsers.push({ id: "u1", email: "a@b.com", passwordHash: "$hash" });
    bcryptCompareImpl = async () => false;
    const res = await POST(makeRequest({ email: "a@b.com", password: "wrong" }));
    expect(res.status).toBe(401);
  });

  it("sets admin_session cookie and returns 200 on valid credentials", async () => {
    mockUsers.push({ id: "u1", email: "a@b.com", passwordHash: "$hash" });
    bcryptCompareImpl = async () => true;
    const res = await POST(makeRequest({ email: "a@b.com", password: "right" }));
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(true);
    const cookieValue = cookieStore.get("admin_session");
    expect(cookieValue?.length ?? 0).toBeGreaterThan(20);
  });
});
