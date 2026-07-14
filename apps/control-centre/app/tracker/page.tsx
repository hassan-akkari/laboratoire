import {
  addApplicationAction,
  setFollowUpAction,
  setStatusAction,
} from "@/lib/tracker/actions";
import {
  APPLICATION_STATUSES,
  isFollowUpOverdue,
  isOpen,
  sortForBoard,
} from "@/lib/tracker/schema";
import { listApplications } from "@/lib/tracker/store";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const applications = sortForBoard(await listApplications(), today);

  const open = applications.filter(isOpen);
  const overdue = applications.filter((app) => isFollowUpOverdue(app, today));
  const interviews = applications.filter((app) => app.status === "interview");

  return (
    <>
      <h1 className="page-title">Application tracker</h1>
      <p className="page-sub">
        Every recruiter exchange becomes a row; the board surfaces the
        follow-up you were about to forget. Data lives in{" "}
        <code className="mono">data/applications.json</code> — local, yours.
      </p>

      <div className="stat-row">
        <div className="stat">
          <b>{open.length}</b>
          <span>open</span>
        </div>
        <div className="stat">
          <b className={overdue.length > 0 ? "amber" : undefined}>
            {overdue.length}
          </b>
          <span>overdue follow-ups</span>
        </div>
        <div className="stat">
          <b>{interviews.length}</b>
          <span>in interview</span>
        </div>
      </div>

      <h2 className="section-title">Board</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company / role</th>
              <th>Stack</th>
              <th>Status</th>
              <th>Last contact</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const rowOverdue = isFollowUpOverdue(app, today);
              return (
                <tr key={app.id} className={rowOverdue ? "overdue" : undefined}>
                  <td>
                    <div className="title">{app.company}</div>
                    <div className="muted">
                      {app.role} · {app.location}
                    </div>
                    {app.notes && <div className="muted mono">{app.notes}</div>}
                  </td>
                  <td className="mono muted">{app.stack.join(", ")}</td>
                  <td>
                    <form action={setStatusAction} className="mono">
                      <input type="hidden" name="id" value={app.id} />
                      <select name="status" defaultValue={app.status}>
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>{" "}
                      <button className="btn small" type="submit">
                        set
                      </button>
                    </form>
                  </td>
                  <td className="mono muted">{app.lastContactAt ?? "—"}</td>
                  <td>
                    {rowOverdue && <span className="chip hot">overdue</span>}{" "}
                    <form action={setFollowUpAction} className="mono">
                      <input type="hidden" name="id" value={app.id} />
                      <input
                        type="date"
                        name="nextFollowUpAt"
                        defaultValue={app.nextFollowUpAt ?? ""}
                      />{" "}
                      <button className="btn small" type="submit">
                        set
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Add application</h2>
      <div className="panel">
        <form action={addApplicationAction}>
          <div className="form-grid">
            <input name="company" placeholder="Company" required />
            <input name="role" placeholder="Role" required />
            <input name="location" placeholder="Location (e.g. Zürich, CH)" required />
            <input name="source" placeholder="Source (indeed, referral…)" />
            <input name="stack" placeholder="Stack, comma-separated" />
            <input name="notes" placeholder="Notes" />
          </div>
          <p style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit">
              Track it
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
