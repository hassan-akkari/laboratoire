import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { processCheckout } from "./orders";

describe("processCheckout", () => {
  it("returns the same order for repeated idempotency keys", () => {
    const idempotencyKey = randomUUID();

    const first = processCheckout({
      slug: "rome-night-food-tour",
      guests: 2,
      date: "2026-03-02",
      promoCode: "NETWORK10",
      fullName: "Hassan Akkari",
      email: "hassan@example.com",
      paymentMethod: "card",
      idempotencyKey,
    });

    const second = processCheckout({
      slug: "rome-night-food-tour",
      guests: 2,
      date: "2026-03-02",
      promoCode: "NETWORK10",
      fullName: "Hassan Akkari",
      email: "hassan@example.com",
      paymentMethod: "card",
      idempotencyKey,
    });

    expect(second.id).toBe(first.id);
    expect(second.idempotencyKey).toBe(first.idempotencyKey);
  });
});
