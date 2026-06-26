import { describe, expect, it } from "vitest";
import {
  formatPriceRange,
  formatDuration,
  formatPreferredSlot,
} from "./format";

describe("formatPriceRange", () => {
  it("formats a single 'from' price when no upper bound", () => {
    expect(formatPriceRange(3500, null)).toBe("from €35");
  });

  it("formats a range when upper bound is higher", () => {
    expect(formatPriceRange(4500, 9000)).toBe("€45 – €90");
  });

  it("collapses to 'from' when upper bound is not higher than lower", () => {
    expect(formatPriceRange(5000, 5000)).toBe("from €50");
    expect(formatPriceRange(5000, 4000)).toBe("from €50");
  });
});

describe("formatDuration", () => {
  it("shows minutes under an hour", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("shows whole hours", () => {
    expect(formatDuration(120)).toBe("2 h");
  });

  it("shows hours and minutes", () => {
    expect(formatDuration(90)).toBe("1 h 30 min");
  });
});

describe("formatPreferredSlot", () => {
  it("appends the time when present", () => {
    expect(formatPreferredSlot("2026-07-15", "14:30")).toBe("15 Jul 2026 · 14:30");
  });

  it("omits the time separator when no time is given", () => {
    expect(formatPreferredSlot("2026-07-15", null)).toBe("15 Jul 2026");
  });
});
