import { AppButton, AppCard } from "@laboratoire/ui";

export default function AdminNotFound() {
  return (
    <AppCard
      style={{ maxWidth: 560, margin: "60px auto", padding: 28, display: "grid", gap: 14 }}
    >
      <h1 style={{ margin: 0 }}>Admin route not found</h1>
      <p style={{ margin: 0, color: "var(--app-muted)" }}>
        The URL you tried isn&apos;t a valid admin route. Use the links below.
      </p>
      <div className="button-row">
        {/* `as="a"` -> v3 button-styled anchors; bordered/flat -> v3 secondary/tertiary. */}
        <AppButton as="a" href="/admin">Leads</AppButton>
        <AppButton as="a" variant="bordered" href="/admin/site-config">Site config</AppButton>
        <AppButton as="a" variant="flat" href="/admin/login">Sign in</AppButton>
      </div>
    </AppCard>
  );
}
