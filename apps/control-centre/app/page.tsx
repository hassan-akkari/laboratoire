import Link from "next/link";

import { calendarMockConnector } from "@/lib/connectors/calendar.mock";
import { gmailMockConnector } from "@/lib/connectors/gmail.mock";
import { indeedMockConnector } from "@/lib/connectors/indeed.mock";
import { readWeeklyLog } from "@/lib/digest/git";
import { readVaultStatus } from "@/lib/garden/vault";
import { triageInbox } from "@/lib/inbox/triage";
import { defaultScoutConfig } from "@/lib/scout/config";
import { buildShortlist } from "@/lib/scout/score";
import { isFollowUpOverdue, sortForBoard } from "@/lib/tracker/schema";
import { listApplications } from "@/lib/tracker/store";

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
  const today = new Date().toISOString().slice(0, 10);

  // One screen instead of four apps — everything is fetched here, composed
  // from the same modules the detail pages use.
  const [events, inbox, listings, applications, weekLog, vault] =
    await Promise.all([
      calendarMockConnector.fetchToday(),
      gmailMockConnector.fetchInbox(),
      indeedMockConnector.fetchListings(),
      listApplications(),
      readWeeklyLog(),
      readVaultStatus(),
    ]);

  const triaged = triageInbox(inbox);
  const suspicious = triaged.filter((entry) => entry.category === "suspicious");
  const needsAttention = triaged.filter((entry) =>
    ["recruiter", "needs-reply"].includes(entry.category),
  );
  const hot = buildShortlist(listings, defaultScoutConfig).filter(
    (entry) => entry.tier === "hot",
  );
  const overdue = sortForBoard(applications, today).filter((app) =>
    isFollowUpOverdue(app, today),
  );
  const gardenPending =
    vault.pendingPublish.length + vault.pendingRemoval.length;

  const burning = suspicious.length + overdue.length;

  return (
    <>
      <h1 className="page-title">Morning briefing</h1>
      <p className="page-sub">
        {today} ·{" "}
        {burning > 0 ? (
          <span className="amber">
            {burning} thing{burning === 1 ? "" : "s"} need
            {burning === 1 ? "s" : ""} you first
          </span>
        ) : (
          "nothing is on fire"
        )}
        {" — "}the rest can wait for coffee.
      </p>

      <div className="grid">
        <section className="panel">
          <h2>
            ☀️ Today <Link href="/inbox">calendar</Link>
          </h2>
          <ul className="rows">
            {events.map((event) => (
              <li className="row" key={event.id}>
                <span className="mono muted">
                  {event.startsAt}–{event.endsAt}
                </span>
                <span className="title">{event.title}</span>
                {event.location && <span className="meta">{event.location}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>
            📬 Inbox <Link href="/inbox">triage →</Link>
          </h2>
          {suspicious.map((entry) => (
            <p key={entry.message.id}>
              <span className="chip danger">⚠ suspicious</span>{" "}
              <b>{entry.message.subject}</b>
              <br />
              <span className="muted mono">{entry.reasons[0]}</span>
            </p>
          ))}
          <ul className="rows">
            {needsAttention.map((entry) => (
              <li className="row" key={entry.message.id}>
                <span className="title">{entry.message.from}</span>
                <span className="chip ice">{entry.category}</span>
                <span className="sub">{entry.message.subject}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>
            🔭 Scout <Link href="/scout">shortlist →</Link>
          </h2>
          {hot.length === 0 ? (
            <p className="empty">No hot listings this morning.</p>
          ) : (
            <ul className="rows">
              {hot.map((entry) => (
                <li className="row" key={entry.listing.id}>
                  <span className="title">{entry.listing.company}</span>
                  <span className="chip hot">score {entry.score}</span>
                  <span className="sub">
                    {entry.listing.title} · {entry.listing.location}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>
            📋 Follow-ups <Link href="/tracker">tracker →</Link>
          </h2>
          {overdue.length === 0 ? (
            <p className="empty">Nothing overdue. Clean board.</p>
          ) : (
            <ul className="rows">
              {overdue.map((app) => (
                <li className="row" key={app.id}>
                  <span className="title">{app.company}</span>
                  <span className="chip hot">due {app.nextFollowUpAt}</span>
                  <span className="sub">
                    {app.role} · last contact {app.lastContactAt ?? "never"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>
            🌱 Garden <Link href="/garden">pipeline →</Link>
          </h2>
          <p className="muted">
            {vault.publishedCount} public / {vault.notes.length} notes ·{" "}
            {gardenPending === 0 ? (
              <span style={{ color: "var(--ok)" }}>site in sync</span>
            ) : (
              <span className="amber">{gardenPending} pending sync</span>
            )}
          </p>
        </section>

        <section className="panel">
          <h2>
            🗞️ This week <Link href="/digest">digest →</Link>
          </h2>
          <p className="muted">
            {weekLog.length} commits in the last 7 days
            {weekLog[0] && (
              <>
                {" "}
                — latest: <span className="mono">{weekLog[0].subject}</span>
              </>
            )}
          </p>
        </section>
      </div>
    </>
  );
}
