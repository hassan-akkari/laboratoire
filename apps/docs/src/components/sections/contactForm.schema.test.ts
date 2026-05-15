import { describe, expect, it } from "vitest";
import { createContactSchema, initialContactValues } from "./contactForm.schema";

const labels = {
  nameShort: "name too short",
  emailInvalid: "bad email",
  messageShort: "msg too short",
  privacyRequired: "privacy required",
};

const valid = {
  name: "Mara",
  email: "mara@x.com",
  message: "Hi there, this is a valid message",
  companyWebsite: "",
  startedAt: Date.now() - 5000,
  privacyAccepted: true as const,
};

describe("createContactSchema", () => {
  it("accepts a valid payload", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects short name with the localized message", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("name too short");
    }
  });

  it("rejects bad email", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects when privacyAccepted is false", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, privacyAccepted: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("privacy required");
    }
  });

  it("allows companyWebsite to be empty or absent (honeypot)", () => {
    const schema = createContactSchema(labels);
    const r1 = schema.safeParse({ ...valid, companyWebsite: "" });
    expect(r1.success).toBe(true);
    const withoutHoneypot: Record<string, unknown> = { ...valid };
    delete withoutHoneypot.companyWebsite;
    const r2 = schema.safeParse(withoutHoneypot);
    expect(r2.success).toBe(true);
  });
});

describe("initialContactValues", () => {
  it("returns sensible defaults with a fresh startedAt timestamp", () => {
    const before = Date.now();
    const values = initialContactValues();
    const after = Date.now();
    expect(values.name).toBe("");
    expect(values.email).toBe("");
    expect(values.message).toBe("");
    expect(values.companyWebsite).toBe("");
    expect(values.privacyAccepted).toBe(false);
    expect(values.startedAt).toBeGreaterThanOrEqual(before);
    expect(values.startedAt).toBeLessThanOrEqual(after);
  });
});
