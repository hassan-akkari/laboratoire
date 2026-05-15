import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Lead } from "@/lib/db/schema";

const mockState: {
  selectRows: Lead[];
  selectByIdRows: Lead[];
  updateReturn: Lead[];
  whereSpy: ReturnType<typeof vi.fn>;
  setSpy: ReturnType<typeof vi.fn>;
  insertSpy: ReturnType<typeof vi.fn>;
} = {
  selectRows: [],
  selectByIdRows: [],
  updateReturn: [],
  whereSpy: vi.fn(),
  setSpy: vi.fn(),
  insertSpy: vi.fn(),
};

vi.mock("@/lib/db/client", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: (cond: unknown) => {
          mockState.whereSpy(cond);
          return {
            orderBy: async () => mockState.selectRows,
            limit: async () => mockState.selectByIdRows,
          };
        },
        orderBy: async () => mockState.selectRows,
      }),
    }),
    update: () => ({
      set: (patch: unknown) => {
        mockState.setSpy(patch);
        return {
          where: () => ({
            returning: async () => mockState.updateReturn,
          }),
        };
      },
    }),
    insert: () => ({
      values: (row: unknown) => {
        mockState.insertSpy(row);
        return {
          returning: async () => mockState.updateReturn,
        };
      },
    }),
  },
  schema: {
    leads: {
      id: "id",
      status: "status",
      source: "source",
      createdAt: "createdAt",
    },
  },
}));

import {
  createLead,
  getLeadById,
  getLeads,
  recordLeadNotification,
  updateLead,
} from "./leads";

describe("lib/admin/leads", () => {
  beforeEach(() => {
    mockState.selectRows = [];
    mockState.selectByIdRows = [];
    mockState.updateReturn = [];
    mockState.whereSpy.mockReset();
    mockState.setSpy.mockReset();
    mockState.insertSpy.mockReset();
  });

  afterEach(() => vi.restoreAllMocks());

  describe("getLeads", () => {
    it("returns all rows when no filters are given", async () => {
      mockState.selectRows = [{ id: "1" } as Lead, { id: "2" } as Lead];
      const rows = await getLeads();
      expect(rows).toHaveLength(2);
      expect(mockState.whereSpy).not.toHaveBeenCalled();
    });

    it("passes a where condition when status is set", async () => {
      mockState.selectRows = [{ id: "1", status: "new" } as Lead];
      await getLeads({ status: "new" });
      expect(mockState.whereSpy).toHaveBeenCalled();
    });

    it("passes a where condition when both status and source are set", async () => {
      mockState.selectRows = [{ id: "1" } as Lead];
      await getLeads({ status: "contacted", source: "cal" });
      expect(mockState.whereSpy).toHaveBeenCalled();
    });
  });

  describe("getLeadById", () => {
    it("returns the row when present", async () => {
      mockState.selectByIdRows = [{ id: "abc" } as Lead];
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
      const patched = { id: "abc", status: "contacted", notes: "called" } as Lead;
      mockState.updateReturn = [patched];
      const result = await updateLead("abc", { status: "contacted", notes: "called" });
      expect(result).toEqual(patched);
      expect(mockState.setSpy.mock.calls[0]?.[0]).toMatchObject({ status: "contacted", notes: "called" });
    });

    it("returns null when no row matches the id", async () => {
      const result = await updateLead("missing", { status: "closed" });
      expect(result).toBeNull();
    });
  });
});

describe("createLead", () => {
  beforeEach(() => {
    mockState.updateReturn = [];
    mockState.setSpy.mockReset();
  });

  it("inserts a contact-form lead with privacy fields and returns the row", async () => {
    const inserted = {
      id: "abc",
      source: "contact_form",
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      status: "new",
      privacyAcceptedAt: new Date("2026-05-15T10:00:00Z"),
      privacyVersion: "v1-2026-05",
    };
    mockState.updateReturn = [inserted as unknown as Lead];
    const result = await createLead({
      source: "contact_form",
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      privacyVersion: "v1-2026-05",
    });
    expect(result?.id).toBe("abc");
  });

  it("returns null when no row was returned", async () => {
    mockState.updateReturn = [];
    const result = await createLead({
      source: "contact_form",
      name: "X",
      email: "x@y.com",
      message: "Z",
      privacyVersion: "v1-2026-05",
    });
    expect(result).toBeNull();
  });
});

describe("recordLeadNotification", () => {
  beforeEach(() => {
    mockState.updateReturn = [];
    mockState.setSpy.mockReset();
  });

  it("stamps lastNotifiedAt on success", async () => {
    mockState.updateReturn = [{ id: "abc" } as Lead];
    await recordLeadNotification("abc", { ok: true });
    const patch = mockState.setSpy.mock.calls[0]?.[0] as {
      lastNotifiedAt?: Date;
      notificationError?: string | null;
    };
    expect(patch.lastNotifiedAt).toBeInstanceOf(Date);
    expect(patch.notificationError).toBeNull();
  });

  it("captures notificationError on failure without touching lastNotifiedAt", async () => {
    mockState.updateReturn = [{ id: "abc" } as Lead];
    await recordLeadNotification("abc", { ok: false, error: "Resend down" });
    const patch = mockState.setSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    // lastNotifiedAt is intentionally NOT in the patch on failure — the column
    // preserves the prior successful timestamp across transient errors.
    expect(Object.keys(patch)).not.toContain("lastNotifiedAt");
    expect(patch.notificationError).toBe("Resend down");
  });
});
