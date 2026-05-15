import type { NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminSession";
import { updateLead } from "@/lib/admin/leads";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  notes: z.string().nullable().optional(),
});

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest | Request, ctx: RouteCtx) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { id } = await ctx.params;
  const lead = await updateLead(id, parsed.data);
  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }
  return Response.json({ lead });
}
