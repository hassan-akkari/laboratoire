"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/adminSession";
import { updateSiteConfig } from "@/lib/admin/siteConfig";

const patchSchema = z.object({
  phone: z.string().trim().max(120),
  contactEmail: z.string().trim().email(),
  notifyEmail: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.union([z.string().email(), z.null()])),
});

/**
 * Admin-only. Server Actions execute BEFORE the `(authed)/layout.tsx` render
 * gate and the proxy only checks cookie *presence*, so the session must be
 * validated (unsealed) here, before any parsing or DB access.
 */
export async function saveConfig(formData: FormData): Promise<void> {
  await requireAdminSession();
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
