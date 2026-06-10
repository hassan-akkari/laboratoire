import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCalSignature } from "./verifySignature";

// Cal.com sends the bare hex digest (no "sha256=" prefix).
function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyCalSignature", () => {
  const secret = "test-secret-abc123";
  const body = '{"triggerEvent":"BOOKING_CREATED"}';

  it("returns true when signature matches", () => {
    const sig = sign(body, secret);
    expect(verifyCalSignature(body, sig, secret)).toBe(true);
  });

  it("returns false when signature is wrong", () => {
    expect(verifyCalSignature(body, "wronghex", secret)).toBe(false);
  });

  it("returns false when signature header is null", () => {
    expect(verifyCalSignature(body, null, secret)).toBe(false);
  });

  it("returns false when header carries a sha256= prefix (Cal.com sends bare hex)", () => {
    const prefixed = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    expect(verifyCalSignature(body, prefixed, secret)).toBe(false);
  });

  it("uses timingSafeEqual (different lengths return false not throw)", () => {
    expect(verifyCalSignature(body, "short", secret)).toBe(false);
  });
});
