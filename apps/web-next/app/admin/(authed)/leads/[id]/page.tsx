import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLeadById, updateLead, type LeadStatus } from "@/lib/admin/leads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

const STATUS_VALUES: ReadonlySet<LeadStatus> = new Set(["new", "contacted", "closed"]);

async function saveLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const rawStatus = String(formData.get("status") ?? "");
  const notesRaw = formData.get("notes");
  const notes = typeof notesRaw === "string" && notesRaw.trim() !== "" ? notesRaw : null;
  if (!id) return;
  const status = STATUS_VALUES.has(rawStatus as LeadStatus) ? (rawStatus as LeadStatus) : undefined;
  await updateLead(id, { ...(status ? { status } : {}), notes });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/leads/${id}?saved=1`);
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const createdAt = new Date(lead.createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h1 style={{ margin: 0 }}>{lead.name}</h1>
          <p style={{ margin: 0, color: "var(--app-muted)" }}>
            Received {createdAt} · <span className={`tag tag--${lead.source}`}>{lead.source}</span>
          </p>
        </div>
        <Link className="button button--flat" href="/admin">← Back to leads</Link>
      </header>

      {saved === "1" ? <div className="notice ok">Saved.</div> : null}

      <div className="layout-two">
        <div className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Contact</h2>
          <div className="summary-grid">
            <div className="summary-row"><span>Email</span><strong>{lead.email}</strong></div>
            <div className="summary-row"><span>Phone</span><strong>{lead.phone ?? "—"}</strong></div>
            {lead.scheduledAt ? (
              <div className="summary-row">
                <span>Scheduled</span>
                <strong>{new Date(lead.scheduledAt).toLocaleString("en-GB")}</strong>
              </div>
            ) : null}
            {lead.bookingStatus ? (
              <div className="summary-row">
                <span>Booking status</span>
                <span className={`tag tag--${lead.bookingStatus}`}>{lead.bookingStatus}</span>
              </div>
            ) : null}
            {lead.sourceDetail ? (
              <div className="summary-row"><span>Source detail</span><strong>{lead.sourceDetail}</strong></div>
            ) : null}
          </div>

          {lead.message ? (
            <>
              <h3 style={{ margin: "10px 0 0", fontSize: 14, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Message
              </h3>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{lead.message}</p>
            </>
          ) : null}
        </div>

        <div className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Admin</h2>
          <form action={saveLead} className="form-grid">
            <input type="hidden" name="id" value={lead.id} />
            <label className="form-label">
              Status
              <select className="field" name="status" defaultValue={lead.status}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="form-label">
              Notes
              <textarea
                className="field"
                name="notes"
                rows={6}
                defaultValue={lead.notes ?? ""}
                placeholder="Anything you want to remember about this lead…"
              />
            </label>
            <div className="button-row">
              <button className="button" type="submit">Save</button>
            </div>
          </form>

          {lead.notificationError ? (
            <div className="notice err">
              <strong>Notification error:</strong> {lead.notificationError}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
