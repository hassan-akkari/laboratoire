import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

import { escapeHtml, getNotificationRecipient, sendLeadNotification } from "./email";

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

describe("sendLeadNotification", () => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.RESEND_FROM;

  beforeEach(() => {
    sendMock.mockReset();
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalFrom === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = originalFrom;
  });

  it("returns ok:false when Resend not configured", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.RESEND_FROM = "from@x.com";
    const r = await sendLeadNotification("a@b.com", {
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      source: "contact_form",
    });
    expect(r.ok).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends with the lead fields HTML-escaped", async () => {
    process.env.RESEND_API_KEY = "re_x";
    process.env.RESEND_FROM = "from@x.com";
    sendMock.mockResolvedValue({ data: { id: "msg-9" }, error: null });
    const r = await sendLeadNotification("a@b.com", {
      name: '<script>alert("x")</script>',
      email: "mara@x.com",
      message: "Use & < > tags carefully",
      source: "contact_form",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.id).toBe("msg-9");
    const sentArgs = sendMock.mock.calls[0]?.[0] as { html: string };
    expect(sentArgs.html).toContain("&lt;script&gt;");
    expect(sentArgs.html).toContain("Use &amp; &lt; &gt; tags");
    expect(sentArgs.html).not.toContain("<script>");
  });

  it("returns ok:false with the Resend error on failure", async () => {
    process.env.RESEND_API_KEY = "re_x";
    process.env.RESEND_FROM = "from@x.com";
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "rate limited", name: "RateLimitError" },
    });
    const r = await sendLeadNotification("a@b.com", {
      name: "X",
      email: "x@y.com",
      message: "Z",
      source: "contact_form",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("rate limited");
  });
});
