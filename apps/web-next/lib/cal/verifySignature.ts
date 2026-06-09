import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyCalSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;
  // Cal.com sends the BARE hex HMAC-SHA256 digest in X-Cal-Signature-256 — no
  // "sha256=" prefix (see calcom/cal.com sendPayload.ts: createWebhookSignature
  // = createHmac("sha256", secret).update(body).digest("hex")). Match it exactly.
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
  } catch {
    return false;
  }
}
