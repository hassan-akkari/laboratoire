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

export type LeadEmailFields = {
  name: string;
  email: string;
  message: string | null;
  source: "contact_form" | "cal";
  phone?: string | null;
};

export async function sendLeadNotification(
  recipient: string,
  lead: LeadEmailFields,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey) {
    return { ok: false, error: "Resend not configured: RESEND_API_KEY is missing" };
  }
  if (!from) {
    return { ok: false, error: "Resend not configured: RESEND_FROM is missing" };
  }
  if (!recipient || !recipient.trim()) {
    return { ok: false, error: "No recipient address resolved from site_config" };
  }

  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = lead.phone ? escapeHtml(lead.phone) : "—";
  const safeMessage = lead.message ? escapeHtml(lead.message) : "(no message)";
  const sourceLabel = lead.source === "cal" ? "Cal.com booking" : "Contact form";

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: recipient,
    subject: `New lead from ${safeName} (${sourceLabel})`,
    html: `
      <p>You received a new lead via the ${sourceLabel}.</p>
      <ul>
        <li><strong>Name:</strong> ${safeName}</li>
        <li><strong>Email:</strong> ${safeEmail}</li>
        <li><strong>Phone:</strong> ${safePhone}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
    text:
      `New lead via ${sourceLabel}.\n` +
      `Name: ${lead.name}\n` +
      `Email: ${lead.email}\n` +
      `Phone: ${lead.phone ?? "—"}\n\n` +
      `Message:\n${lead.message ?? "(no message)"}`,
  });

  if (result.error) {
    return { ok: false, error: result.error.message ?? "Unknown Resend error" };
  }
  if (!result.data?.id) {
    return { ok: false, error: "Resend returned no message id" };
  }
  return { ok: true, id: result.data.id };
}
