import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fakeRows: unknown[] = [];
let lastWhereArg: unknown = null;
let lastSetArg: unknown = null;

vi.mock("@/lib/db/client", () => {
  const chainable = {
    select: () => chainable,
    from: () => chainable,
    where: (arg: unknown) => {
      lastWhereArg = arg;
      return chainable;
    },
    orderBy: async () => fakeRows,
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
    schema: {
      leads: {
        id: "id",
        status: "status",
        source: "source",
        createdAt: "createdAt",
      },
    },
  };
});

import { getLeadById, getLeads, updateLead } from "./leads";

describe("lib/admin/leads", () => {
  beforeEach(() => {
    fakeRows.length = 0;
    lastWhereArg = null;
    lastSetArg = null;
  });

  afterEach(() => vi.restoreAllMocks());

  describe("getLeads", () => {
    it("returns all rows when no filters are given", async () => {
      fakeRows.push({ id: "1" }, { id: "2" });
      const rows = await getLeads();
      expect(rows).toHaveLength(2);
      expect(lastWhereArg).toBeNull();
    });

    it("passes a where condition when status is set", async () => {
      fakeRows.push({ id: "1", status: "new" });
      await getLeads({ status: "new" });
      expect(lastWhereArg).not.toBeNull();
    });

    it("passes a where condition when both status and source are set", async () => {
      fakeRows.push({ id: "1" });
      await getLeads({ status: "contacted", source: "cal" });
      expect(lastWhereArg).not.toBeNull();
    });
  });

  describe("getLeadById", () => {
    it("returns the row when present", async () => {
      fakeRows.push({ id: "abc" });
      const lead = await getLeadById("abc");
      expect(lead).toEqual({ id: "abc" });
    });

    it("returns null when no row matches", async () => {
      const lead = await getLeadById("missing");
      expect(lead).toBeNull();
    });
  });

  describe("updateLead", () => {
    it("updates status + notes and returns the patched row", async () => {
      const patched = { id: "abc", status: "contacted", notes: "called" };
      fakeRows.push(patched);
      const result = await updateLead("abc", { status: "contacted", notes: "called" });
      expect(result).toEqual(patched);
      expect(lastSetArg).toMatchObject({ status: "contacted", notes: "called" });
    });

    it("returns null when no row matches the id", async () => {
      const result = await updateLead("missing", { status: "closed" });
      expect(result).toBeNull();
    });
  });
});
