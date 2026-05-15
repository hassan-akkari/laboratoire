import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fakeRows: unknown[] = [];
let lastSetArg: unknown = null;

vi.mock("@/lib/db/client", () => {
  const chainable = {
    select: () => chainable,
    from: () => chainable,
    where: () => chainable,
    limit: async () => fakeRows,
    update: () => chainable,
    set: (arg: unknown) => {
      lastSetArg = arg;
      return chainable;
    },
    returning: async () => fakeRows,
  };
  return {
    db: chainable,
    schema: { siteConfig: { id: "id" } },
  };
});

import { getSiteConfig, updateSiteConfig } from "./siteConfig";

describe("lib/admin/siteConfig", () => {
  beforeEach(() => {
    fakeRows.length = 0;
    lastSetArg = null;
  });
  afterEach(() => vi.restoreAllMocks());

  describe("getSiteConfig", () => {
    it("returns the singleton row when present", async () => {
      fakeRows.push({ id: 1, phone: "+39 111", contactEmail: "a@b.com" });
      const config = await getSiteConfig();
      expect(config).toMatchObject({ id: 1, phone: "+39 111" });
    });

    it("returns null when no row exists (shouldn't happen post-seed, but defensive)", async () => {
      const config = await getSiteConfig();
      expect(config).toBeNull();
    });
  });

  describe("updateSiteConfig", () => {
    it("updates phone + contactEmail and returns the patched row", async () => {
      const patched = { id: 1, phone: "+39 222", contactEmail: "c@d.com", notifyEmail: null };
      fakeRows.push(patched);
      const result = await updateSiteConfig({ phone: "+39 222", contactEmail: "c@d.com" });
      expect(result).toEqual(patched);
      expect(lastSetArg).toMatchObject({ phone: "+39 222", contactEmail: "c@d.com" });
    });

    it("accepts null for notifyEmail to clear the override", async () => {
      fakeRows.push({ id: 1, notifyEmail: null });
      const result = await updateSiteConfig({ notifyEmail: null });
      expect(result?.notifyEmail).toBeNull();
      expect(lastSetArg).toMatchObject({ notifyEmail: null });
    });
  });
});
