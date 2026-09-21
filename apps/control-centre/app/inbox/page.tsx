import { gmailMockConnector } from "@/lib/connectors/gmail.mock";
import { triageInbox, type TriageCategory } from "@/lib/inbox/triage";

const CATEGORY_CHIP: Record<TriageCategory, { className: string; label: string }> = {
  suspicious: { className: "chip danger", label: "⚠ suspicious" },
  recruiter: { className: "chip hot", label: "recruiter" },
  "needs-reply": { className: "chip ice", label: "needs reply" },
  fyi: { className: "chip", label: "fyi" },
  noise: { className: "chip", label: "noise" },
};

export default async function InboxPage() {
  const messages = await gmailMockConnector.fetchInbox();
  const triaged = triageInbox(messages);
  const actionable = triaged.filter((entry) =>
    ["suspicious", "recruiter", "needs-reply"].includes(entry.category),
  );

  return (
    <>
      <h1 className="page-title">
        Inbox triage{" "}
        <span className={`chip ${gmailMockConnector.mode}`}>
          {gmailMockConnector.name} · {gmailMockConnector.mode}
        </span>
      </h1>
      <p className="page-sub">
        One pass, every morning: what needs an answer, what is a recruiter,
        what is noise — and what is pretending to be your bank. The classifier
        (<code className="mono">lib/inbox/triage.ts</code>) is rule-based and
        explains itself; suspicious always wins over polite.
      </p>

      <div className="stat-row">
        <div className="stat">
          <b>{triaged.length}</b>
          <span>messages</span>
        </div>
        <div className="stat">
          <b className={actionable.length > 0 ? "amber" : undefined}>
            {actionable.length}
          </b>
          <span>actionable</span>
        </div>
      </div>

      <h2 className="section-title">Triage</h2>
      <ul className="rows">
        {triaged.map(({ message, category, reasons }) => (
          <li className="row" key={message.id}>
            <span className="title">{message.from}</span>
            <span className={CATEGORY_CHIP[category].className}>
              {CATEGORY_CHIP[category].label}
            </span>
            <span className="meta">{message.receivedAt}</span>
            <span className="sub">
              <b>{message.subject}</b> — {message.snippet}
            </span>
            <span className="sub mono">↳ {reasons.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
