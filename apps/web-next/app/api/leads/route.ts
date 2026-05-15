import type { NextRequest } from "next/server";
import { z } from "zod";
import { createLead, recordLeadNotification } from "@/lib/admin/leads";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { getNotificationRecipient, sendLeadNotification } from "@/lib/email";
import { isAllowedPublicOrigin, withCors } from "@/lib/origin";

export const runtime = "nodejs";

const MIN_SUBMIT_DELAY_MS = 3000;

const intakeSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  company_website: z.string().optional(),
  started_at: z.number(),
  privacy_accepted: z.boolean().refine((v) => v === true, {
    message: "Privacy consent is required",
  }),
});

function silent200(origin: string | null): Response {
  return withCors(Response.json({ ok: true }), origin, "public");
}

export async function OPTIONS(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return withCors(new Response(null, { status: 204 }), origin, "public");
}

export async function POST(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return withCors(
      Response.json({ error: "Invalid payload" }, { status: 400 }),
      origin,
      "public",
    );
  }

  // Anti-spam (silent — never give bots a signal to retune).
  if (parsed.data.company_website && parsed.data.company_website.trim() !== "") {
    return silent200(origin);
  }
  if (Date.now() - parsed.data.started_at < MIN_SUBMIT_DELAY_MS) {
    return silent200(origin);
  }

  const privacyVersion = process.env.PRIVACY_VERSION ?? "v1-2026-05";
  const lead = await createLead({
    source: "contact_form",
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    privacyVersion,
  });
  if (!lead) {
    return withCors(
      Response.json({ error: "Lead insert failed" }, { status: 500 }),
      origin,
      "public",
    );
  }

  // DB is truth — try to notify but don't fail the request if Resend is down.
  const config = await getSiteConfig().catch(() => null);
  if (config) {
    const recipient = getNotificationRecipient(config);
    const result = await sendLeadNotification(recipient, {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      source: "contact_form",
      phone: null,
    });
    try {
      await recordLeadNotification(lead.id, result);
    } catch {
      // Notification bookkeeping failure is non-fatal — lead is already saved.
    }
  } else {
    try {
      await recordLeadNotification(lead.id, {
        ok: false,
        error: "site_config not seeded — no recipient resolved",
      });
    } catch {
      // non-fatal
    }
  }

  return silent200(origin);
}
