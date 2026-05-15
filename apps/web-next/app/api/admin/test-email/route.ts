import type { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/adminSession";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { getNotificationRecipient, sendTestEmail } from "@/lib/email";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getSiteConfig();
  if (!config) {
    return Response.json({ error: "Site config row missing — re-run db:seed" }, { status: 500 });
  }

  const recipient = getNotificationRecipient({
    contactEmail: config.contactEmail,
    notifyEmail: config.notifyEmail,
  });
  const result = await sendTestEmail(recipient);

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, recipient, id: result.id });
}
