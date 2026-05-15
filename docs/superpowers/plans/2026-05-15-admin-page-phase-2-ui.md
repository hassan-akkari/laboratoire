# Admin Page — Phase 2 (UI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin UI on top of the Phase 1 foundation so that Hassan can sign in at `/admin/login`, see leads + stat cards at `/admin`, open a lead detail at `/admin/leads/[id]` to edit status/notes, and edit `phone` / `contact_email` / `notify_email` at `/admin/site-config` (with a working "Send test email" button via Resend).

**Architecture:** Next.js 16 App Router with server components for the auth-gated pages, a small `_components/` folder for the few client islands (login form, logout button, test-email button), a thin service layer in `lib/admin/` (leads + siteConfig) that drizzle calls go through, and three new admin API routes (`PATCH /api/admin/leads/[id]`, `PUT /api/admin/site-config`, `POST /api/admin/test-email`) that all share the same service-layer functions. Auth uses the existing `requireAdminSession()` from Phase 1. Pages and login form live under route groups so the login page can opt out of the authenticated shell layout.

**Tech Stack:** Next.js 16.1.6 (App Router, Node.js runtime), React 19, drizzle-orm + `@neondatabase/serverless` (existing), iron-session via `lib/adminSession.ts` (existing), `resend` (installed in Phase 1, now used), `zod` (existing).

**Spec reference:** [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md). This plan covers build-order steps 5, 6, and 7 of the spec (admin shell + leads list, lead detail + PATCH, site-config + PUT + test email). Phases 3-5 are separate plans.

**Phase 1 reference:** [`docs/superpowers/plans/2026-05-09-admin-page-phase-1-foundation.md`](./2026-05-09-admin-page-phase-1-foundation.md) — completed on `feat/admin-page` at commit `c0d42cdb`, tagged `phase-1-foundation`. Phase 2 builds on that branch.

---

## Pre-flight (do these BEFORE Task 1, outside the plan)

1. **Pick a branch strategy.** Phase 1 is on `feat/admin-page` but not yet merged. Two options:
   - **A — One big PR (continue on `feat/admin-page`)**: simpler git story, one review at the end. Recommended if Hassan plans to ship the admin as a single deploy.
   - **B — Merge Phase 1 first, branch off `main`**: cleaner PR history. Run `git checkout main && git merge --no-ff feat/admin-page && git push`, then `git checkout -b feat/admin-page-ui`.

   Either works. Plan steps assume **A** (continue on `feat/admin-page`); adjust commits/branch names if you pick B.

2. **(Optional but recommended) Resend account.** Without it, the "Send test email" button returns `{ ok: false, error: "Resend not configured" }` — the rest of the UI works. To enable real email:
   - Sign up at https://resend.com (free tier — 100 emails/day, 3 000/month).
   - Create an API key.
   - Either verify `itshassan.it` as a sending domain (adds SPF/DKIM/DMARC records on OVH — production path) **OR** use Resend's `onboarding@resend.dev` sandbox sender (dev-only, only delivers to your own verified address).
   - Put in `apps/web-next/.env.local`:
     ```
     RESEND_API_KEY=re_...
     RESEND_FROM=Hassan <onboarding@resend.dev>      # sandbox
     # RESEND_FROM=Hassan <noreply@itshassan.it>     # prod, once domain is verified
     ```

3. **Dev server reminder.** When env vars change, `Ctrl+C` and re-run `pnpm dev:next`.

---

## File map (Phase 2 only)

```
apps/web-next/
  app/
    admin/
      login/page.tsx                            NEW — login form (client component, not in authed group)
      not-found.tsx                             NEW — admin-context 404 (replaces booking-demo fallback for /admin/*)
      _components/                              NEW — admin-only client islands
        LogoutButton.tsx                        NEW — client component, fetch POST /api/admin/logout
        TestEmailButton.tsx                     NEW — client component, fetch POST /api/admin/test-email
      (authed)/                                 NEW — route group; layout calls requireAdminSession()
        layout.tsx                              NEW — admin shell (nav, logout, main)
        page.tsx                                NEW — leads list + stat cards (/admin)
        leads/[id]/page.tsx                     NEW — lead detail + edit Server Action (/admin/leads/[id])
        site-config/page.tsx                    NEW — config edit + test email (/admin/site-config)
    api/
      admin/
        leads/[id]/
          route.ts                              NEW — PATCH
          route.test.ts                         NEW
        site-config/
          route.ts                              NEW — PUT
          route.test.ts                         NEW
        test-email/
          route.ts                              NEW — POST
          route.test.ts                         NEW
  lib/
    email.ts                                    NEW — Resend client + getNotificationRecipient + sendTestEmail
    email.test.ts                               NEW
    admin/
      leads.ts                                  NEW — getLeads / getLeadById / updateLead
      leads.test.ts                             NEW
      siteConfig.ts                             NEW — getSiteConfig / updateSiteConfig
      siteConfig.test.ts                        NEW
  app/globals.css                               MODIFIED — admin-specific classes appended
  .env.example                                  MODIFIED — uncomment + document RESEND_*
  .env.local                                    MODIFIED locally (gitignored) — RESEND_*
```

URL ↔ file map after the route-group magic:

| URL | File |
|---|---|
| `/admin/login` | `app/admin/login/page.tsx` |
| `/admin` | `app/admin/(authed)/page.tsx` |
| `/admin/leads/[id]` | `app/admin/(authed)/leads/[id]/page.tsx` |
| `/admin/site-config` | `app/admin/(authed)/site-config/page.tsx` |
| Any unknown `/admin/*` | `app/admin/not-found.tsx` |

---

## Task 1: Resend env vars in `.env.example` (and locally)

**Files:**
- Modify: `apps/web-next/.env.example`
- (User-only) Modify: `apps/web-next/.env.local`

- [ ] **Step 1: Uncomment + document in `.env.example`**

Open `apps/web-next/.env.example`. Replace the Phase 2+ block:

```bash
# === Phase 2+: Email & Privacy ===
# RESEND_API_KEY=
# RESEND_FROM=Hassan <noreply@itshassan.it>
# PRIVACY_VERSION=v1-2026-05
```

with:

