import { and, desc, eq, type SQL } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import type { Lead } from "@/lib/db/schema";

export type LeadStatus = "new" | "contacted" | "closed";
export type LeadSource = "contact_form" | "cal";

export type LeadsFilters = {
  status?: LeadStatus;
  source?: LeadSource;
};

export type LeadPatch = {
  status?: LeadStatus;
  notes?: string | null;
};

export async function getLeads(filters: LeadsFilters = {}): Promise<Lead[]> {
  const conds: SQL[] = [];
  if (filters.status) conds.push(eq(schema.leads.status, filters.status));
  if (filters.source) conds.push(eq(schema.leads.source, filters.source));

  const where: SQL | undefined =
    conds.length === 0 ? undefined : conds.length === 1 ? conds[0] : and(...conds);

  const base = db.select().from(schema.leads);
  const filtered = where ? base.where(where) : base;
  const rows = await filtered.orderBy(desc(schema.leads.createdAt));
  return rows;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const rows = await db
    .select()
    .from(schema.leads)
    .where(eq(schema.leads.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateLead(
  id: string,
  patch: LeadPatch,
): Promise<Lead | null> {
  const rows = await db
    .update(schema.leads)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(schema.leads.id, id))
    .returning();
  return rows[0] ?? null;
}
