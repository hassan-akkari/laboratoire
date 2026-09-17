"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { updateLead, type LeadStatus } from "@/lib/admin/leads";

const STATUS_VALUES: ReadonlySet<LeadStatus> = new Set(["new", "contacted", "closed"]);

/**
 * Admin-only. Server Actions execute BEFORE the `(authed)/layout.tsx` render
 * gate and the proxy only checks cookie *presence*, so the session must be
 * validated (unsealed) here, before any parsing or DB access.
 */
export async function saveLead(formData: FormData): Promise<void> {
  await requireAdminSession();
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