```bash
# === Phase 2+: Email (Resend) ===
# Required for /admin/site-config "Send test email" button and (Phase 3+) lead intake notifications.
# Without these, sendTestEmail() returns { ok: false, error: "Resend not configured" } and the UI shows that error.
RESEND_API_KEY=re_yourKeyHere
# RESEND_FROM must be on a Resend-verified sending domain.
# In dev you can use the sandbox sender (only delivers to your verified address):
RESEND_FROM=Hassan <onboarding@resend.dev>
# In prod, after verifying itshassan.it on Resend + adding DNS records on OVH:
# RESEND_FROM=Hassan <noreply@itshassan.it>

# === Phase 3+: Privacy ===
# PRIVACY_VERSION=v1-2026-05
```

- [ ] **Step 2: Locally, add the same to `.env.local`**

(Hassan does this on his machine. The line is gitignored. If he doesn't have a Resend account, leave `RESEND_API_KEY=` empty — Task 2 handles that gracefully.)

- [ ] **Step 3: Commit**

```powershell
git add apps/web-next/.env.example
git commit -m "chore(web-next): document RESEND_API_KEY and RESEND_FROM in .env.example"
```

---

## Task 2: `lib/email.ts` — Resend wrapper + recipient resolver (TDD)

**Files:**
- Create: `apps/web-next/lib/email.test.ts`
- Create: `apps/web-next/lib/email.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/lib/email.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getNotificationRecipient } from "./email";

describe("getNotificationRecipient", () => {
  it("returns notifyEmail when it is set", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "alerts@itshassan.it",
      }),
    ).toBe("alerts@itshassan.it");
  });

  it("falls back to contactEmail when notifyEmail is null", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: null,
      }),
    ).toBe("hello@itshassan.it");
  });

  it("treats empty-string notifyEmail as 'not set' and falls back", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "",
      }),
    ).toBe("hello@itshassan.it");
  });
});
```

- [ ] **Step 2: Run — expect FAIL (module not found)**

```powershell
pnpm -F web-next test -- email.test
```

- [ ] **Step 3: Write the implementation**

Write `apps/web-next/lib/email.ts`:

```ts
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
  const { data, error } = await resend.emails.send({
    from,
    to: recipient,
    subject: "Admin test email",
    html: `
      <p>This is a test email from your admin panel.</p>
      <p>If you received this, Resend is configured correctly and ` +
      `<code>getNotificationRecipient()</code> resolved to <strong>${recipient}</strong>.</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message ?? "unknown Resend error" };
  }
  return { ok: true, id: data?.id };
}
```

- [ ] **Step 4: Run — expect PASS (3 tests)**

```powershell
pnpm -F web-next test -- email.test
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/email.ts apps/web-next/lib/email.test.ts
git commit -m "feat(web-next): lib/email.ts with getNotificationRecipient + sendTestEmail (Resend)"
```

---

## Task 3: `lib/admin/leads.ts` — service layer for leads (TDD)

**Files:**
- Create: `apps/web-next/lib/admin/leads.test.ts`
- Create: `apps/web-next/lib/admin/leads.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/lib/admin/leads.test.ts`. Note: full drizzle query-builder chains are tedious to mock; we mock the four leaf calls (`.where().orderBy()`, `.where().limit()`, `.set().where().returning()`) by snapshotting what `getLeads` / `getLeadById` / `updateLead` pass into drizzle:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fakeRows: unknown[] = [];
let lastWhereArg: unknown = null;
let lastSetArg: unknown = null;

vi.mock("@/lib/db/client", () => {
  const chainable = {
    select: () => chainable,
    from: () => chainable,
    where: (arg: unknown) => {
      lastWhereArg = arg;
      return chainable;
    },
    orderBy: async () => fakeRows,
    limit: async () => fakeRows,
    update: () => chainable,
    set: (arg: unknown) => {
      lastSetArg = arg;
      return chainable;
    },
    returning: async () => fakeRows,
  };
  return {
    db: chainable,
    schema: {
      leads: {
        id: "id",
        status: "status",
        source: "source",
        createdAt: "createdAt",
      },
    },
  };
});

import { getLeadById, getLeads, updateLead } from "./leads";

describe("lib/admin/leads", () => {
  beforeEach(() => {
    fakeRows.length = 0;
    lastWhereArg = null;
    lastSetArg = null;
  });

  afterEach(() => vi.restoreAllMocks());

  describe("getLeads", () => {
    it("returns all rows when no filters are given", async () => {
      fakeRows.push({ id: "1" }, { id: "2" });
      const rows = await getLeads();
      expect(rows).toHaveLength(2);
      expect(lastWhereArg).toBeNull();
    });

    it("passes a where condition when status is set", async () => {
      fakeRows.push({ id: "1", status: "new" });
      await getLeads({ status: "new" });
      expect(lastWhereArg).not.toBeNull();
    });

    it("passes a where condition when both status and source are set", async () => {
      fakeRows.push({ id: "1" });
      await getLeads({ status: "contacted", source: "cal" });
      expect(lastWhereArg).not.toBeNull();
    });
  });

  describe("getLeadById", () => {
    it("returns the row when present", async () => {
      fakeRows.push({ id: "abc" });
      const lead = await getLeadById("abc");
      expect(lead).toEqual({ id: "abc" });
    });

    it("returns null when no row matches", async () => {
      const lead = await getLeadById("missing");
      expect(lead).toBeNull();
    });
  });

  describe("updateLead", () => {
    it("updates status + notes and returns the patched row", async () => {
      const patched = { id: "abc", status: "contacted", notes: "called" };
      fakeRows.push(patched);
      const result = await updateLead("abc", { status: "contacted", notes: "called" });
      expect(result).toEqual(patched);
      expect(lastSetArg).toMatchObject({ status: "contacted", notes: "called" });
    });

    it("returns null when no row matches the id", async () => {
      const result = await updateLead("missing", { status: "closed" });
      expect(result).toBeNull();
    });
  });
});
```

- [ ] **Step 2: Run — expect FAIL (module not found)**

```powershell
pnpm -F web-next test -- "admin/leads.test"
```

- [ ] **Step 3: Write the implementation**

Write `apps/web-next/lib/admin/leads.ts`:

