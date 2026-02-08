import { describe, expect, it } from "vitest";
import {
  fallbackPortfolioContent,
  portfolioContentSchema,
} from "./portfolioContent";

describe("portfolioContentSchema", () => {
  it("accepts the fallback profile payload", () => {
    const result = portfolioContentSchema.safeParse(fallbackPortfolioContent);
    expect(result.success).toBe(true);
  });

  it("rejects payloads with less than two projects", () => {
    const invalidPayload = {
      ...fallbackPortfolioContent,
      projects: [fallbackPortfolioContent.projects[0]],
    };

    const result = portfolioContentSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("rejects payloads with less than two roadmap projects", () => {
    const invalidPayload = {
      ...fallbackPortfolioContent,
      roadmap: [fallbackPortfolioContent.roadmap[0]],
    };

    const result = portfolioContentSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});
