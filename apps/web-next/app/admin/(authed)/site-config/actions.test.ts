import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

const calls = {
  updateSiteConfig: [] as unknown[],
  revalidatePath: [] as string[],
};

vi.mock("@/lib/admin/siteConfig", () => ({
  updateSiteConfig: async (patch: unknown) => {
    calls.updateSiteConfig.push(patch);
    return patch;
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: (p: string) => {
    calls.revalidatePath.push(p);
  },
}));

class RedirectSignal extends Error {
  constructor(public readonly to: string) {
    super(`NEXT_REDIRECT ${to}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new RedirectSignal(to);
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

import { ADMIN_COOKIE_NAME, sealAdminSession } from "@/lib/adminSession";
import { saveConfig } from "./actions";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

async function runAction(fd: FormData): Promise<string | null> {
  try {
    await saveConfig(fd);
    return null;
  } catch (e) {
    if (e instanceof RedirectSignal) return e.to;
    throw e;
  }
}

const validFields = {
  phone: "+39 000 000 0000",
  contactEmail: "contact@example.com",
  notifyEmail: "",
};

describe("saveConfig server action — authorization", () => {
  beforeEach(() => {
    cookieStore.clear();
    calls.updateSiteConfig.length = 0;
    calls.revalidatePath.length = 0;
  });

  it("without a session: redirects to login and does NOT write the config", async () => {
    const to = await runAction(form(validFields));

    expect(to).toBe("/admin/login");
    expect(calls.updateSiteConfig).toHaveLength(0);
    expect(calls.revalidatePath).toHaveLength(0);
  });

  it("with a forged (unsealable) cookie: redirects to login and does NOT write the config", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, "forged-value-that-is-not-sealed");

    const to = await runAction(form(validFields));

    expect(to).toBe("/admin/login");
    expect(calls.updateSiteConfig).toHaveLength(0);
    expect(calls.revalidatePath).toHaveLength(0);
  });

  it("with an expired (genuinely sealed, past TTL) cookie: redirects to login and does NOT write the config", async () => {
    // Seal at T0, then move the clock past the 7-day TTL (plus iron's 60s skew).
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));
      vi.setSystemTime(new Date("2026-01-09T00:00:00Z"));

      const to = await runAction(form(validFields));

      expect(to).toBe("/admin/login");
      expect(calls.updateSiteConfig).toHaveLength(0);
      expect(calls.revalidatePath).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("without a session: rejects BEFORE parsing — invalid input redirects to login, not to ?error=invalid", async () => {
    const to = await runAction(form({ ...validFields, contactEmail: "not-an-email" }));

    expect(to).toBe("/admin/login");
    expect(calls.updateSiteConfig).toHaveLength(0);
    expect(calls.revalidatePath).toHaveLength(0);
  });

  it("with a valid session: saves the config, revalidates and redirects with saved=1", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));

    const to = await runAction(form(validFields));

    expect(calls.updateSiteConfig).toEqual([
      { phone: "+39 000 000 0000", contactEmail: "contact@example.com", notifyEmail: null },
    ]);
    expect(calls.revalidatePath).toEqual(["/admin/site-config"]);
    expect(to).toBe("/admin/site-config?saved=1");
  });

  it("with a valid session but invalid input: redirects with error and does NOT write", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));

    const to = await runAction(form({ ...validFields, contactEmail: "not-an-email" }));

    expect(to).toBe("/admin/site-config?error=invalid");
    expect(calls.updateSiteConfig).toHaveLength(0);
  });
});
