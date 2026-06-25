import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AppButton, AppCard, AppInput } from "@laboratoire/ui";
import { getSiteConfig, updateSiteConfig } from "@/lib/admin/siteConfig";
import { TestEmailButton } from "../../_components/TestEmailButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const patchSchema = z.object({
  phone: z.string().trim().max(120),
  contactEmail: z.string().trim().email(),
  notifyEmail: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.union([z.string().email(), z.null()])),
});

async function saveConfig(formData: FormData) {
  "use server";
  const parsed = patchSchema.safeParse({
    phone: formData.get("phone"),
    contactEmail: formData.get("contactEmail"),
    notifyEmail: formData.get("notifyEmail"),
  });
  if (!parsed.success) {
    redirect("/admin/site-config?error=invalid");
  }
  await updateSiteConfig(parsed.data);
  revalidatePath("/admin/site-config");
  redirect("/admin/site-config?saved=1");
}

export default async function SiteConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const config = await getSiteConfig();

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Site config</h1>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          Public contact info shown on itshassan.it. Notification override controls where lead emails are sent.
        </p>
      </header>

      {saved === "1" ? <div className="notice ok">Saved.</div> : null}
      {error === "invalid" ? <div className="notice err">Invalid input — check the fields.</div> : null}

      {/* v3 wrapper: AppCard hosts the server-action form (action stays on the
          <form>, name= contracts preserved). Mirrors the checkout funnel pattern. */}
      <AppCard style={{ padding: 20 }}>
        <form action={saveConfig} className="form-grid">
          <label className="form-label">
            Phone (public)
            <AppInput
              type="tel"
              name="phone"
              defaultValue={config?.phone ?? ""}
              placeholder="+39 …"
              aria-label="Phone (public)"
            />
          </label>
          <label className="form-label">
            Contact email (public — also default notification destination)
            <AppInput
              type="email"
              name="contactEmail"
              defaultValue={config?.contactEmail ?? ""}
              required
              aria-label="Contact email"
            />
          </label>
          <label className="form-label">
            Notify email override (optional — admin only, hidden from public)
            <AppInput
              type="email"
              name="notifyEmail"
              defaultValue={config?.notifyEmail ?? ""}
              placeholder="Leave blank to reuse contact email"
              aria-label="Notify email override"
            />
          </label>
          <div className="button-row">
            <AppButton type="submit">Save</AppButton>
          </div>
        </form>
      </AppCard>

      <AppCard style={{ padding: 20, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Send test email</h2>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          Sends a fixed test message to the resolved notification address (notify_email ?? contact_email).
          Use this to confirm Resend credentials work end-to-end before leads start flowing in.
        </p>
        <TestEmailButton />
      </AppCard>
    </section>
  );
}
