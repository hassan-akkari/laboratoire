import { readVaultStatus } from "@/lib/garden/vault";

export const dynamic = "force-dynamic";

const STAGE_ICON: Record<string, string> = {
  seedling: "🌱",
  budding: "🌿",
  evergreen: "🌲",
};

export default async function GardenPage() {
  const status = await readVaultStatus();
  const inSync =
    status.pendingPublish.length === 0 && status.pendingRemoval.length === 0;

  return (
    <>
      <h1 className="page-title">
        Garden pipeline <span className="chip live">vault · live</span>
      </h1>
      <p className="page-sub">
        Reads the actual vault at{" "}
        <code className="mono">{status.vaultDir}</code>
        {status.isSampleVault && " (sample vault — set VAULT_DIR for the real one)"}{" "}
        and diffs it against what itshassan.it currently ships.
      </p>

      {status.error && (
        <p className="page-sub amber" style={{ marginTop: 12 }}>
          ⚠ {status.error}
        </p>
      )}

      <div className="stat-row">
        <div className="stat">
          <b>{status.notes.length}</b>
          <span>notes in vault</span>
        </div>
        <div className="stat">
          <b>{status.publishedCount}</b>
          <span>publishable</span>
        </div>
        <div className="stat">
          <b>{status.privateCount}</b>
          <span>private</span>
        </div>
        <div className="stat">
          <b className={inSync ? undefined : "amber"}>
            {inSync ? "✓" : status.pendingPublish.length + status.pendingRemoval.length}
          </b>
          <span>{inSync ? "site in sync" : "pending sync"}</span>
        </div>
      </div>

      {!inSync && (
        <div className="panel" style={{ marginTop: 18 }}>
          <h2>Next `pnpm -F docs vault:sync` would…</h2>
          <ul className="rows">
            {status.pendingPublish.map((slug) => (
              <li className="row" key={slug}>
                <span className="chip ok">publish</span>
                <span className="mono">{slug}</span>
              </li>
            ))}
            {status.pendingRemoval.map((slug) => (
              <li className="row" key={slug}>
                <span className="chip danger">remove</span>
                <span className="mono">{slug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="section-title">Notes</h2>
      <ul className="rows">
        {status.notes.map((note) => (
          <li className="row" key={note.file}>
            <span className="title">
              {STAGE_ICON[note.stage] ?? "•"} {note.title}
            </span>
            {note.publish ? (
              <span className="chip ok">public · {note.stage}</span>
            ) : (
              <span className="chip">private</span>
            )}
            <span className="meta">{note.slug}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
