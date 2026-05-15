import Link from "next/link";
import { getLeads, type LeadSource, type LeadStatus } from "@/lib/admin/leads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ status?: string; source?: string }>;

const STATUS_VALUES: ReadonlySet<LeadStatus> = new Set(["new", "contacted", "closed"]);
const SOURCE_VALUES: ReadonlySet<LeadSource> = new Set(["contact_form", "cal"]);

function parseStatus(v: string | undefined): LeadStatus | undefined {
  return v && STATUS_VALUES.has(v as LeadStatus) ? (v as LeadStatus) : undefined;
}
function parseSource(v: string | undefined): LeadSource | undefined {
  return v && SOURCE_VALUES.has(v as LeadSource) ? (v as LeadSource) : undefined;
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const source = parseSource(params.source);

  // Two queries: all rows (for stat cards), filtered rows (for the table).
  // Acceptable for v1; spec flags pagination as future work after 50 rows.
  const [all, filtered] = await Promise.all([getLeads(), getLeads({ status, source })]);

  const stats = {
    new: all.filter((l) => l.status === "new").length,
    contacted: all.filter((l) => l.status === "contacted").length,
    closed: all.filter((l) => l.status === "closed").length,
    cal: all.filter((l) => l.source === "cal").length,
  };

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Leads</h1>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          {filtered.length} of {all.length} {all.length === 1 ? "lead" : "leads"} shown
        </p>
      </header>

      <div className="stat-card-row">
        <div className="stat-card">
          <span className="stat-card__label">New</span>
          <span className="stat-card__value">{stats.new}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Contacted</span>
          <span className="stat-card__value">{stats.contacted}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Closed</span>
          <span className="stat-card__value">{stats.closed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Cal bookings</span>
          <span className="stat-card__value">{stats.cal}</span>
        </div>
      </div>

      <form method="GET" className="admin-filter-row" action="/admin">
        <label className="form-label">
          Status
          <select className="field" name="status" defaultValue={status ?? ""}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="form-label">
          Source
          <select className="field" name="source" defaultValue={source ?? ""}>
            <option value="">All</option>
            <option value="contact_form">Contact form</option>
            <option value="cal">Cal.com</option>
          </select>
        </label>
        <button className="button button--bordered" type="submit">Apply</button>
        <Link className="button button--flat" href="/admin">Clear</Link>
      </form>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          No leads match these filters.
          {all.length === 0
            ? " Once the Phase 3 contact form is wired up, leads will appear here."
            : ""}
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Booking</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="lead-row" onClick={() => undefined}>
                <td>
                  <Link href={`/admin/leads/${l.id}`}>
                    {new Date(l.createdAt).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Link>
                </td>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td><span className={`tag tag--${l.source}`}>{l.source}</span></td>
                <td><span className={`tag tag--${l.status}`}>{l.status}</span></td>
                <td>
                  {l.bookingStatus ? (
                    <span className={`tag tag--${l.bookingStatus}`}>{l.bookingStatus}</span>
                  ) : (
                    <span style={{ color: "var(--app-muted)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
