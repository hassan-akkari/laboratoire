import { describe, expect, it } from "vitest";
import { escapeHtml, getNotificationRecipient } from "./email";

describe("escapeHtml", () => {
  it("passes plain ASCII through unchanged", () => {
    expect(escapeHtml("hello@itshassan.it")).toBe("hello@itshassan.it");
  });

  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<script>"a&b'c</script>`)).toBe(
      "&lt;script&gt;&quot;a&amp;b&#39;c&lt;/script&gt;",
    );
  });

  it("is idempotent only for already-text-safe input (not a sanitizer)", () => {
    // & gets escaped first; running escapeHtml twice would double-escape.
    // Documents the contract: callers escape ONCE at the boundary.
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });
});

describe("getNotificationRecipient", () => {
  it("returns notifyEmail when it is set", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "alerts@itshassan.it",
      }),
    ).toBe("alerts@itshassan.it");
  });

  it("falls back to contactEmail when notifyEmail is null", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: null,
      }),
    ).toBe("hello@itshassan.it");
  });

  it("treats empty-string notifyEmail as 'not set' and falls back", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "",
      }),
    ).toBe("hello@itshassan.it");
  });
});
