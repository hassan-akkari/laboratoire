import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

// --- Side-effect spies -------------------------------------------------------
// The action must not touch the DB or the cache unless the caller is signed in.
const calls = {
  updateLead: [] as Array<[string, unknown]>,
  revalidatePath: [] as string[],
  redirect: [] as string[],
};

vi.mock("@/lib/admin/leads", () => ({
  updateLead: async (id: string, patch: unknown) => {
    calls.updateLead.push([id, patch]);
    return { id };
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: (p: string) => {
    calls.revalidatePath.push(p);
  },
}));

// `redirect()` in Next throws a control-flow error. Mirror that so the action
// stops exactly where the real runtime would.
class RedirectSignal extends Error {
  constructor(public readonly to: string) {
    super(`NEXT_REDIRECT ${to}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    calls.redirect.push(to);
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
import { saveLead } from "./actions";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

async function runAction(fd: FormData): Promise<string | null> {
  try {
    await saveLead(fd);
    return null;
  } catch (e) {
    if (e instanceof RedirectSignal) return e.to;
    throw e;
  }
}

describe("saveLead server action — authorization", () => {
  beforeEach(() => {
    cookieStore.clear();
    calls.updateLead.length = 0;
    calls.revalidatePath.length = 0;
    calls.redirect.length = 0;
  });

  it("without a session: redirects to login and does NOT write to the DB", async () => {
    const to = await runAction(form({ id: "lead-1", status: "closed", notes: "x" }));

    expect(to).toBe("/admin/login");
    expect(calls.updateLead).toHaveLength(0);
    expect(calls.revalidatePath).toHaveLength(0);
  });

  it("with a forged (unsealable) cookie: redirects to login and does NOT write to the DB", async () => {
    // This is exactly what the proxy's presence-only check lets through.
    cookieStore.set(ADMIN_COOKIE_NAME, "forged-value-that-is-not-sealed");

    const to = await runAction(form({ id: "lead-1", status: "closed", notes: "x" }));

    expect(to).toBe("/admin/login");
    expect(calls.updateLead).toHaveLength(0);
    expect(calls.revalidatePath).toHaveLength(0);
  });

  it("with a valid session: updates the lead, revalidates and redirects to the detail page", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));

    const to = await runAction(form({ id: "lead-1", status: "contacted", notes: "called back" }));

    expect(calls.updateLead).toEqual([["lead-1", { status: "contacted", notes: "called back" }]]);
    expect(calls.revalidatePath).toEqual(["/admin/leads/lead-1", "/admin"]);
    expect(to).toBe("/admin/leads/lead-1?saved=1");
  });

  it("with a valid session: ignores an unknown status and stores empty notes as null", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));

    await runAction(form({ id: "lead-2", status: "bogus", notes: "   " }));

    expect(calls.updateLead).toEqual([["lead-2", { notes: null }]]);
  });

  it("with a valid session but no id: does nothing", async () => {
    cookieStore.set(ADMIN_COOKIE_NAME, await sealAdminSession({ userId: "u1" }));

    const to = await runAction(form({ status: "closed" }));

    expect(to).toBeNull();
    expect(calls.updateLead).toHaveLength(0);
  });
});
