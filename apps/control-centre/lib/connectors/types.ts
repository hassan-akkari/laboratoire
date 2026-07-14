/**
 * Connector contracts. Every external source (job feed, mailbox, calendar)
 * hides behind one of these interfaces, and every implementation declares
 * itself `mock` or `live` — the UI renders that flag, so it is always honest
 * about what is real. Wiring the real Indeed/Gmail/Calendar later means
 * writing one new adapter per interface; pages and business logic (scoring,
 * triage, briefing) don't change.
 */

export type ConnectorMode = "mock" | "live";

/* ---------- job feed ---------- */

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string; // ISO-ish: "CH", "NL", "DE", ...
  remote: "onsite" | "hybrid" | "remote";
  stack: string[];
  /** Yearly, in the listing's currency; absent when the ad hides it. */
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  postedAt: string; // YYYY-MM-DD
  url: string;
  summary: string;
};

export interface JobFeedConnector {
  readonly name: string;
  readonly mode: ConnectorMode;
  fetchListings(): Promise<JobListing[]>;
}

/* ---------- mailbox ---------- */

export type MailMessage = {
  id: string;
  from: string; // display name
  fromAddress: string;
  replyToAddress?: string; // only when it differs from fromAddress
  subject: string;
  snippet: string;
  receivedAt: string; // YYYY-MM-DD HH:mm
  hasListUnsubscribe: boolean;
};

export interface MailConnector {
  readonly name: string;
  readonly mode: ConnectorMode;
  fetchInbox(): Promise<MailMessage[]>;
}

/* ---------- calendar ---------- */

export type CalendarEvent = {
  id: string;
  title: string;
  startsAt: string; // HH:mm — briefing only cares about today
  endsAt: string;
  location?: string;
};

export interface CalendarConnector {
  readonly name: string;
  readonly mode: ConnectorMode;
  fetchToday(): Promise<CalendarEvent[]>;
}
