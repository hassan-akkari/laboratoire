import { describe, expect, it } from "vitest";
import {
  applicationSchema,
  isFollowUpOverdue,
  sortForBoard,
  type Application,
} from "./schema";

const base: Application = {
  id: "a1",
  company: "Alpstein Software AG",
  role: "Senior Frontend Engineer",
  location: "Zürich, CH",
  source: "indeed",
  stack: ["react", "typescript"],
  status: "applied",
  appliedAt: "2026-07-01",
  lastContactAt: "2026-07-05",
  nextFollowUpAt: "2026-07-12",
  notes: "",
};

const TODAY = "2026-07-14";

describe("applicationSchema", () => {
  it("accepts a valid application", () => {
    expect(applicationSchema.safeParse(base).success).toBe(true);
  });

  it("rejects an unknown status", () => {
    const result = applicationSchema.safeParse({ ...base, status: "pending" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-ISO follow-up date", () => {
    const result = applicationSchema.safeParse({
      ...base,
      nextFollowUpAt: "12/07/2026",
    });
    expect(result.success).toBe(false);
  });
});

describe("isFollowUpOverdue", () => {
  it("flags a past follow-up on an open application", () => {
    expect(isFollowUpOverdue(base, TODAY)).toBe(true);
  });

  it("does not flag a future follow-up", () => {
    expect(
      isFollowUpOverdue({ ...base, nextFollowUpAt: "2026-07-20" }, TODAY),
    ).toBe(false);
  });

  it("does not flag when no follow-up is scheduled", () => {
    expect(isFollowUpOverdue({ ...base, nextFollowUpAt: null }, TODAY)).toBe(
      false,
    );
  });

  it("does not flag closed applications, even with a past date", () => {
    expect(
      isFollowUpOverdue({ ...base, status: "rejected" }, TODAY),
    ).toBe(false);
  });
});

describe("sortForBoard", () => {
  it("puts overdue first, then scheduled, then unscheduled, then closed", () => {
    const overdue = { ...base, id: "overdue" };
    const scheduled = {
      ...base,
      id: "scheduled",
      nextFollowUpAt: "2026-07-20",
    };
    const unscheduled = { ...base, id: "unscheduled", nextFollowUpAt: null };
    const closed: Application = {
      ...base,
      id: "closed",
      status: "rejected",
      nextFollowUpAt: null,
    };

    const sorted = sortForBoard(
      [closed, unscheduled, scheduled, overdue],
      TODAY,
    );
    expect(sorted.map((a) => a.id)).toEqual([
      "overdue",
      "scheduled",
      "unscheduled",
      "closed",
    ]);
  });
});