```ts
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

  const where = conds.length === 0 ? undefined : conds.length === 1 ? conds[0] : and(...conds);

  const rows = await db
    .select()
    .from(schema.leads)
    .where(where as SQL)
    .orderBy(desc(schema.leads.createdAt));
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
```

- [ ] **Step 4: Run — expect PASS (7 tests)**

```powershell
pnpm -F web-next test -- "admin/leads.test"
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/admin/leads.ts apps/web-next/lib/admin/leads.test.ts
git commit -m "feat(web-next): lib/admin/leads.ts service layer (get/getById/update)"
```

---

## Task 4: `lib/admin/siteConfig.ts` — service layer for site config (TDD)

**Files:**
- Create: `apps/web-next/lib/admin/siteConfig.test.ts`
- Create: `apps/web-next/lib/admin/siteConfig.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/lib/admin/siteConfig.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fakeRows: unknown[] = [];
let lastSetArg: unknown = null;

vi.mock("@/lib/db/client", () => {
  const chainable = {
    select: () => chainable,
    from: () => chainable,
    where: () => chainable,
    limit: async () => fakeRows,
    update: () => chainable,
    set: (arg: unknown) => {
      lastSetArg = arg;
      return chainable;
    },
    returning: async () => fakeRows,
  };
  return {
    db: chainable,
    schema: { siteConfig: { id: "id" } },
  };
});

import { getSiteConfig, updateSiteConfig } from "./siteConfig";

describe("lib/admin/siteConfig", () => {
  beforeEach(() => {
    fakeRows.length = 0;
    lastSetArg = null;
  });
  afterEach(() => vi.restoreAllMocks());

  describe("getSiteConfig", () => {
    it("returns the singleton row when present", async () => {
      fakeRows.push({ id: 1, phone: "+39 111", contactEmail: "a@b.com" });
      const config = await getSiteConfig();
      expect(config).toMatchObject({ id: 1, phone: "+39 111" });
    });

    it("returns null when no row exists (shouldn't happen post-seed, but defensive)", async () => {
      const config = await getSiteConfig();
      expect(config).toBeNull();
    });
  });

  describe("updateSiteConfig", () => {
    it("updates phone + contactEmail and returns the patched row", async () => {
      const patched = { id: 1, phone: "+39 222", contactEmail: "c@d.com", notifyEmail: null };
      fakeRows.push(patched);
      const result = await updateSiteConfig({ phone: "+39 222", contactEmail: "c@d.com" });
      expect(result).toEqual(patched);
      expect(lastSetArg).toMatchObject({ phone: "+39 222", contactEmail: "c@d.com" });
    });

    it("accepts null for notifyEmail to clear the override", async () => {
      fakeRows.push({ id: 1, notifyEmail: null });
      const result = await updateSiteConfig({ notifyEmail: null });
      expect(result?.notifyEmail).toBeNull();
      expect(lastSetArg).toMatchObject({ notifyEmail: null });
    });
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
pnpm -F web-next test -- "admin/siteConfig.test"
```

- [ ] **Step 3: Write the implementation**

Write `apps/web-next/lib/admin/siteConfig.ts`:

```ts
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
```

- [ ] **Step 4: Run — expect PASS (4 tests)**

```powershell
pnpm -F web-next test -- "admin/siteConfig.test"
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/admin/siteConfig.ts apps/web-next/lib/admin/siteConfig.test.ts
git commit -m "feat(web-next): lib/admin/siteConfig.ts service layer (get/update)"
```

---

## Task 5: CSS — extend `globals.css` with admin classes

**Files:**
- Modify: `apps/web-next/app/globals.css` (append only)

No tests (CSS).

- [ ] **Step 1: Append admin styles to `globals.css`**

