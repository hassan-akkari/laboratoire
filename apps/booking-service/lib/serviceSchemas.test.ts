import { describe, expect, it } from "vitest";
import { serviceSchema, SLUG_RE } from "./serviceSchemas";

// Guards the shared service validator used by BOTH the admin form and the
// server actions. The slug shape and the priceTo >= priceFrom rule are the two
// places a bad input could otherwise reach the DB (a malformed slug, or an
// upper price below the lower one), so they are asserted explicitly.

/** A minimal valid input; spread + override per case. */
function base() {
  return {
    title: "Classic Haircut",
    slug: "classic-haircut",
    description: "A precision cut.",
    category: "Hair",
    durationMin: 45,
    priceFromCents: 3500,
    priceToCents: null,
    imageUrl: "",
    active: true,
    sortOrder: 1,
  };
}

describe("SLUG_RE", () => {
  it("accepts lowercase dash-separated slugs", () => {
    expect(SLUG_RE.test("classic-haircut")).toBe(true);
    expect(SLUG_RE.test("cut")).toBe(true);
    expect(SLUG_RE.test("knotless-braids-xl")).toBe(true);
    expect(SLUG_RE.test("a1-b2")).toBe(true);
  });

  it("rejects malformed slugs", () => {
    expect(SLUG_RE.test("Classic-Haircut")).toBe(false); // uppercase
    expect(SLUG_RE.test("-leading")).toBe(false);
    expect(SLUG_RE.test("trailing-")).toBe(false);
    expect(SLUG_RE.test("double--dash")).toBe(false);
    expect(SLUG_RE.test("has space")).toBe(false);
    expect(SLUG_RE.test("under_score")).toBe(false);
    expect(SLUG_RE.test("")).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("accepts a valid service", () => {
    const parsed = serviceSchema.safeParse(base());
    expect(parsed.success).toBe(true);
  });

  it("rejects a malformed slug", () => {
    const parsed = serviceSchema.safeParse({ ...base(), slug: "Bad Slug" });
    expect(parsed.success).toBe(false);
  });

  it("requires a non-empty title", () => {
    const parsed = serviceSchema.safeParse({ ...base(), title: "   " });
    expect(parsed.success).toBe(false);
  });

  it("accepts a price range when the upper bound is >= the lower bound", () => {
    const parsed = serviceSchema.safeParse({
      ...base(),
      priceFromCents: 4500,
      priceToCents: 9000,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an upper price below the starting price", () => {
    const parsed = serviceSchema.safeParse({
      ...base(),
      priceFromCents: 9000,
      priceToCents: 4500,
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path[0] === "priceToCents")).toBe(
        true,
      );
    }
  });

  it("treats an equal upper bound as valid", () => {
    const parsed = serviceSchema.safeParse({
      ...base(),
      priceFromCents: 5000,
      priceToCents: 5000,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a negative price and a fractional duration", () => {
    expect(
      serviceSchema.safeParse({ ...base(), priceFromCents: -1 }).success,
    ).toBe(false);
    expect(
      serviceSchema.safeParse({ ...base(), durationMin: 1.5 }).success,
    ).toBe(false);
  });

  it("normalises empty category / imageUrl to null and keeps a blank description", () => {
    const parsed = serviceSchema.safeParse({
      title: "X",
      slug: "x",
      description: "",
      durationMin: 60,
      priceFromCents: 0,
      priceToCents: null,
      active: true,
      sortOrder: 0,
      category: "",
      imageUrl: "",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.category).toBeNull();
      expect(parsed.data.imageUrl).toBeNull();
      expect(parsed.data.description).toBe("");
      expect(parsed.data.priceToCents).toBeNull();
    }
  });

  it("rejects an invalid image URL", () => {
    const parsed = serviceSchema.safeParse({ ...base(), imageUrl: "not a url" });
    expect(parsed.success).toBe(false);
  });
});
