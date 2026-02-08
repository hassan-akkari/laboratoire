import { describe, expect, it } from "vitest";
import { sanitizeNextPath } from "./session";

describe("sanitizeNextPath", () => {
  it("keeps valid internal paths", () => {
    expect(sanitizeNextPath("/checkout?slug=abc")).toBe("/checkout?slug=abc");
  });

  it("rejects external protocol-relative redirects", () => {
    expect(sanitizeNextPath("//evil.example.com")).toBe("/checkout");
  });

  it("falls back on missing or malformed values", () => {
    expect(sanitizeNextPath(undefined)).toBe("/checkout");
    expect(sanitizeNextPath("https://evil.example.com")).toBe("/checkout");
  });
});