Open `apps/web-next/app/globals.css` and **append** these blocks at the very end of the file (do not modify existing rules — they're shared with the booking demo):

```css
/* === Admin (Phase 2) — additive, reuses .card / .button / .field / .notice === */

.admin-shell {
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 24px clamp(20px, 6vw, 92px) 0;
  display: grid;
  gap: 24px;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--app-border) 68%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--app-card) 84%, transparent);
}

.admin-topbar__links {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.admin-topbar__links a {
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: color-mix(in srgb, var(--app-fg) 80%, var(--app-muted));
}

.admin-topbar__links a[aria-current="page"] {
  color: var(--app-fg);
  background: color-mix(in srgb, var(--app-accent-soft) 62%, transparent);
}

.stat-card-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.stat-card {
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--app-border) 74%, transparent);
  background: color-mix(in srgb, var(--app-card) 90%, transparent);
  padding: 16px 18px;
  display: grid;
  gap: 6px;
}

.stat-card__label {
  font-size: 13px;
  color: color-mix(in srgb, var(--app-fg) 70%, var(--app-muted));
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-card__value {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(28px, 4vw, 38px);
  letter-spacing: -0.02em;
}

.admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--app-border) 74%, transparent);
  background: color-mix(in srgb, var(--app-card) 90%, transparent);
}

.admin-table th,
.admin-table td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--app-border) 60%, transparent);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.admin-table th {
  background: color-mix(in srgb, var(--app-bg) 60%, transparent);
  color: color-mix(in srgb, var(--app-fg) 70%, var(--app-muted));
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.admin-table tr.lead-row {
  cursor: pointer;
  transition: background-color 220ms ease;
}

.admin-table tr.lead-row:hover {
  background: color-mix(in srgb, var(--app-accent-soft) 28%, transparent);
}

.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--app-border) 72%, transparent);
  background: color-mix(in srgb, var(--app-card) 82%, transparent);
  color: color-mix(in srgb, var(--app-fg) 78%, var(--app-muted));
}

.tag--new { color: #5fa8ff; border-color: color-mix(in srgb, #5fa8ff 60%, var(--app-border)); }
.tag--contacted { color: #f4c66a; border-color: color-mix(in srgb, #f4c66a 60%, var(--app-border)); }
.tag--closed { color: color-mix(in srgb, var(--app-fg) 60%, var(--app-muted)); }
.tag--scheduled { color: #5cbf83; border-color: color-mix(in srgb, var(--app-success) 60%, var(--app-border)); }
.tag--rescheduled { color: #f4c66a; }
.tag--cancelled { color: #e07a7a; }
.tag--cal { color: #c8a2ff; border-color: color-mix(in srgb, #c8a2ff 50%, var(--app-border)); }
.tag--contact_form { color: color-mix(in srgb, var(--app-fg) 78%, var(--app-muted)); }

.admin-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.admin-filter-row .field {
  min-width: 0;
  padding: 6px 10px;
}

.admin-empty {
  border-radius: 18px;
  border: 1px dashed color-mix(in srgb, var(--app-border) 76%, transparent);
  background: color-mix(in srgb, var(--app-card) 60%, transparent);
  padding: 28px;
  text-align: center;
  color: color-mix(in srgb, var(--app-fg) 70%, var(--app-muted));
}

.notice.err {
  border-color: color-mix(in srgb, #e07a7a 56%, var(--app-border));
  color: color-mix(in srgb, #e07a7a 80%, var(--app-fg));
}

@media (max-width: 760px) {
  .admin-shell {
    padding-inline: clamp(14px, 5vw, 28px);
  }
  .admin-table {
    font-size: 14px;
  }
  .admin-table th,
  .admin-table td {
    padding: 10px 10px;
  }
}
```

- [ ] **Step 2: Commit**

```powershell
git add apps/web-next/app/globals.css
git commit -m "feat(web-next): admin CSS classes (.admin-shell/.stat-card/.admin-table/.tag-*) appended to globals.css"
```

---

## Task 6: `/admin/login` page (client form)

**Files:**
- Create: `apps/web-next/app/admin/login/page.tsx`

No tests (UI; login API is already tested in Phase 1).

- [ ] **Step 1: Write the page**

Write `apps/web-next/app/admin/login/page.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next") ?? "/admin";
  const safeNext = nextPath.startsWith("/admin") ? nextPath : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(safeNext);
      router.refresh();
      return;
    }
    setLoading(false);
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setError(body.error ?? `Login failed (${res.status})`);
  }

  return (
    <section
      className="card"
      style={{ maxWidth: 440, margin: "60px auto", padding: 28 }}
    >
      <h1 style={{ margin: 0, fontSize: "clamp(26px, 3.5vw, 32px)" }}>Admin sign in</h1>
      <p style={{ margin: "8px 0 18px", color: "var(--app-muted)" }}>
        Restricted to itshassan.it administrators.
      </p>

      {error ? <div className="notice err">{error}</div> : null}

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label className="form-label">
          Email
          <input
            className="field"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-label">
          Password
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="button" type="submit" disabled={loading || !email || !password}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Manual verify in browser**

`pnpm dev:next` (if not already running) → http://localhost:3001/admin/login → form renders, "Sign in" disabled until both fields are filled. Submit with the credentials seeded in Phase 1 (`hassan.akkari01@gmail.com` / `somalia17`) → expect redirect to `/admin` (which 404s until Task 7 — that's fine, login itself succeeded).

- [ ] **Step 3: Commit**

```powershell
git add apps/web-next/app/admin/login/page.tsx
git commit -m "feat(web-next): /admin/login page (client form, redirects to ?next on success)"
```

---

## Task 7: `/admin` shell — `(authed)/layout.tsx` + `LogoutButton`

**Files:**
- Create: `apps/web-next/app/admin/_components/LogoutButton.tsx`
- Create: `apps/web-next/app/admin/(authed)/layout.tsx`

- [ ] **Step 1: Logout button (client component)**

Write `apps/web-next/app/admin/_components/LogoutButton.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="button button--bordered" type="button" onClick={handleClick} disabled={loading}>
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
```

- [ ] **Step 2: Authed layout (server component)**

Write `apps/web-next/app/admin/(authed)/layout.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/adminSession";
import { LogoutButton } from "../_components/LogoutButton";

export default async function AdminAuthedLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();
  return (
    <div className="admin-shell">
      <nav className="admin-topbar">
        <div className="admin-topbar__links">
          <Link href="/admin">Leads</Link>
          <Link href="/admin/site-config">Site config</Link>
        </div>
        <LogoutButton />
      </nav>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

```powershell
pnpm -F web-next typecheck
```

- [ ] **Step 4: Commit**

```powershell
git add apps/web-next/app/admin/_components/ apps/web-next/app/admin/(authed)/layout.tsx
git commit -m "feat(web-next): admin (authed) layout with requireAdminSession + LogoutButton"
```

---

## Task 8: `/admin` leads list page + stat cards

**Files:**
- Create: `apps/web-next/app/admin/(authed)/page.tsx`

- [ ] **Step 1: Write the page**

Write `apps/web-next/app/admin/(authed)/page.tsx`:

```tsx
import Link from "next/link";
import { getLeads, type LeadSource, type LeadStatus } from "@/lib/admin/leads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ status?: string; source?: string }>;

const STATUS_VALUES: ReadonlySet<LeadStatus> = new Set(["new", "contacted", "closed"]);
const SOURCE_VALUES: ReadonlySet<LeadSource> = new Set(["contact_form", "cal"]);

function parseStatus(v: string | undefined): LeadStatus | undefined {
  return v && STATUS_VALUES.has(v as LeadStatus) ? (v as LeadStatus) : undefined;
}
function parseSource(v: string | undefined): LeadSource | undefined {
  return v && SOURCE_VALUES.has(v as LeadSource) ? (v as LeadSource) : undefined;
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const source = parseSource(params.source);

  // Two queries: all rows (for stat cards), filtered rows (for the table).
  // Acceptable for v1; spec flags pagination as future work after 50 rows.
  const [all, filtered] = await Promise.all([getLeads(), getLeads({ status, source })]);

  const stats = {
    new: all.filter((l) => l.status === "new").length,
    contacted: all.filter((l) => l.status === "contacted").length,
    closed: all.filter((l) => l.status === "closed").length,
    cal: all.filter((l) => l.source === "cal").length,
  };

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Leads</h1>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          {filtered.length} of {all.length} {all.length === 1 ? "lead" : "leads"} shown
        </p>
      </header>

      <div className="stat-card-row">
        <div className="stat-card">
          <span className="stat-card__label">New</span>
          <span className="stat-card__value">{stats.new}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Contacted</span>
          <span className="stat-card__value">{stats.contacted}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Closed</span>
          <span className="stat-card__value">{stats.closed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Cal bookings</span>
          <span className="stat-card__value">{stats.cal}</span>
        </div>
      </div>

      <form method="GET" className="admin-filter-row" action="/admin">
        <label className="form-label">
          Status
          <select className="field" name="status" defaultValue={status ?? ""}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="form-label">
          Source
          <select className="field" name="source" defaultValue={source ?? ""}>
            <option value="">All</option>
            <option value="contact_form">Contact form</option>
            <option value="cal">Cal.com</option>
          </select>
        </label>
        <button className="button button--bordered" type="submit">Apply</button>
        <Link className="button button--flat" href="/admin">Clear</Link>
      </form>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          No leads match these filters.
          {all.length === 0
            ? " Once the Phase 3 contact form is wired up, leads will appear here."
            : ""}
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Booking</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="lead-row" onClick={() => undefined}>
                <td>
                  <Link href={`/admin/leads/${l.id}`}>
                    {new Date(l.createdAt).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Link>
                </td>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td><span className={`tag tag--${l.source}`}>{l.source}</span></td>
                <td><span className={`tag tag--${l.status}`}>{l.status}</span></td>
                <td>
                  {l.bookingStatus ? (
                    <span className={`tag tag--${l.bookingStatus}`}>{l.bookingStatus}</span>
                  ) : (
                    <span style={{ color: "var(--app-muted)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```powershell
pnpm -F web-next typecheck
```

- [ ] **Step 3: Manual verify**

Browser: http://localhost:3001/admin (logged in) → leads list renders with all four stat cards at zero, empty-state notice ("No leads match these filters. Once the Phase 3 contact form is wired up, leads will appear here.").

Optional sanity-insert a row to see the table render — in Neon SQL editor:
```sql
INSERT INTO leads (source, name, email, message, status, privacy_accepted_at, privacy_version)
VALUES ('contact_form', 'Test User', 'test@example.com', 'Hi from Neon SQL editor', 'new', NOW(), 'v1-2026-05');
```
Reload `/admin` → table shows one row, "New" stat = 1. Delete after testing:
```sql
DELETE FROM leads WHERE email = 'test@example.com';
```

- [ ] **Step 4: Commit**

```powershell
git add apps/web-next/app/admin/(authed)/page.tsx
git commit -m "feat(web-next): /admin leads list with stat cards + status/source filters"
```

---

## Task 9: `/admin/leads/[id]` detail page + Server Action

**Files:**
- Create: `apps/web-next/app/admin/(authed)/leads/[id]/page.tsx`

- [ ] **Step 1: Write the page**

Write `apps/web-next/app/admin/(authed)/leads/[id]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLeadById, updateLead, type LeadStatus } from "@/lib/admin/leads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

const STATUS_VALUES: ReadonlySet<LeadStatus> = new Set(["new", "contacted", "closed"]);

async function saveLead(formData: FormData) {
  "use server";
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

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const createdAt = new Date(lead.createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h1 style={{ margin: 0 }}>{lead.name}</h1>
          <p style={{ margin: 0, color: "var(--app-muted)" }}>
            Received {createdAt} · <span className={`tag tag--${lead.source}`}>{lead.source}</span>
          </p>
        </div>
        <Link className="button button--flat" href="/admin">← Back to leads</Link>
      </header>

      {saved === "1" ? <div className="notice ok">Saved.</div> : null}

      <div className="layout-two">
        <div className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Contact</h2>
          <div className="summary-grid">
            <div className="summary-row"><span>Email</span><strong>{lead.email}</strong></div>
            <div className="summary-row"><span>Phone</span><strong>{lead.phone ?? "—"}</strong></div>
            {lead.scheduledAt ? (
              <div className="summary-row">
                <span>Scheduled</span>
                <strong>{new Date(lead.scheduledAt).toLocaleString("en-GB")}</strong>
              </div>
            ) : null}
            {lead.bookingStatus ? (
              <div className="summary-row">
                <span>Booking status</span>
                <span className={`tag tag--${lead.bookingStatus}`}>{lead.bookingStatus}</span>
              </div>
            ) : null}
            {lead.sourceDetail ? (
              <div className="summary-row"><span>Source detail</span><strong>{lead.sourceDetail}</strong></div>
            ) : null}
          </div>

          {lead.message ? (
            <>
              <h3 style={{ margin: "10px 0 0", fontSize: 14, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Message
              </h3>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{lead.message}</p>
            </>
          ) : null}
        </div>

        <div className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Admin</h2>
          <form action={saveLead} className="form-grid">
            <input type="hidden" name="id" value={lead.id} />
            <label className="form-label">
              Status
              <select className="field" name="status" defaultValue={lead.status}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="form-label">
              Notes
              <textarea
                className="field"
                name="notes"
                rows={6}
                defaultValue={lead.notes ?? ""}
                placeholder="Anything you want to remember about this lead…"
              />
            </label>
            <div className="button-row">
              <button className="button" type="submit">Save</button>
            </div>
          </form>

          {lead.notificationError ? (
            <div className="notice err">
              <strong>Notification error:</strong> {lead.notificationError}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```powershell
pnpm -F web-next typecheck
```

- [ ] **Step 3: Manual verify**

Insert a test row in Neon (same SQL as Task 8 step 3). Visit `/admin` → click the timestamp → land on `/admin/leads/<id>`. Change Status to "Contacted", add a note, click Save → page reloads with "Saved." banner, status pill updates, table on `/admin` reflects it.

- [ ] **Step 4: Commit**

```powershell
git add "apps/web-next/app/admin/(authed)/leads/[id]/page.tsx"
git commit -m "feat(web-next): /admin/leads/[id] detail page with status/notes Server Action"
```

---

## Task 10: `/admin/site-config` page + test email button

**Files:**
- Create: `apps/web-next/app/admin/_components/TestEmailButton.tsx`
- Create: `apps/web-next/app/admin/(authed)/site-config/page.tsx`

- [ ] **Step 1: Client button**

Write `apps/web-next/app/admin/_components/TestEmailButton.tsx`:

```tsx
"use client";

import { useState } from "react";

export function TestEmailButton() {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ok"; recipient: string }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  async function handleClick() {
    setState({ kind: "loading" });
    const res = await fetch("/api/admin/test-email", { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      recipient?: string;
      error?: string;
    };
    if (res.ok && body.ok) {
      setState({ kind: "ok", recipient: body.recipient ?? "configured address" });
    } else {
      setState({ kind: "err", message: body.error ?? `Request failed (${res.status})` });
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        className="button button--bordered"
        type="button"
        onClick={handleClick}
        disabled={state.kind === "loading"}
      >
        {state.kind === "loading" ? "Sending…" : "Send test email"}
      </button>
      {state.kind === "ok" ? (
        <div className="notice ok">Test email sent to <strong>{state.recipient}</strong>.</div>
      ) : null}
      {state.kind === "err" ? <div className="notice err">{state.message}</div> : null}
    </div>
  );
}
```

- [ ] **Step 2: Site config page (Server Action)**

Write `apps/web-next/app/admin/(authed)/site-config/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSiteConfig, updateSiteConfig } from "@/lib/admin/siteConfig";
import { TestEmailButton } from "../../_components/TestEmailButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const patchSchema = z.object({
  phone: z.string().trim().max(120),
  contactEmail: z.string().trim().email(),
  notifyEmail: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(z.union([z.string().email(), z.null()])),
});

async function saveConfig(formData: FormData) {
  "use server";
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

export default async function SiteConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const config = await getSiteConfig();

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Site config</h1>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          Public contact info shown on itshassan.it. Notification override controls where lead emails are sent.
        </p>
      </header>

      {saved === "1" ? <div className="notice ok">Saved.</div> : null}
      {error === "invalid" ? <div className="notice err">Invalid input — check the fields.</div> : null}

      <form action={saveConfig} className="card form-grid" style={{ padding: 20 }}>
        <label className="form-label">
          Phone (public)
          <input
            className="field"
            type="tel"
            name="phone"
            defaultValue={config?.phone ?? ""}
            placeholder="+39 …"
          />
        </label>
        <label className="form-label">
          Contact email (public — also default notification destination)
          <input
            className="field"
            type="email"
            name="contactEmail"
            defaultValue={config?.contactEmail ?? ""}
            required
          />
        </label>
        <label className="form-label">
          Notify email override (optional — admin only, hidden from public)
          <input
            className="field"
            type="email"
            name="notifyEmail"
            defaultValue={config?.notifyEmail ?? ""}
            placeholder="Leave blank to reuse contact email"
          />
        </label>
        <div className="button-row">
          <button className="button" type="submit">Save</button>
        </div>
      </form>

      <div className="card" style={{ padding: 20, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Send test email</h2>
        <p style={{ margin: 0, color: "var(--app-muted)" }}>
          Sends a fixed test message to the resolved notification address (notify_email ?? contact_email).
          Use this to confirm Resend credentials work end-to-end before leads start flowing in.
        </p>
        <TestEmailButton />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

```powershell
pnpm -F web-next typecheck
```

- [ ] **Step 4: Manual verify (no Resend yet OK)**

Browser: http://localhost:3001/admin/site-config →
- form shows seeded `contact_email` = `hassan.akkari01@gmail.com`, empty phone, empty notify override
- change phone to `+39 333 1234567`, Save → "Saved." banner, value persists on reload
- click "Send test email" → if `RESEND_API_KEY` is unset, expect notice "Resend not configured…" (Task 11 wires the API route; right now the button hits a not-yet-existing endpoint and will get 404 → we'll fix in Task 11). Move on.

- [ ] **Step 5: Commit**

```powershell
git add "apps/web-next/app/admin/(authed)/site-config/page.tsx" apps/web-next/app/admin/_components/TestEmailButton.tsx
git commit -m "feat(web-next): /admin/site-config edit form + TestEmailButton client island"
```

---

## Task 11: `PATCH /api/admin/leads/[id]` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/admin/leads/[id]/route.test.ts`
- Create: `apps/web-next/app/api/admin/leads/[id]/route.ts`

- [ ] **Step 1: Failing test**

Write `apps/web-next/app/api/admin/leads/[id]/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const mockCalls: { updateLead: Array<[string, unknown]> } = { updateLead: [] };
let updateLeadReturn: unknown = null;

vi.mock("@/lib/admin/leads", () => ({
  updateLead: async (id: string, patch: unknown) => {
    mockCalls.updateLead.push([id, patch]);
    return updateLeadReturn;
  },
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { sealAdminSession } from "@/lib/adminSession";
import { PATCH } from "./route";

function makeRequest(body: unknown, opts: { origin?: string | null; signedIn?: boolean } = {}) {
  return new Request("https://admin.itshassan.it/api/admin/leads/abc", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(opts.origin !== null ? { origin: opts.origin ?? "https://admin.itshassan.it" } : {}),
    },
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ id: "abc" }) };

describe("PATCH /api/admin/leads/[id]", () => {
  beforeEach(async () => {
    cookieStore.clear();
    mockCalls.updateLead.length = 0;
    updateLeadReturn = null;
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin with 403", async () => {
    const res = await PATCH(makeRequest({ status: "contacted" }, { origin: "https://evil.com" }), ctx);
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await PATCH(makeRequest({ status: "contacted" }), ctx);
    expect(res.status).toBe(401);
  });

  it("rejects invalid payload with 400", async () => {
    const res = await PATCH(makeRequest({ status: "not-a-valid-status" }), ctx);
    expect(res.status).toBe(400);
  });

  it("returns 404 when the lead doesn't exist", async () => {
    updateLeadReturn = null;
    const res = await PATCH(makeRequest({ status: "contacted" }), ctx);
    expect(res.status).toBe(404);
  });

  it("returns 200 + updated lead on success and forwards the patch", async () => {
    updateLeadReturn = { id: "abc", status: "contacted", notes: "hi" };
    const res = await PATCH(makeRequest({ status: "contacted", notes: "hi" }), ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { lead: { id: string } };
    expect(body.lead.id).toBe("abc");
    expect(mockCalls.updateLead).toEqual([["abc", { status: "contacted", notes: "hi" }]]);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
pnpm -F web-next test -- "leads/[id]/route.test"
```

- [ ] **Step 3: Implementation**

Write `apps/web-next/app/api/admin/leads/[id]/route.ts`:

```ts
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
```

- [ ] **Step 4: Run — expect PASS (5 tests)**

```powershell
pnpm -F web-next test -- "leads/[id]/route.test"
```

- [ ] **Step 5: Commit**

```powershell
git add "apps/web-next/app/api/admin/leads/[id]/"
git commit -m "feat(web-next): PATCH /api/admin/leads/[id] with origin + session + zod"
```

---

## Task 12: `PUT /api/admin/site-config` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/admin/site-config/route.test.ts`
- Create: `apps/web-next/app/api/admin/site-config/route.ts`

- [ ] **Step 1: Failing test**

Write `apps/web-next/app/api/admin/site-config/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const calls: { update: Array<unknown> } = { update: [] };
let updateReturn: unknown = null;

vi.mock("@/lib/admin/siteConfig", () => ({
  updateSiteConfig: async (patch: unknown) => {
    calls.update.push(patch);
    return updateReturn;
  },
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { sealAdminSession } from "@/lib/adminSession";
import { PUT } from "./route";

function makeRequest(body: unknown, origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/site-config", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("PUT /api/admin/site-config", () => {
  beforeEach(async () => {
    cookieStore.clear();
    calls.update.length = 0;
    updateReturn = null;
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin", async () => {
    const res = await PUT(makeRequest({}, "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await PUT(makeRequest({ phone: "+39", contactEmail: "a@b.com", notifyEmail: null }));
    expect(res.status).toBe(401);
  });

  it("rejects invalid email with 400", async () => {
    const res = await PUT(makeRequest({ phone: "x", contactEmail: "not-an-email", notifyEmail: null }));
    expect(res.status).toBe(400);
  });

  it("returns 200 + config on success, with notifyEmail null preserved", async () => {
    updateReturn = { id: 1, phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null };
    const res = await PUT(makeRequest({ phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { config: { phone: string; notifyEmail: string | null } };
    expect(body.config.phone).toBe("+39 333");
    expect(body.config.notifyEmail).toBeNull();
    expect(calls.update[0]).toMatchObject({ phone: "+39 333", contactEmail: "a@b.com", notifyEmail: null });
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
pnpm -F web-next test -- "site-config/route.test"
```

- [ ] **Step 3: Implementation**

Write `apps/web-next/app/api/admin/site-config/route.ts`:

```ts
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
```

- [ ] **Step 4: Run — expect PASS (4 tests)**

```powershell
pnpm -F web-next test -- "site-config/route.test"
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/admin/site-config/
git commit -m "feat(web-next): PUT /api/admin/site-config with origin + session + zod"
```

---

## Task 13: `POST /api/admin/test-email` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/admin/test-email/route.test.ts`
- Create: `apps/web-next/app/api/admin/test-email/route.ts`

- [ ] **Step 1: Failing test**

Write `apps/web-next/app/api/admin/test-email/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

let configReturn: unknown = null;
let sendReturn: unknown = null;

vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: async () => configReturn,
}));

vi.mock("@/lib/email", () => ({
  getNotificationRecipient: (c: { contactEmail: string; notifyEmail: string | null }) =>
    c.notifyEmail?.trim() ? c.notifyEmail : c.contactEmail,
  sendTestEmail: async () => sendReturn,
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { sealAdminSession } from "@/lib/adminSession";
import { POST } from "./route";

function makeRequest(origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/test-email", {
    method: "POST",
    headers: origin ? { origin } : {},
  });
}

describe("POST /api/admin/test-email", () => {
  beforeEach(async () => {
    cookieStore.clear();
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);
    configReturn = { id: 1, phone: "", contactEmail: "owner@itshassan.it", notifyEmail: null };
    sendReturn = { ok: true, id: "msg_123" };
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects foreign Origin", async () => {
    const res = await POST(makeRequest("https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    cookieStore.clear();
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 500 when site_config row is missing", async () => {
    configReturn = null;
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });

  it("returns 502 when Resend reports a failure (e.g. unconfigured)", async () => {
    sendReturn = { ok: false, error: "Resend not configured (set RESEND_API_KEY and RESEND_FROM)" };
    const res = await POST(makeRequest());
    expect(res.status).toBe(502);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toMatch(/Resend not configured/);
  });

  it("returns 200 + recipient on success", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; recipient: string };
    expect(body.ok).toBe(true);
    expect(body.recipient).toBe("owner@itshassan.it");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
pnpm -F web-next test -- "test-email/route.test"
```

- [ ] **Step 3: Implementation**

Write `apps/web-next/app/api/admin/test-email/route.ts`:

```ts
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
```

- [ ] **Step 4: Run — expect PASS (5 tests)**

```powershell
pnpm -F web-next test -- "test-email/route.test"
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/admin/test-email/
git commit -m "feat(web-next): POST /api/admin/test-email — Resend trigger via getNotificationRecipient"
```

---

## Task 14: `/admin` admin-context `not-found.tsx`

**Files:**
- Create: `apps/web-next/app/admin/not-found.tsx`

- [ ] **Step 1: Write the page**

Write `apps/web-next/app/admin/not-found.tsx`:

```tsx
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <section
      className="card"
      style={{ maxWidth: 560, margin: "60px auto", padding: 28, display: "grid", gap: 14 }}
    >
      <h1 style={{ margin: 0 }}>Admin route not found</h1>
      <p style={{ margin: 0, color: "var(--app-muted)" }}>
        The URL you tried isn't a valid admin route. Use the links below.
      </p>
      <div className="button-row">
        <Link href="/admin" className="button">Leads</Link>
        <Link href="/admin/site-config" className="button button--bordered">Site config</Link>
        <Link href="/admin/login" className="button button--flat">Sign in</Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Manual verify**

Browser: http://localhost:3001/admin/nonexistent → admin not-found renders (not the booking-demo "in-memory order state" one).

- [ ] **Step 3: Commit**

```powershell
git add apps/web-next/app/admin/not-found.tsx
git commit -m "feat(web-next): /admin not-found page (admin-context 404)"
```

---

## Task 15: Full gate + manual end-to-end smoke test

**Files:** none modified — verifying.

- [ ] **Step 1: Full gate**

```powershell
pnpm -F web-next lint
pnpm -F web-next typecheck
pnpm -F web-next test
```

All three must be clean. Expected: lint 0 errors, typecheck 0 errors, `pnpm test` ≥ 39 tests passing (Phase 1's 25 + Phase 2's 14: 3 email, 7 leads, 4 siteConfig, but the route tests share some assertions — actual count will be visible).

- [ ] **Step 2: Restart dev server**

```powershell
pnpm dev:next
```

- [ ] **Step 3: Browser smoke test**

In order:

1. **Logged-out access** — go to http://localhost:3001/admin (no admin cookie). Expect redirect to `/admin/login?next=/admin` and the new **login form** (not the booking demo's login).
2. **Login** — type the seeded email + password, click Sign in. Expect redirect to `/admin` and the leads list page (stat cards all 0, empty-state notice).
3. **Site config** — click "Site config" in the nav. Change phone, click Save → "Saved." banner. Reload — value persists.
4. **Test email button** — click "Send test email":
   - If Resend is configured: expect green notice "Test email sent to <your email>" and an actual email in your inbox within ~10 seconds.
   - If not: expect red notice "Resend not configured (set RESEND_API_KEY and RESEND_FROM)".
5. **Insert a test lead manually** (Neon SQL editor):
   ```sql
   INSERT INTO leads (source, name, email, message, status, privacy_accepted_at, privacy_version)
   VALUES ('contact_form', 'Smoke Test', 'smoke@example.com', 'Hello', 'new', NOW(), 'v1-2026-05');
   ```
6. **Leads list** — go back to `/admin`. Expect stats: New = 1; one row in the table; status pill shows "new".
7. **Lead detail** — click the timestamp. Expect detail page with Contact card + Admin form. Change Status to "Contacted", add Notes "spoke to them", Save → "Saved." banner; on `/admin` the row's status pill is "contacted".
8. **Filters** — on `/admin`, set Status = New, click Apply. Expect the row to disappear (it's now contacted). Click Clear.
9. **Logout** — click "Sign out". Expect redirect to `/admin/login`. The cookie is cleared (`document.cookie` in DevTools no longer shows `admin_session`).
10. **Re-gate check** — navigate to `/admin` → redirect to `/admin/login?next=/admin` again. ✓
11. **Admin not-found** — type `/admin/this-does-not-exist` (must be logged in first, otherwise the redirect intercepts). Expect the new admin 404 page, **not** the booking demo's "in-memory order state" message.
12. **Booking demo intact** — `/checkout` → still redirects to `/login` (booking demo). The two systems remain isolated.

- [ ] **Step 4: Clean up the test lead**

```sql
DELETE FROM leads WHERE email = 'smoke@example.com';
```

- [ ] **Step 5: Final commit (only if anything changed) + tag**

```powershell
git status                              # expect clean
git tag phase-2-ui
```

---

## Self-review notes (read these before reporting Phase 2 done)

1. **Spec coverage.** Tasks 6 (login page), 7 (shell + LogoutButton), 8 (leads list + stat cards) cover build-order step 5. Tasks 9 (detail) + 11 (PATCH route) cover step 6. Tasks 10 (site-config + TestEmailButton), 12 (PUT route), 13 (test-email route) cover step 7. Task 2 (email lib) + Task 5 (CSS) + Task 14 (admin not-found) round it out.
2. **Defense in depth still applies.** Every page in `(authed)/` is wrapped by the layout that calls `requireAdminSession()` (real seal verify), and every admin API route additionally calls `getAdminSession()` itself — so a future bug in `proxy.ts` cannot let a request through without re-verification.
3. **Spec rule respected: `getNotificationRecipient` is the only place that decides who gets emails.** Every notification path goes through it (currently just the test-email route; the lead-intake route in Phase 3 will do the same).
4. **Route group prevents auth-check infinite loop.** `/admin/login` is at `app/admin/login/page.tsx` (no `(authed)` group), so it doesn't render under the layout that would redirect it back to itself.
5. **Origin allowlist is unchanged.** All admin mutations re-use the existing `requireAdminOrigin` helper. No new origin strings are hardcoded.
6. **Cookie name reality check.** `admin_session` (admin) and `web_next_session` (booking demo) remain separate, set by their respective routes. The proxy's path-based gate from Phase 1 still applies.
7. **Server Action redirects.** `redirect(...)` after `revalidatePath(...)` in Server Actions is the canonical Next.js 16 pattern. The 303 redirect avoids a re-submit if Hassan refreshes.
8. **Pagination not added** — spec says it goes on the v2 list once leads exceed 50. Empty-state copy hints at where leads come from (the Phase 3 contact form).
9. **No new currency-math, no new orders code touched.** Phase 2 is strictly admin-side; booking-demo invariants (`lib/orders.ts`, `lib/pricing.ts`) are untouched.

## Phase 2 done — what's next

When this plan is fully checked off:

- The admin UI exists end-to-end: login → list → detail → site-config → test email → logout.
- 25 + ~24 tests passing across all of `apps/web-next`.
- `pnpm check` clean.
- Manual smoke test passed in browser.
- `git tag phase-2-ui` marker on the branch.

**Next plan to write:** **Phase 3 — Public surface + ContactForm wiring.** Scope: `POST /api/leads` (honeypot + delay + zod + privacy fields + Resend notification with error capture), `GET /api/site-config` (public CORS + cache), `apps/docs` ContactForm onSubmit posting to the admin endpoint, `apps/docs` siteConfig fetcher with localStorage cache + hard-coded fallback, privacy checkbox + `/privacy` page, i18n strings for the privacy notice (en/it/fr).

After Phase 3: Phase 4 (Cal.com embed + webhook) and Phase 5 (deployment: Vercel project for `apps/web-next`, OVH CNAME, Resend domain verification, README/runbook). The DEV_NO_DB escape hatch from Phase 1 should be decided in Phase 5 (keep as permanent admin recovery flag vs. remove pre-merge).
