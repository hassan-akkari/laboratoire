import type { NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminSession";
import { updateSiteConfig } from "@/lib/admin/siteConfig";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const putSchema = z.object({
  phone: z.string().trim().max(120).optional(),
  contactEmail: z.string().trim().email().optional(),
  notifyEmail: z.union([z.string().trim().email(), z.null()]).optional(),
});

export async function PUT(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const config = await updateSiteConfig(parsed.data);
  if (!config) {
    return Response.json({ error: "Site config row missing" }, { status: 500 });
  }
  return Response.json({ config });
}
