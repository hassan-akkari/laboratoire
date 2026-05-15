import { Resend } from "resend";

export type SiteConfigEmail = {
  contactEmail: string;
  notifyEmail: string | null;
};

/**
 * Single source of truth for which email address admin notifications go to.
 * Spec: site_config.notify_email overrides contact_email; null/empty falls back.
 */
export function getNotificationRecipient(config: SiteConfigEmail): string {
  const candidate = config.notifyEmail?.trim();
  return candidate ? candidate : config.contactEmail;
}

/**
 * Minimal HTML escaper for values interpolated into email bodies. Phase 2
 * recipients are admin-controlled so the realistic attack surface is zero,
 * but the Phase 3 lead-notification template will inline unauthenticated
 * lead.name / lead.message — getting the escaping pattern right here means
 * future contributors copy the safe shape, not the unsafe one.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

/**
 * Sends a "this is a test" email to the admin's resolved notification address.
 * Used by the /admin/site-config "Send test email" button. Returns a plain
 * result object so the UI can render { ok: false, error } without throwing.
 */
export async function sendTestEmail(recipient: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Resend not configured (set RESEND_API_KEY and RESEND_FROM)",
    };
  }

  const resend = new Resend(apiKey);
  const safeRecipient = escapeHtml(recipient);
  const { data, error } = await resend.emails.send({
    from,
    to: recipient,
    subject: "Admin test email",
    html: `
      <p>This is a test email from your admin panel.</p>
      <p>If you received this, Resend is configured correctly and ` +
      `<code>getNotificationRecipient()</code> resolved to <strong>${safeRecipient}</strong>.</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message ?? "unknown Resend error" };
  }
  return { ok: true, id: data?.id };
}
