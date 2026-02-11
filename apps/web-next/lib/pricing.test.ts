import { describe, expect, it } from "vitest";
import { quoteBooking } from "./pricing";

describe("quoteBooking", () => {
  it("applies minimum group safeguard when required", () => {
    const quote = quoteBooking({
      slug: "vatican-fast-track",
      guests: 2,
      date: "2026-03-02",
      promoCode: undefined,
    });

    expect(quote.subtotal).toBe(120);
    expect(quote.pricingRule).toBe("Minimum group safeguard");
  });

  it("applies NETWORK10 discount correctly", () => {
    const quote = quoteBooking({
      slug: "rome-night-food-tour",
      guests: 4,
      date: "2026-03-02",
      promoCode: "NETWORK10",
    });

    expect(quote.discount).toBe(18);
    expect(quote.total).toBeGreaterThan(0);
    expect(quote.promoLabel).toBe("NETWORK10 (10%)");
  });

  it("does not apply TEAM5 when guest threshold is not met", () => {
    const quote = quoteBooking({
      slug: "tiber-boat-sunset",
      guests: 3,
      date: "2026-03-02",
      promoCode: "TEAM5",
    });

    expect(quote.discount).toBe(0);
    expect(quote.promoLabel).toBeUndefined();
  });
});
