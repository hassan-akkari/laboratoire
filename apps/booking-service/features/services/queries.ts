import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, dbReady, schema } from "@/lib/db/client";
import type { Service } from "@/lib/db/schema";
import { DEMO_SERVICES } from "@/lib/demo-data";

// This file is the "repository" layer (your Dapper/repo equivalent). Pages and
// Server Actions call these — they never touch Drizzle/SQL directly. Keeping DB
// access here means the data shape is defined in one place and pages stay thin.

// PREVIEW FALLBACK (remove-once-Neon): when no DB is connected, serve the demo
// catalogue so /services renders real cards. Once DATABASE_URL is set, dbReady
// is true and these functions read Neon instead. Synthesizes the DB-only fields
// (id/timestamps) so the UI shape matches a real row.
function mockServices(): Service[] {
  const now = new Date();
  return DEMO_SERVICES.map((s, i) => ({
    id: `demo-${i + 1}`,
    title: s.title,
    slug: s.slug,
    description: s.description ?? "",
    category: s.category ?? null,
    durationMin: s.durationMin ?? 60,
    priceFromCents: s.priceFromCents ?? 0,
    priceToCents: s.priceToCents ?? null,
    imageUrl: s.imageUrl ?? null,
    active: true,
    sortOrder: s.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  }));
}

/** Public catalogue: active services, ordered for display. */
export async function listActiveServices(): Promise<Service[]> {
  if (!dbReady) return mockServices();
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.active, true))
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.title));
}

/** Single active service by slug (for /services/[slug]). Null if not found. */
export async function getActiveServiceBySlug(
  slug: string,
): Promise<Service | null> {
  if (!dbReady) return mockServices().find((s) => s.slug === slug) ?? null;
  const rows = await db
    .select()
    .from(schema.services)
    .where(and(eq(schema.services.slug, slug), eq(schema.services.active, true)))
    .limit(1);
  return rows[0] ?? null;
}
