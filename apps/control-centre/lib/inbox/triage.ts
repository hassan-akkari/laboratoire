import type { MailMessage } from "../connectors/types";

/**
 * Rule-based morning triage: deterministic, explainable, testable. Rules run
 * in order of severity — a message is classified by the FIRST bucket it
 * falls into (a phish praising your "application" must never be filed under
 * recruiter). An LLM pass can slot in later for the ambiguous middle, but
 * the guardrail (suspicious-first) stays rule-based on purpose.
 */

export type TriageCategory =
  | "suspicious"
  | "recruiter"
  | "needs-reply"
  | "noise"
  | "fyi";

export type TriagedMessage = {
  message: MailMessage;
  category: TriageCategory;
  reasons: string[];
};

/** Brands phishers imitate + the domains actually allowed to use them. */
const PROTECTED_BRANDS: Record<string, string[]> = {
  "american express": ["americanexpress.com", "aexp.com"],
  amex: ["americanexpress.com", "aexp.com"],
  paypal: ["paypal.com"],
  postfinance: ["postfinance.ch"],
};

const URGENCY_PHRASES = [
  "within 24 hours",
  "immediately",
  "suspended",
  "verify your identity",
  "unusual activity",
];

const RECRUITER_HINTS = [
  "application",
  "interview",
  "hiring",
  "recruiter",
  "position",
  "opportunity",
  "next steps",
  "talent",
];

function domainOf(address: string): string {
  return address.split("@")[1]?.toLowerCase() ?? "";
}

export function triageMessage(message: MailMessage): TriagedMessage {
  const reasons: string[] = [];
  const text = `${message.from} ${message.subject} ${message.snippet}`.toLowerCase();
  const senderDomain = domainOf(message.fromAddress);

  /* -- suspicious first: everything else only runs on mail we trust -- */

  if (message.replyToAddress) {
    reasons.push(
      `reply-to (${domainOf(message.replyToAddress)}) differs from sender (${senderDomain})`,
    );
  }
  for (const [brand, officialDomains] of Object.entries(PROTECTED_BRANDS)) {
    const claimsBrand = text.includes(brand);
    const isOfficial = officialDomains.some(
      (domain) => senderDomain === domain || senderDomain.endsWith(`.${domain}`),
    );
    if (claimsBrand && !isOfficial) {
      reasons.push(`claims "${brand}" but sends from ${senderDomain}`);
      break;
    }
  }
  const urgency = URGENCY_PHRASES.filter((phrase) => text.includes(phrase));
  if (urgency.length >= 2) {
    reasons.push(`pressure language: ${urgency.join(", ")}`);
  }
  if (reasons.length > 0) {
    return { message, category: "suspicious", reasons };
  }

  /* -- recruiter -- */
  const recruiterHits = RECRUITER_HINTS.filter((hint) => text.includes(hint));
  if (recruiterHits.length >= 1 && !message.hasListUnsubscribe) {
    return {
      message,
      category: "recruiter",
      reasons: [`recruiting signals: ${recruiterHits.join(", ")}`],
    };
  }

  /* -- noise: anything with an unsubscribe header is a broadcast -- */
  if (message.hasListUnsubscribe) {
    return {
      message,
      category: "noise",
      reasons: ["bulk mail (List-Unsubscribe header)"],
    };
  }

  /* -- needs a human answer -- */
  if (message.snippet.includes("?") || message.subject.toLowerCase().startsWith("re:")) {
    return {
      message,
      category: "needs-reply",
      reasons: ["direct question / ongoing thread"],
    };
  }

  return { message, category: "fyi", reasons: ["no action signals"] };
}

const CATEGORY_ORDER: TriageCategory[] = [
  "suspicious",
  "recruiter",
  "needs-reply",
  "fyi",
  "noise",
];

export function triageInbox(messages: MailMessage[]): TriagedMessage[] {
  return messages
    .map(triageMessage)
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
        b.message.receivedAt.localeCompare(a.message.receivedAt),
    );
}
