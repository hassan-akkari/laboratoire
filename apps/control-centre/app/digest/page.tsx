import { groupByArea, readWeeklyLog } from "@/lib/digest/git";

export const dynamic = "force-dynamic";

export default async function DigestPage() {
  const entries = await readWeeklyLog();
  const groups = groupByArea(entries);

  return (
    <>
      <h1 className="page-title">
        Weekly digest <span className="chip live">git · live</span>
      </h1>
      <p className="page-sub">
        The weekly review nobody has to write: the last 7 days of{" "}
        <code className="mono">git log</code> on this repo, grouped by area.
        Point it at Portal/Network too and it becomes the standup generator.
      </p>

      <div className="stat-row">
        <div className="stat">
          <b>{entries.length}</b>
          <span>commits this week</span>
        </div>
        <div className="stat">
          <b>{groups.size}</b>
          <span>areas touched</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="empty">Quiet week — nothing committed in the last 7 days.</p>
      ) : (
        [...groups.entries()].map(([area, commits]) => (
          <section key={area}>
            <h2 className="section-title">
              {area} — {commits.length}
            </h2>
            <ul className="rows">
              {commits.map((commit) => (
                <li className="row" key={commit.hash}>
                  <span className="mono muted">{commit.hash}</span>
                  <span>{commit.subject}</span>
                  <span className="meta">{commit.date}</span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
