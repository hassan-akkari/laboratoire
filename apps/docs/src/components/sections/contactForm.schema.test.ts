import { describe, expect, it } from "vitest";
import { contactSchema } from "./contactForm.schema";

describe("contactSchema", () => {
  it("accepts a valid contact payload", () => {
    const result = contactSchema.safeParse({
      name: "Hassan",
      email: "hassan@example.com",
      message: "I would like to collaborate on a project.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and short message", () => {
    const result = contactSchema.safeParse({
      name: "Ha",
      email: "not-an-email",
      message: "short",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const fields = result.error.flatten().fieldErrors;
    expect(fields.email?.[0]).toBe("Email is not valid.");
    expect(fields.message?.[0]).toBe("Message should be at least 10 characters.");
  });
});
