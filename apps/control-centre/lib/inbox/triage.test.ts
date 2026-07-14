import { describe, expect, it } from "vitest";
import type { MailMessage } from "../connectors/types";
import { triageInbox, triageMessage } from "./triage";

function message(overrides: Partial<MailMessage>): MailMessage {
  return {
    id: "m1",
    from: "Someone",
    fromAddress: "someone@example.com",
    subject: "Hello",
    snippet: "Just a note.",
    receivedAt: "2026-07-14 09:00",
    hasListUnsubscribe: false,
    ...overrides,
  };
}

describe("triageMessage", () => {
  it("flags a brand lookalike with mismatched reply-to as suspicious", () => {
    const phish = message({
      from: "American Express Alerts",
      fromAddress: "security@arnexcard-alerts.com",
      replyToAddress: "verify@secure-hold-review.net",
      subject: "Urgent: your card has been temporarily suspended",
      snippet: "Verify your identity within 24 hours. Unusual activity detected.",
    });
    const result = triageMessage(phish);
    expect(result.category).toBe("suspicious");
    expect(result.reasons.join(" ")).toContain("american express");
    expect(result.reasons.join(" ")).toContain("reply-to");
  });

  it("never files a phishy 'application' mail under recruiter", () => {
    const phish = message({
      replyToAddress: "elsewhere@shady.net",
      subject: "Your application was selected!",
      snippet: "Verify your identity immediately to proceed.",
    });
    expect(triageMessage(phish).category).toBe("suspicious");
  });

  it("does not flag the real brand domain", () => {
    const legit = message({
      from: "American Express",
      fromAddress: "alerts@americanexpress.com",
      subject: "Your monthly statement is ready",
    });
    expect(triageMessage(legit).category).toBe("fyi");
  });

  it("classifies recruiter mail by signal keywords", () => {
    const recruiter = message({
      subject: "Your application — AI Product Engineer",
      snippet: "We would like to invite you to a first conversation.",
    });
    const result = triageMessage(recruiter);
    expect(result.category).toBe("recruiter");
  });

  it("files bulk mail as noise even when it smells like jobs", () => {
    const digest = message({
      subject: "1,204 new jobs match your profile!!!",
      hasListUnsubscribe: true,
    });
    expect(triageMessage(digest).category).toBe("noise");
  });

  it("marks direct questions as needs-reply", () => {
    const colleague = message({
      snippet: "Can you take a look before the daily?",
    });
    expect(triageMessage(colleague).category).toBe("needs-reply");
  });
});

describe("triageInbox", () => {
  it("orders suspicious before recruiter before noise", () => {
    const inbox = triageInbox([
      message({ id: "bulk", hasListUnsubscribe: true }),
      message({ id: "phish", replyToAddress: "x@shady.net" }),
      message({ id: "rec", subject: "Interview invitation" }),
    ]);
    expect(inbox.map((entry) => entry.message.id)).toEqual([
      "phish",
      "rec",
      "bulk",
    ]);
  });
});
