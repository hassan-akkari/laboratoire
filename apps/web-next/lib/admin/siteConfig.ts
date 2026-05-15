import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import type { SiteConfig } from "@/lib/db/schema";

export type SiteConfigPatch = {
  phone?: string;
  contactEmail?: string;
  notifyEmail?: string | null;
};

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const rows = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, 1))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateSiteConfig(patch: SiteConfigPatch): Promise<SiteConfig | null> {
  const rows = await db
    .update(schema.siteConfig)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(schema.siteConfig.id, 1))
    .returning();
  return rows[0] ?? null;
}
