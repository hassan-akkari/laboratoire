import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCalSignature } from "./verifySignature";

function sign(body: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

describe("verifyCalSignature", () => {
  const secret = "test-secret-abc123";
  const body = '{"triggerEvent":"BOOKING_CREATED"}';

  it("returns true when signature matches", () => {
    const sig = sign(body, secret);
    expect(verifyCalSignature(body, sig, secret)).toBe(true);
  });

  it("returns false when signature is wrong", () => {
    expect(verifyCalSignature(body, "sha256=wronghex", secret)).toBe(false);
  });

  it("returns false when signature header is null", () => {
    expect(verifyCalSignature(body, null, secret)).toBe(false);
  });

  it("returns false when header lacks sha256= prefix", () => {
    const hex = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyCalSignature(body, hex, secret)).toBe(false);
  });

  it("uses timingSafeEqual (different lengths return false not throw)", () => {
    expect(verifyCalSignature(body, "sha256=short", secret)).toBe(false);
  });
});
