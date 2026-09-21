import { describe, expect, it } from "vitest";
import type { JobListing } from "../connectors/types";
import { defaultScoutConfig } from "./config";
import { buildShortlist, scoreListing } from "./score";

const base: JobListing = {
  id: "test-1",
  title: "Senior React Engineer",
  company: "Uetliberg Systems AG",
  location: "Zürich",
  country: "CH",
  remote: "hybrid",
  stack: ["react", "typescript"],
  salaryMin: 110000,
  salaryMax: 130000,
  currency: "CHF",
  postedAt: "2026-07-13",
  url: "https://example.test/1",
  summary: "Product team.",
};

describe("scoreListing", () => {
  it("rates a CH react/ts role as hot", () => {
    const result = scoreListing(base, defaultScoutConfig);
    // 30 (CH) + 18 (react) + 12 (typescript) + 6 (hybrid) = 66 ≥ 60
    expect(result.score).toBe(66);
    expect(result.tier).toBe("hot");
    expect(result.rationale.join(" ")).toContain("target market");
  });

  it("zeroes a listing containing a deal-breaker", () => {
    const spam = { ...base, summary: "WordPress maintenance across clients" };
    const result = scoreListing(spam, defaultScoutConfig);
    expect(result.score).toBe(0);
    expect(result.tier).toBe("skip");
    expect(result.rationale).toEqual(['deal-breaker: "wordpress"']);
  });

  it("gives no location points outside target markets", () => {
    const berlin = { ...base, country: "DE" };
    const result = scoreListing(berlin, defaultScoutConfig);
    expect(result.score).toBe(66 - 30);
    expect(result.rationale.join(" ")).toContain("outside target markets");
  });

  it("halves the score below the salary floor", () => {
    const underpaid = { ...base, salaryMin: 60000, salaryMax: 80000 };
    const result = scoreListing(underpaid, defaultScoutConfig);
    expect(result.score).toBe(33);
    expect(result.tier).toBe("skip");
  });

  it("does not adjust when salary is undisclosed", () => {
    const undisclosed = {
      ...base,
      salaryMin: undefined,
      salaryMax: undefined,
      currency: undefined,
    };
    const result = scoreListing(undisclosed, defaultScoutConfig);
    expect(result.score).toBe(66);
    expect(result.rationale.join(" ")).toContain("undisclosed");
  });
});

describe("buildShortlist", () => {
  it("sorts by score descending", () => {
    const weak = { ...base, id: "weak", country: "DE", stack: ["node"] };
    const shortlist = buildShortlist([weak, base], defaultScoutConfig);
    expect(shortlist.map((entry) => entry.listing.id)).toEqual([
      "test-1",
      "weak",
    ]);
  });
});
