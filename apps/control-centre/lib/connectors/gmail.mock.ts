import type { MailConnector, MailMessage } from "./types";

/**
 * Mock inbox — the message MIX is what matters: a recruiter thread, a real
 * reply-needed mail, newsletters, an automated notification, and a brand
 * lookalike phish (the fake-AmEx memorial). The triage rules in
 * lib/inbox/triage.ts must sort all of these correctly.
 */

const MESSAGES: MailMessage[] = [
  {
    id: "mail-001",
    from: "Nadia Kuypers",
    fromAddress: "n.kuypers@grachtwerklabs.nl",
    subject: "Re: Full-stack Engineer — next steps",
    snippet:
      "Thanks for your patience! Could you share your availability for a 45-minute technical screen next week?",
    receivedAt: "2026-07-14 08:12",
    hasListUnsubscribe: false,
  },
  {
    id: "mail-002",
    from: "American Express Alerts",
    fromAddress: "security@arnexcard-alerts.com",
    replyToAddress: "verify@secure-hold-review.net",
    subject: "Urgent: your card has been temporarily suspended",
    snippet:
      "We detected unusual activity. Verify your identity within 24 hours to avoid permanent suspension.",
    receivedAt: "2026-07-14 06:47",
    hasListUnsubscribe: false,
  },
  {
    id: "mail-003",
    from: "Marco (Portal team)",
    fromAddress: "marco@sibyllanetwork.com",
    subject: "Storybook broken on main?",
    snippet:
      "Hey, after yesterday's merge the Storybook build fails locally for me — can you take a look before the daily?",
    receivedAt: "2026-07-14 07:55",
    hasListUnsubscribe: false,
  },
  {
    id: "mail-004",
    from: "This Week in React",
    fromAddress: "hello@thisweekinreact.dev",
    subject: "#243 — React 19.3, Next 16.2, and the compiler goes stable",
    snippet: "The weekly React newsletter. This week: compiler updates…",
    receivedAt: "2026-07-14 05:30",
    hasListUnsubscribe: true,
  },
  {
    id: "mail-005",
    from: "Talent @ Limmat Intelligence",
    fromAddress: "talent@limmat-intelligence.ch",
    subject: "Your application — AI Product Engineer",
    snippet:
      "We received your application and would like to invite you to a first conversation with the hiring manager.",
    receivedAt: "2026-07-13 17:40",
    hasListUnsubscribe: false,
  },
  {
    id: "mail-006",
    from: "GitHub",
    fromAddress: "notifications@github.com",
    subject: "[laboratoire] Vercel deployment succeeded",
    snippet: "Deployment for itshassan.it completed successfully.",
    receivedAt: "2026-07-14 04:02",
    hasListUnsubscribe: false,
  },
  {
    id: "mail-007",
    from: "Dev Jobs Weekly",
    fromAddress: "digest@devjobsweekly.io",
    subject: "1,204 new jobs match your profile!!!",
    snippet: "Top matches this week: Senior PHP Developer…",
    receivedAt: "2026-07-13 22:10",
    hasListUnsubscribe: true,
  },
];

export const gmailMockConnector: MailConnector = {
  name: "Gmail",
  mode: "mock",
  async fetchInbox(): Promise<MailMessage[]> {
    return MESSAGES;
  },
};
