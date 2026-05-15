# Admin Page — Phase 3 (Public Surface) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the public portfolio site (`apps/docs`) to the admin domain (`apps/web-next`). After Phase 3, every contact-form submission on itshassan.it lands as a row in `leads`, Hassan gets an email notification via Resend, the portfolio reads site config (phone/contact email) live from the admin domain, and visitors can read `/privacy` before consenting.

**Architecture:**
- Two new public endpoints on `apps/web-next`: `POST /api/leads` (intake) + `GET /api/site-config` (public read). Both are outside the admin auth gate — protected only by zod, honeypot, min-delay, and CORS allowlist.
- Lead intake is **DB-as-truth**: the lead row is inserted before Resend is called. If Resend fails, the lead still exists; the failure is captured in `leads.notification_error` so the admin UI surfaces it.
- The `apps/docs` ContactForm calls the admin domain via `fetch` (anonymous, CORS-validated). The schema is refactored to a factory taking i18n labels so error messages can be localized (closes followup A17). Honeypot field + form-render timestamp are added.
- `apps/docs` reads site config via a small fetcher with localStorage 5-minute cache + hard-coded fallback. The portfolio renders even if the admin domain is down.
- Privacy: required checkbox on the form, link to a new `/privacy` page, stored on the lead row as `privacy_accepted_at` (timestamp) + `privacy_version` (from `PRIVACY_VERSION` env). Schema columns exist from Phase 1; Phase 3 wires them in.

**Tech stack:** Same as Phase 2. No new packages on `apps/web-next` (`resend` + `drizzle-orm` already there). On `apps/docs` no new packages either — uses native `fetch` + existing zod + `@laboratoire/ui` form components.

**Spec reference:** [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md). This plan covers build-order steps **8, 9, 10** plus the privacy wiring called out in spec decision #19. Build-order step 11 (Cal.com embed) is Phase 4. Step 12 (Cal webhook) is also Phase 4 (deferrable).

**Pre-flight (do before Task 1):**

- Phase 1 + Phase 2 are merged to `main` (commit `27b6f1c5` or newer). Branch off updated `main` as `feat/admin-page-phase-3` (or continue on the existing `feat/admin-phase-3-plan` branch where this plan lives).
- `pnpm -F web-next test` is green (≥57 tests from Phase 2).
- `apps/docs` has `apps/docs/.env.local` (gitignored) or rely on Vite defaults. Phase 3 adds `VITE_ADMIN_API_BASE` to `.env.example` — copy to `.env.local` with the dev value `http://localhost:3001`.
- `apps/web-next/.env.local` has `PRIVACY_VERSION` set (e.g. `v1-2026-05`). It's already in `.env.example` from Phase 2.

---

## File map (Phase 3 only)

```
apps/web-next/
  lib/
    email.ts                                          MODIFY: add sendLeadNotification
    email.test.ts                                     MODIFY: add tests for sendLeadNotification
    admin/
      leads.ts                                        MODIFY: add createLead + recordLeadNotification helpers
      leads.test.ts                                   MODIFY: add tests for new helpers
  app/
    api/
      leads/
        route.ts                                      NEW (POST public, CORS, honeypot, delay, Resend)
        route.test.ts                                 NEW
      site-config/
        route.ts                                      NEW (GET public, CORS, cache headers)
        route.test.ts                                 NEW

apps/docs/
  .env.example                                        NEW
  src/
    lib/
      siteConfig.ts                                   NEW (fetcher + localStorage cache + fallback)
      siteConfig.test.ts                              NEW
    components/
      sections/
        contactForm.schema.ts                         MODIFY: factory + honeypot + privacy
        contactForm.schema.test.ts                    MODIFY: test new shape
        ContactForm.tsx                               MODIFY: wire POST + honeypot + delay + privacy + i18n errors
        ContactSection.tsx                            MODIFY: overlay phone/email from siteConfig
    pages/
      PrivacyPage.tsx                                 NEW
    i18n/
      messages.ts                                     MODIFY: add contact.privacy*, formError*, privacy page strings (3 locales)
    App.tsx                                           MODIFY: add /privacy route
```

**Out of scope for Phase 3** (deferred to Phase 4+): Cal.com embed, `POST /api/cal/webhook`, Vercel project for `apps/web-next`, OVH CNAME, Resend domain verification, DEV_NO_DB cleanup decision.

---

## Task 1: Add `createLead` + `recordLeadNotification` to `lib/admin/leads.ts` (TDD)

**Files:**
- Modify: `apps/web-next/lib/admin/leads.ts`
- Modify: `apps/web-next/lib/admin/leads.test.ts`

The `POST /api/leads` route inserts via this helper (kept thin so the route stays focused on validation + CORS + Resend orchestration). `recordLeadNotification` is called after Resend either succeeds (timestamps `last_notified_at`) or fails (captures `notification_error`).

- [ ] **Step 1: Add failing tests to `lib/admin/leads.test.ts`**

Append at the end of the existing test file (before the final `});` of the outer describe, OR as new top-level describes — they're independent):

```ts
describe("createLead", () => {
  beforeEach(() => {
    mockState.updateReturn = [];
    mockState.setSpy.mockReset();
  });

  it("inserts a contact-form lead with privacy fields and returns the row", async () => {
    const inserted = {
      id: "abc",
      source: "contact_form",
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      status: "new",
      privacyAcceptedAt: new Date("2026-05-15T10:00:00Z"),
      privacyVersion: "v1-2026-05",
    };
    mockState.updateReturn = [inserted];
    const result = await createLead({
      source: "contact_form",
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      privacyVersion: "v1-2026-05",
    });
    expect(result?.id).toBe("abc");
  });

  it("returns null when no row was returned", async () => {
    mockState.updateReturn = [];
    const result = await createLead({
      source: "contact_form",
      name: "X",
      email: "x@y.com",
      message: "Z",
      privacyVersion: "v1-2026-05",
    });
    expect(result).toBeNull();
  });
});

describe("recordLeadNotification", () => {
  beforeEach(() => {
    mockState.updateReturn = [];
    mockState.setSpy.mockReset();
  });

  it("stamps lastNotifiedAt on success", async () => {
    mockState.updateReturn = [{ id: "abc" }];
    await recordLeadNotification("abc", { ok: true });
    const patch = mockState.setSpy.mock.calls[0]?.[0] as {
      lastNotifiedAt?: Date;
      notificationError?: string | null;
    };
    expect(patch.lastNotifiedAt).toBeInstanceOf(Date);
    expect(patch.notificationError).toBeNull();
  });

  it("stamps notificationError on failure", async () => {
    mockState.updateReturn = [{ id: "abc" }];
    await recordLeadNotification("abc", { ok: false, error: "Resend down" });
    const patch = mockState.setSpy.mock.calls[0]?.[0] as {
      lastNotifiedAt?: Date | null;
      notificationError?: string;
    };
    expect(patch.lastNotifiedAt).toBeNull();
    expect(patch.notificationError).toBe("Resend down");
  });
});
```

The existing `createLead` / `recordLeadNotification` imports at the top of the test file must be added:

```ts
import {
  createLead,
  getLeadById,
  getLeadStatusCounts,
  listLeads,
  recordLeadNotification,
  updateLead,
} from "./leads";
```

The drizzle mock chain already covers `db.update().set().where().returning()` for `updateLead`. For `createLead` (which uses `db.insert().values().returning()`), extend the mock:

Replace the existing `vi.mock("@/lib/db/client", () => ({` block with:

```ts
vi.mock("@/lib/db/client", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: (cond: unknown) => {
          mockState.whereSpy(cond);
          return {
            orderBy: async () => mockState.selectRows,
            limit: async () => mockState.selectByIdRows,
          };
        },
        orderBy: async () => mockState.selectRows,
      }),
    }),
    update: () => ({
      set: (patch: unknown) => {
        mockState.setSpy(patch);
        return {
          where: () => ({
            returning: async () => mockState.updateReturn,
          }),
        };
      },
    }),
    insert: () => ({
      values: (row: unknown) => {
        mockState.insertSpy(row);
        return {
          returning: async () => mockState.updateReturn,
        };
      },
    }),
  },
  schema: {
    leads: {
      id: "id",
      status: "status",
      source: "source",
      createdAt: "createdAt",
    },
  },
}));
```

And extend `mockState`:

```ts
const mockState: {
  selectRows: Lead[];
  selectByIdRows: Lead[];
  updateReturn: Lead[];
  whereSpy: ReturnType<typeof vi.fn>;
  setSpy: ReturnType<typeof vi.fn>;
  insertSpy: ReturnType<typeof vi.fn>;
} = {
  selectRows: [],
  selectByIdRows: [],
  updateReturn: [],
  whereSpy: vi.fn(),
  setSpy: vi.fn(),
  insertSpy: vi.fn(),
};
```

- [ ] **Step 2: Run the tests — expect FAIL (functions not exported)**

```powershell
pnpm -F web-next test -- "lib/admin/leads.test"
```

Expected: `createLead is not exported` (or similar) errors.

- [ ] **Step 3: Extend `lib/admin/leads.ts` with the new functions**

Append to `apps/web-next/lib/admin/leads.ts`:

```ts
export type CreateLeadInput = {
  source: "contact_form" | "cal";
  sourceDetail?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  privacyVersion: string;
};

export async function createLead(input: CreateLeadInput): Promise<Lead | null> {
  const rows = await db
    .insert(schema.leads)
    .values({
      source: input.source,
      sourceDetail: input.sourceDetail ?? null,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message ?? null,
      status: "new",
      privacyAcceptedAt: new Date(),
      privacyVersion: input.privacyVersion,
    })
    .returning();
  return rows[0] ?? null;
}

export type NotificationOutcome =
  | { ok: true }
  | { ok: false; error: string };

export async function recordLeadNotification(
  leadId: string,
  outcome: NotificationOutcome,
): Promise<void> {
  const patch = outcome.ok
    ? { lastNotifiedAt: new Date(), notificationError: null, updatedAt: new Date() }
    : { lastNotifiedAt: null, notificationError: outcome.error, updatedAt: new Date() };
  await db
    .update(schema.leads)
    .set(patch)
    .where(eq(schema.leads.id, leadId))
    .returning();
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- "lib/admin/leads.test"
```

Expected: all leads-service tests passing (the original 10 from Phase 2 + 5 new = 15).

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/admin/leads.ts apps/web-next/lib/admin/leads.test.ts
git commit -m "feat(web-next): createLead + recordLeadNotification in lib/admin/leads (TDD)"
```

---

## Task 2: Add `sendLeadNotification` to `lib/email.ts` (TDD)

**Files:**
- Modify: `apps/web-next/lib/email.ts`
- Modify: `apps/web-next/lib/email.test.ts`

The contact-form intake calls this to notify Hassan when a lead arrives. Same Resend wrapper pattern as `sendTestEmail`, with HTML-escaped lead fields (uses the existing `escapeHtml` helper).

- [ ] **Step 1: Append failing tests to `lib/email.test.ts`**

Append at the bottom of the existing file:

```ts
describe("sendLeadNotification", () => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.RESEND_FROM;

  beforeEach(() => {
    sendMock.mockReset();
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalFrom === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = originalFrom;
  });

  it("returns ok:false when Resend not configured", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.RESEND_FROM = "from@x.com";
    const r = await sendLeadNotification("a@b.com", {
      name: "Mara",
      email: "mara@x.com",
      message: "Hi",
      source: "contact_form",
    });
    expect(r.ok).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends with the lead fields HTML-escaped", async () => {
    process.env.RESEND_API_KEY = "re_x";
    process.env.RESEND_FROM = "from@x.com";
    sendMock.mockResolvedValue({ data: { id: "msg-9" }, error: null });
    const r = await sendLeadNotification("a@b.com", {
      name: '<script>alert("x")</script>',
      email: "mara@x.com",
      message: "Use & < > tags carefully",
      source: "contact_form",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.id).toBe("msg-9");
    const sentArgs = sendMock.mock.calls[0]?.[0] as { html: string };
    expect(sentArgs.html).toContain("&lt;script&gt;");
    expect(sentArgs.html).toContain("Use &amp; &lt; &gt; tags");
    expect(sentArgs.html).not.toContain("<script>");
  });

  it("returns ok:false with the Resend error on failure", async () => {
    process.env.RESEND_API_KEY = "re_x";
    process.env.RESEND_FROM = "from@x.com";
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "rate limited", name: "RateLimitError" },
    });
    const r = await sendLeadNotification("a@b.com", {
      name: "X",
      email: "x@y.com",
      message: "Z",
      source: "contact_form",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("rate limited");
  });
});
```

And add `sendLeadNotification` to the imports at the top:

```ts
import { escapeHtml, getNotificationRecipient, sendLeadNotification, sendTestEmail } from "./email";
```

- [ ] **Step 2: Run the tests — expect FAIL (`sendLeadNotification` is not exported)**

```powershell
pnpm -F web-next test -- email.test
```

- [ ] **Step 3: Add `sendLeadNotification` to `lib/email.ts`**

Append after the existing `sendTestEmail` function (keep all existing exports):

```ts
export type LeadEmailFields = {
  name: string;
  email: string;
  message: string | null;
  source: "contact_form" | "cal";
  phone?: string | null;
};

export async function sendLeadNotification(
  recipient: string,
  lead: LeadEmailFields,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey) {
    return { ok: false, error: "Resend not configured: RESEND_API_KEY is missing" };
  }
  if (!from) {
    return { ok: false, error: "Resend not configured: RESEND_FROM is missing" };
  }
  if (!recipient || !recipient.trim()) {
    return { ok: false, error: "No recipient address resolved from site_config" };
  }

  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = lead.phone ? escapeHtml(lead.phone) : "—";
  const safeMessage = lead.message ? escapeHtml(lead.message) : "(no message)";
  const sourceLabel = lead.source === "cal" ? "Cal.com booking" : "Contact form";

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: recipient,
    subject: `New lead from ${safeName} (${sourceLabel})`,
    html: `
      <p>You received a new lead via the ${sourceLabel}.</p>
      <ul>
        <li><strong>Name:</strong> ${safeName}</li>
        <li><strong>Email:</strong> ${safeEmail}</li>
        <li><strong>Phone:</strong> ${safePhone}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
    text:
      `New lead via ${sourceLabel}.\n` +
      `Name: ${lead.name}\n` +
      `Email: ${lead.email}\n` +
      `Phone: ${lead.phone ?? "—"}\n\n` +
      `Message:\n${lead.message ?? "(no message)"}`,
  });

  if (result.error) {
    return { ok: false, error: result.error.message ?? "Unknown Resend error" };
  }
  if (!result.data?.id) {
    return { ok: false, error: "Resend returned no message id" };
  }
  return { ok: true, id: result.data.id };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- email.test
```

Expected: original 7 tests + 3 new = 10 passing.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/email.ts apps/web-next/lib/email.test.ts
git commit -m "feat(web-next): sendLeadNotification in lib/email with HTML-escaped fields (TDD)"
```

---

## Task 3: `POST /api/leads` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/leads/route.test.ts`
- Create: `apps/web-next/app/api/leads/route.ts`

Public CORS endpoint. Validates with zod, runs honeypot + min-delay anti-spam, inserts the lead, sends the Resend notification, records the notification outcome. **Always returns 200 with `{ ok: true }` if (a) anti-spam rejects (silent), or (b) the lead row was inserted (even if Resend later fails).**

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/app/api/leads/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.PUBLIC_ALLOWED_ORIGINS = "https://itshassan.it,http://localhost:5173";
  process.env.PRIVACY_VERSION = "v1-2026-05";
});

const createLeadMock = vi.fn();
const recordLeadNotificationMock = vi.fn();
vi.mock("@/lib/admin/leads", () => ({
  createLead: (input: unknown) => createLeadMock(input),
  recordLeadNotification: (id: string, outcome: unknown) =>
    recordLeadNotificationMock(id, outcome),
}));

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

const sendMock = vi.fn();
vi.mock("@/lib/email", async () => {
  const actual = await vi.importActual<typeof import("@/lib/email")>("@/lib/email");
  return {
    ...actual,
    sendLeadNotification: (...args: unknown[]) => sendMock(...args),
  };
});

import { OPTIONS, POST } from "./route";

function makeRequest(
  body: unknown,
  origin: string | null = "https://itshassan.it",
) {
  return new Request("https://admin.itshassan.it/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

const validBody = (overrides: Record<string, unknown> = {}) => ({
  name: "Mara",
  email: "mara@example.com",
  message: "Hi from the contact form",
  company_website: "",
  started_at: Date.now() - 5000, // 5s ago — passes the 3s min-delay
  privacy_accepted: true,
  ...overrides,
});

describe("POST /api/leads", () => {
  beforeEach(() => {
    createLeadMock.mockReset();
    recordLeadNotificationMock.mockReset();
    getSiteConfigMock.mockReset();
    sendMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      phone: "",
      contactEmail: "h@x.com",
      notifyEmail: null,
    });
    sendMock.mockResolvedValue({ ok: true, id: "msg-1" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("OPTIONS preflight returns 204 with CORS headers", async () => {
    const req = new Request("https://admin.itshassan.it/api/leads", {
      method: "OPTIONS",
      headers: { origin: "https://itshassan.it" },
    });
    const res = await OPTIONS(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("rejects requests from disallowed origins (403)", async () => {
    const res = await POST(makeRequest(validBody(), "https://evil.com"));
    expect(res.status).toBe(403);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("returns 400 on malformed body", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("silently 200s when honeypot is filled (no insert, no email)", async () => {
    const res = await POST(makeRequest(validBody({ company_website: "https://spam.example" })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently 200s when submit happens within 3s of started_at", async () => {
    const res = await POST(makeRequest(validBody({ started_at: Date.now() - 1000 })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when privacy_accepted is false", async () => {
    const res = await POST(makeRequest(validBody({ privacy_accepted: false })));
    expect(res.status).toBe(400);
    expect(createLeadMock).not.toHaveBeenCalled();
  });

  it("inserts a lead with PRIVACY_VERSION stamped and triggers Resend", async () => {
    createLeadMock.mockResolvedValueOnce({ id: "lead-1", email: "mara@example.com" });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(createLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "contact_form",
        name: "Mara",
        email: "mara@example.com",
        message: "Hi from the contact form",
        privacyVersion: "v1-2026-05",
      }),
    );
    expect(sendMock).toHaveBeenCalledWith(
      "h@x.com",
      expect.objectContaining({ name: "Mara", source: "contact_form" }),
    );
    expect(recordLeadNotificationMock).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ ok: true }),
    );
  });

  it("still returns 200 when Resend fails, and records the notification error", async () => {
    createLeadMock.mockResolvedValueOnce({ id: "lead-2" });
    sendMock.mockResolvedValueOnce({ ok: false, error: "Resend down" });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    expect(recordLeadNotificationMock).toHaveBeenCalledWith(
      "lead-2",
      expect.objectContaining({ ok: false, error: "Resend down" }),
    );
  });

  it("returns 500 when createLead fails to insert (no row returned)", async () => {
    createLeadMock.mockResolvedValueOnce(null);
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
    expect(recordLeadNotificationMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL (module not found)**

```powershell
pnpm -F web-next test -- "api/leads/route.test"
```

- [ ] **Step 3: Write the route**

Write `apps/web-next/app/api/leads/route.ts`:

```ts
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
      name: lead.name,
      email: lead.email,
      message: lead.message,
      source: lead.source,
      phone: lead.phone,
    });
    await recordLeadNotification(lead.id, result).catch(() => {
      // Notification bookkeeping failure is non-fatal — lead is already saved.
    });
  } else {
    await recordLeadNotification(lead.id, {
      ok: false,
      error: "site_config not seeded — no recipient resolved",
    }).catch(() => {});
  }

  return silent200(origin);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- "api/leads/route.test"
```

Expected: 9 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/leads/
git commit -m "feat(web-next): POST /api/leads public intake (zod + honeypot + delay + Resend + DB-as-truth) (TDD)"
```

---

## Task 4: `GET /api/site-config` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/site-config/route.test.ts`
- Create: `apps/web-next/app/api/site-config/route.ts`

Public read of the singleton row. Returns `{ phone, contactEmail }` only — `notifyEmail` is admin-internal and never exposed. CORS-allowed for `itshassan.it` and local dev. Cache headers let Vercel's CDN serve repeat requests.

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/app/api/site-config/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.PUBLIC_ALLOWED_ORIGINS = "https://itshassan.it,http://localhost:5173";
});

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

import { GET, OPTIONS } from "./route";

function makeRequest(method: "GET" | "OPTIONS", origin: string | null) {
  return new Request("https://admin.itshassan.it/api/site-config", {
    method,
    headers: origin ? { origin } : {},
  });
}

describe("public /api/site-config", () => {
  beforeEach(() => {
    getSiteConfigMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      phone: "+39 333 1234567",
      contactEmail: "hello@itshassan.it",
      notifyEmail: "admin-only@itshassan.it",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("OPTIONS preflight returns 204 with CORS headers", async () => {
    const res = await OPTIONS(makeRequest("OPTIONS", "https://itshassan.it"));
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
  });

  it("OPTIONS rejects disallowed origins", async () => {
    const res = await OPTIONS(makeRequest("OPTIONS", "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("rejects GET from disallowed origins (403)", async () => {
    const res = await GET(makeRequest("GET", "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns only phone + contactEmail (never notifyEmail)", async () => {
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toEqual({
      phone: "+39 333 1234567",
      contactEmail: "hello@itshassan.it",
    });
    expect(body.notifyEmail).toBeUndefined();
  });

  it("sets CORS + cache headers on success", async () => {
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(res.headers.get("Cache-Control")).toMatch(/s-maxage=60/);
    expect(res.headers.get("Cache-Control")).toMatch(/stale-while-revalidate=600/);
  });

  it("returns 503 when getSiteConfig throws (DB down / not seeded)", async () => {
    getSiteConfigMock.mockRejectedValueOnce(new Error("seed missing"));
    const res = await GET(makeRequest("GET", "https://itshassan.it"));
    expect(res.status).toBe(503);
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL**

```powershell
pnpm -F web-next test -- "api/site-config/route.test"
```

- [ ] **Step 3: Write the route**

Write `apps/web-next/app/api/site-config/route.ts`:

```ts
import type { NextRequest } from "next/server";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { isAllowedPublicOrigin, withCors } from "@/lib/origin";

export const runtime = "nodejs";

export async function OPTIONS(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return withCors(new Response(null, { status: 204 }), origin, "public");
}

export async function GET(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const config = await getSiteConfig();
    const publicShape = {
      phone: config.phone,
      contactEmail: config.contactEmail,
    };
    const response = Response.json(publicShape);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=600",
    );
    return withCors(response, origin, "public");
  } catch {
    return withCors(
      Response.json({ error: "Site config unavailable" }, { status: 503 }),
      origin,
      "public",
    );
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- "api/site-config/route.test"
```

Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/site-config/
git commit -m "feat(web-next): GET /api/site-config public read with CORS + cache headers (TDD)"
```

---

## Task 5: Add `VITE_ADMIN_API_BASE` to `apps/docs/.env.example`

**Files:**
- Create: `apps/docs/.env.example`

`apps/docs` currently has no `.env.example`. Phase 3 introduces one env var (the base URL of the admin domain).

- [ ] **Step 1: Create the file**

Write `apps/docs/.env.example`:

```bash
# Base URL of the admin API (apps/web-next).
# Dev:  http://localhost:3001
# Prod: https://admin.itshassan.it
VITE_ADMIN_API_BASE=http://localhost:3001
```

- [ ] **Step 2: Confirm `.env.local` is gitignored**

Read the repo-root `.gitignore`. The pattern `**/.env*.local` should already cover `apps/docs/.env.local` (from the Phase 1 pre-flight). If it doesn't, add `apps/docs/.env.local` explicitly.

```powershell
Select-String -Path .gitignore -Pattern "env.*local"
```

Expected: at least one match.

- [ ] **Step 3: Commit**

```powershell
git add apps/docs/.env.example
git commit -m "chore(docs): document VITE_ADMIN_API_BASE in .env.example"
```

---

## Task 6: Extend i18n messages with privacy + form-error strings (3 locales)

**Files:**
- Modify: `apps/docs/src/i18n/messages.ts`

Adds the `Messages["contact"]` form-error labels (closes followup A17 — hardcoded English in the zod schema). Adds the `Messages["privacy"]` block for the new `/privacy` page + the inline checkbox label/link text.

- [ ] **Step 1: Extend the `Messages` type**

Find the `contact:` block in the type (around line 57) and replace it with:

```ts
  contact: {
    title: string;
    note: string;
    emailMe: string;
    github: string;
    linkedin: string;
    bookCall: string;
    downloadCv: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formError: string;
    formErrorNameShort: string;
    formErrorEmailInvalid: string;
    formErrorMessageShort: string;
    formErrorPrivacyRequired: string;
    privacyLabel: string;
    privacyLink: string;
  };
```

Add a new `privacy` block right after the `cv:` type (before `system:`):

```ts
  privacy: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    backToSite: string;
  };
```

- [ ] **Step 2: Extend the EN dictionary**

Inside the `en:` object's `contact:` block, replace the existing keys with:

```ts
    contact: {
      title: "Get in touch",
      note: "Quick to reply on weekdays.",
      emailMe: "Email me",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Book a call",
      downloadCv: "Open CV page",
      formName: "Your name",
      formEmail: "Your email",
      formMessage: "Your message",
      formSubmit: "Send",
      formSubmitting: "Sending...",
      formSuccess: "Thanks! I'll get back to you.",
      formError: "Could not send the message. Please retry in a moment.",
      formErrorNameShort: "Please use at least 2 characters.",
      formErrorEmailInvalid: "That email doesn't look right.",
      formErrorMessageShort: "Please write at least 10 characters.",
      formErrorPrivacyRequired: "Please accept the privacy notice to continue.",
      privacyLabel: "I have read and accept the",
      privacyLink: "privacy notice",
    },
```

(Keep the original `title` / `note` / etc. values if they differ in the current file — only ADD the new keys. The replacement above assumes the canonical EN values; adjust to whatever already exists.)

Add after the `cv:` block, before the `system:` block:

```ts
    privacy: {
      title: "Privacy notice",
      intro:
        "When you use the contact form on itshassan.it I receive your name, email, and message. I use that data only to reply to you.",
      sections: [
        {
          heading: "What I collect",
          body:
            "Name, email address, the message you write, and the timestamp of the submission. I also automatically receive a request origin (for spam protection) — nothing else.",
        },
        {
          heading: "Why I collect it",
          body:
            "To answer your message. The legal basis is your consent (checkbox on the form). You can withdraw at any time by emailing me.",
        },
        {
          heading: "Where it lives",
          body:
            "Inside a private Neon Postgres database in the Frankfurt region (EU). Email notifications are sent via Resend. I do not share your data with anyone else and do not run ads or trackers.",
        },
        {
          heading: "How long",
          body:
            "Up to 24 months, then deleted. You can ask me to delete sooner — write to the same address you used to contact me.",
        },
        {
          heading: "Your rights",
          body:
            "Access, correction, deletion, portability, and the right to lodge a complaint with the supervisory authority. Email me to exercise them.",
        },
      ],
      backToSite: "Back to portfolio",
    },
```

- [ ] **Step 3: Extend the IT dictionary**

Replace the `contact:` block with:

```ts
    contact: {
      title: "Contatti",
      note: "Risposta rapida nei giorni feriali.",
      emailMe: "Scrivimi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Prenota una call",
      downloadCv: "Apri pagina CV",
      formName: "Il tuo nome",
      formEmail: "La tua email",
      formMessage: "Il tuo messaggio",
      formSubmit: "Invia",
      formSubmitting: "Invio in corso...",
      formSuccess: "Grazie! Ti rispondo a breve.",
      formError: "Invio non riuscito. Riprova tra un momento.",
      formErrorNameShort: "Inserisci almeno 2 caratteri.",
      formErrorEmailInvalid: "L'email non sembra valida.",
      formErrorMessageShort: "Scrivi almeno 10 caratteri.",
      formErrorPrivacyRequired: "Accetta l'informativa privacy per continuare.",
      privacyLabel: "Ho letto e accetto l'",
      privacyLink: "informativa privacy",
    },
```

And the `privacy:` block:

```ts
    privacy: {
      title: "Informativa privacy",
      intro:
        "Quando usi il modulo di contatto su itshassan.it ricevo nome, email e messaggio. Uso questi dati solo per risponderti.",
      sections: [
        {
          heading: "Cosa raccolgo",
          body:
            "Nome, email, il messaggio che scrivi e il timestamp dell'invio. Ricevo anche l'origine della richiesta (per la protezione anti-spam) — nient'altro.",
        },
        {
          heading: "Perché lo raccolgo",
          body:
            "Per rispondere al tuo messaggio. La base legale è il tuo consenso (checkbox sul modulo). Puoi revocarlo in qualsiasi momento scrivendomi.",
        },
        {
          heading: "Dove sono i dati",
          body:
            "In un database privato Neon Postgres nella regione di Francoforte (UE). Le notifiche email passano da Resend. Non condivido i tuoi dati con nessuno e non uso pubblicità o tracker.",
        },
        {
          heading: "Per quanto tempo",
          body:
            "Fino a 24 mesi, poi cancello. Puoi chiedermi di cancellare prima — scrivimi all'indirizzo che hai usato per contattarmi.",
        },
        {
          heading: "I tuoi diritti",
          body:
            "Accesso, rettifica, cancellazione, portabilità e diritto di reclamo all'autorità di controllo. Scrivimi per esercitarli.",
        },
      ],
      backToSite: "Torna al portfolio",
    },
```

- [ ] **Step 4: Extend the FR dictionary**

Replace the `contact:` block with:

```ts
    contact: {
      title: "Contactez-moi",
      note: "Numéro partagé sur demande par email.",
      emailMe: "Écrivez-moi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Réserver un appel",
      downloadCv: "Ouvrir page CV",
      formName: "Votre nom",
      formEmail: "Votre email",
      formMessage: "Votre message",
      formSubmit: "Envoyer",
      formSubmitting: "Envoi en cours...",
      formSuccess: "Merci ! Je vous réponds rapidement.",
      formError: "Envoi impossible. Veuillez réessayer dans un instant.",
      formErrorNameShort: "Saisissez au moins 2 caractères.",
      formErrorEmailInvalid: "Cet email n'a pas l'air valide.",
      formErrorMessageShort: "Écrivez au moins 10 caractères.",
      formErrorPrivacyRequired: "Acceptez la politique de confidentialité pour continuer.",
      privacyLabel: "J'ai lu et j'accepte la",
      privacyLink: "politique de confidentialité",
    },
```

And the `privacy:` block:

```ts
    privacy: {
      title: "Politique de confidentialité",
      intro:
        "Lorsque vous utilisez le formulaire de contact sur itshassan.it, je reçois votre nom, email et message. J'utilise ces données uniquement pour vous répondre.",
      sections: [
        {
          heading: "Ce que je collecte",
          body:
            "Nom, email, le message que vous écrivez et la date d'envoi. Je reçois aussi l'origine de la requête (protection anti-spam) — rien d'autre.",
        },
        {
          heading: "Pourquoi je collecte",
          body:
            "Pour répondre à votre message. La base légale est votre consentement (case à cocher du formulaire). Vous pouvez le retirer à tout moment en m'écrivant.",
        },
        {
          heading: "Où sont les données",
          body:
            "Dans une base Neon Postgres privée dans la région de Francfort (UE). Les notifications email passent par Resend. Je ne partage pas vos données et n'utilise ni publicité ni tracker.",
        },
        {
          heading: "Pendant combien de temps",
          body:
            "Jusqu'à 24 mois, puis suppression. Vous pouvez demander une suppression plus tôt — écrivez-moi à l'adresse que vous avez utilisée.",
        },
        {
          heading: "Vos droits",
          body:
            "Accès, rectification, suppression, portabilité et droit de réclamation auprès de l'autorité de contrôle. Écrivez-moi pour les exercer.",
        },
      ],
      backToSite: "Retour au portfolio",
    },
```

- [ ] **Step 5: Typecheck**

```powershell
pnpm -F docs typecheck
```

Expected: PASS. (If it errors with a missing field in a locale, you missed adding the new keys to one of EN/IT/FR — fix and re-run.)

- [ ] **Step 6: Commit**

```powershell
git add apps/docs/src/i18n/messages.ts
git commit -m "feat(docs): i18n strings for contact form errors + privacy notice (en/it/fr)"
```

---

## Task 7: Refactor `contactForm.schema.ts` to a factory + add honeypot/privacy (TDD)

**Files:**
- Modify: `apps/docs/src/components/sections/contactForm.schema.ts`
- Modify: `apps/docs/src/components/sections/contactForm.schema.test.ts`

The schema becomes a factory taking i18n labels so error messages are localized. The shape gains `companyWebsite` (honeypot), `startedAt` (form render timestamp), `privacyAccepted` (boolean).

- [ ] **Step 1: Replace the test file**

Overwrite `apps/docs/src/components/sections/contactForm.schema.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import { createContactSchema, initialContactValues } from "./contactForm.schema";

const labels = {
  nameShort: "name too short",
  emailInvalid: "bad email",
  messageShort: "msg too short",
  privacyRequired: "privacy required",
};

const valid = {
  name: "Mara",
  email: "mara@x.com",
  message: "Hi there, this is a valid message",
  companyWebsite: "",
  startedAt: Date.now() - 5000,
  privacyAccepted: true as const,
};

describe("createContactSchema", () => {
  it("accepts a valid payload", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects short name with the localized message", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("name too short");
    }
  });

  it("rejects bad email", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects when privacyAccepted is false", () => {
    const schema = createContactSchema(labels);
    const result = schema.safeParse({ ...valid, privacyAccepted: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("privacy required");
    }
  });

  it("allows companyWebsite to be empty or absent (honeypot)", () => {
    const schema = createContactSchema(labels);
    const r1 = schema.safeParse({ ...valid, companyWebsite: "" });
    expect(r1.success).toBe(true);
    const { companyWebsite: _omit, ...withoutHoneypot } = valid;
    const r2 = schema.safeParse(withoutHoneypot);
    expect(r2.success).toBe(true);
  });
});

describe("initialContactValues", () => {
  it("returns sensible defaults with a fresh startedAt timestamp", () => {
    const before = Date.now();
    const values = initialContactValues();
    const after = Date.now();
    expect(values.name).toBe("");
    expect(values.email).toBe("");
    expect(values.message).toBe("");
    expect(values.companyWebsite).toBe("");
    expect(values.privacyAccepted).toBe(false);
    expect(values.startedAt).toBeGreaterThanOrEqual(before);
    expect(values.startedAt).toBeLessThanOrEqual(after);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (`createContactSchema` not exported)**

```powershell
pnpm -F docs test -- "contactForm.schema"
```

- [ ] **Step 3: Overwrite the schema file**

Replace the entire contents of `apps/docs/src/components/sections/contactForm.schema.ts` with:

```ts
import { z } from "zod";

export type ContactFormErrorLabels = {
  nameShort: string;
  emailInvalid: string;
  messageShort: string;
  privacyRequired: string;
};

export function createContactSchema(labels: ContactFormErrorLabels) {
  return z.object({
    name: z.string().min(2, labels.nameShort).max(120),
    email: z.string().email(labels.emailInvalid),
    message: z.string().min(10, labels.messageShort).max(5000),
    companyWebsite: z.string().optional(),
    startedAt: z.number(),
    privacyAccepted: z
      .boolean()
      .refine((v) => v === true, { message: labels.privacyRequired }),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;

export function initialContactValues(): ContactValues {
  return {
    name: "",
    email: "",
    message: "",
    companyWebsite: "",
    startedAt: Date.now(),
    // `false` is intentionally outside the refined `true` narrowing — TS allows
    // it because the input type of safeParse is `unknown`. The form state holds
    // the pre-validated value.
    privacyAccepted: false as unknown as true,
  };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F docs test -- "contactForm.schema"
```

Expected: 7 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/docs/src/components/sections/contactForm.schema.ts apps/docs/src/components/sections/contactForm.schema.test.ts
git commit -m "feat(docs): contact form schema factory with localized errors + honeypot + privacy (TDD)"
```

---

## Task 8: `apps/docs/src/lib/siteConfig.ts` — fetcher with localStorage cache + fallback (TDD)

**Files:**
- Create: `apps/docs/src/lib/siteConfig.ts`
- Create: `apps/docs/src/lib/siteConfig.test.ts`

Single-function fetcher: hits `${VITE_ADMIN_API_BASE}/api/site-config`, caches the result in localStorage for 5 minutes, falls back to hard-coded defaults if the admin is unreachable.

- [ ] **Step 1: Write the failing test**

Write `apps/docs/src/lib/siteConfig.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PUBLIC_SITE_CONFIG_FALLBACK,
  SITE_CONFIG_CACHE_KEY,
  SITE_CONFIG_CACHE_TTL_MS,
  fetchPublicSiteConfig,
} from "./siteConfig";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("localStorage", {
    _store: new Map<string, string>(),
    getItem(key: string) {
      return this._store.has(key) ? this._store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      this._store.set(key, value);
    },
    removeItem(key: string) {
      this._store.delete(key);
    },
    clear() {
      this._store.clear();
    },
  });
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPublicSiteConfig", () => {
  it("returns the fetched value and caches it in localStorage", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ phone: "+39 1", contactEmail: "a@b.com" }),
        { status: 200 },
      ),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+39 1", contactEmail: "a@b.com" });
    const cached = localStorage.getItem(SITE_CONFIG_CACHE_KEY);
    expect(cached).not.toBeNull();
    const parsed = JSON.parse(cached!);
    expect(parsed.value).toEqual({ phone: "+39 1", contactEmail: "a@b.com" });
    expect(typeof parsed.fetchedAt).toBe("number");
  });

  it("serves from localStorage when the cache entry is fresh", async () => {
    localStorage.setItem(
      SITE_CONFIG_CACHE_KEY,
      JSON.stringify({
        value: { phone: "+1 cached", contactEmail: "cached@x.com" },
        fetchedAt: Date.now() - 60_000,
      }),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+1 cached", contactEmail: "cached@x.com" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refetches when the cache entry is older than TTL", async () => {
    localStorage.setItem(
      SITE_CONFIG_CACHE_KEY,
      JSON.stringify({
        value: { phone: "+1 stale", contactEmail: "stale@x.com" },
        fetchedAt: Date.now() - (SITE_CONFIG_CACHE_TTL_MS + 1000),
      }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ phone: "+1 fresh", contactEmail: "fresh@x.com" }),
        { status: 200 },
      ),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+1 fresh", contactEmail: "fresh@x.com" });
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns the hard-coded fallback when fetch rejects", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });

  it("returns the hard-coded fallback when fetch returns non-2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("oops", { status: 503 }));
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });

  it("returns the hard-coded fallback when the JSON shape is wrong", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ phone: 42 }), { status: 200 }),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL (module not found)**

```powershell
pnpm -F docs test -- "siteConfig"
```

- [ ] **Step 3: Write the implementation**

Write `apps/docs/src/lib/siteConfig.ts`:

```ts
export type PublicSiteConfig = {
  phone: string;
  contactEmail: string;
};

export const PUBLIC_SITE_CONFIG_FALLBACK: PublicSiteConfig = {
  phone: "",
  contactEmail: "hassan.akkari01@gmail.com",
};

export const SITE_CONFIG_CACHE_KEY = "itshassan.siteConfig.v1";
export const SITE_CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  value: PublicSiteConfig;
  fetchedAt: number;
};

function readCache(): PublicSiteConfig | null {
  try {
    const raw = globalThis.localStorage?.getItem(SITE_CONFIG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CacheEntry>;
    if (
      !parsed ||
      typeof parsed.fetchedAt !== "number" ||
      !parsed.value ||
      typeof parsed.value.phone !== "string" ||
      typeof parsed.value.contactEmail !== "string"
    ) {
      return null;
    }
    if (Date.now() - parsed.fetchedAt > SITE_CONFIG_CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(value: PublicSiteConfig) {
  try {
    const entry: CacheEntry = { value, fetchedAt: Date.now() };
    globalThis.localStorage?.setItem(SITE_CONFIG_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* localStorage may be unavailable (SSR, private mode); ignore. */
  }
}

function isValidShape(json: unknown): json is PublicSiteConfig {
  if (!json || typeof json !== "object") return false;
  const obj = json as Record<string, unknown>;
  return typeof obj.phone === "string" && typeof obj.contactEmail === "string";
}

export async function fetchPublicSiteConfig(
  adminBaseUrl: string,
): Promise<PublicSiteConfig> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const response = await fetch(`${adminBaseUrl}/api/site-config`, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) return PUBLIC_SITE_CONFIG_FALLBACK;
    const json = (await response.json()) as unknown;
    if (!isValidShape(json)) return PUBLIC_SITE_CONFIG_FALLBACK;
    writeCache(json);
    return json;
  } catch {
    return PUBLIC_SITE_CONFIG_FALLBACK;
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F docs test -- "siteConfig"
```

Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/docs/src/lib/siteConfig.ts apps/docs/src/lib/siteConfig.test.ts
git commit -m "feat(docs): siteConfig fetcher with localStorage cache + hard-coded fallback (TDD)"
```

---

## Task 9: Wire `ContactForm.tsx` to the admin endpoint

**Files:**
- Modify: `apps/docs/src/components/sections/ContactForm.tsx`

The form: builds a localized schema from i18n labels, holds state including honeypot + startedAt + privacyAccepted, submits via fetch to `${VITE_ADMIN_API_BASE}/api/leads`. Shows loading state during submit, success message on 200, generic error on network/server failure.

- [ ] **Step 1: Overwrite `ContactForm.tsx`**

Replace the entire contents of `apps/docs/src/components/sections/ContactForm.tsx` with:

```tsx
import { useMemo, useState, type FormEvent } from "react";
import { AppButton, AppInput, AppTextarea } from "@laboratoire/ui";
import {
  createContactSchema,
  initialContactValues,
  type ContactValues,
} from "./contactForm.schema";
import type { Messages } from "../../i18n/messages";

type ContactFormProps = {
  labels: Messages["contact"];
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const adminBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE as string | undefined)?.replace(
  /\/$/,
  "",
);

export default function ContactForm({ labels }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(() => initialContactValues());
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  const schema = useMemo(
    () =>
      createContactSchema({
        nameShort: labels.formErrorNameShort,
        emailInvalid: labels.formErrorEmailInvalid,
        messageShort: labels.formErrorMessageShort,
        privacyRequired: labels.formErrorPrivacyRequired,
      }),
    [labels],
  );

  const updateField = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (submit.kind === "success") setSubmit({ kind: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof ContactValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactValues | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      setSubmit({ kind: "idle" });
      return;
    }

    setErrors({});
    setSubmit({ kind: "submitting" });

    if (!adminBaseUrl) {
      setSubmit({ kind: "error", message: labels.formError });
      return;
    }

    try {
      const response = await fetch(`${adminBaseUrl}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
          company_website: result.data.companyWebsite ?? "",
          started_at: result.data.startedAt,
          privacy_accepted: result.data.privacyAccepted,
        }),
      });
      if (!response.ok) {
        setSubmit({ kind: "error", message: labels.formError });
        return;
      }
      setSubmit({ kind: "success" });
      setValues(initialContactValues());
    } catch {
      setSubmit({ kind: "error", message: labels.formError });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <AppInput
          type="text"
          name="Name"
          label={labels.formName}
          labelPlacement="inside"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          isInvalid={Boolean(errors.name)}
          errorMessage={errors.name}
          required
        />
      </div>

      <div className="form-field">
        <AppInput
          type="email"
          name="Email"
          label={labels.formEmail}
          labelPlacement="inside"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email}
          required
        />
      </div>

      <div className="form-field">
        <AppTextarea
          name="Message"
          label={labels.formMessage}
          labelPlacement="inside"
          minRows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          isInvalid={Boolean(errors.message)}
          errorMessage={errors.message}
          required
        />
      </div>

      {/* Honeypot — hidden from real users via tabIndex + aria-hidden + off-screen styling.
          Real submissions leave it empty; bots that auto-fill every input populate it,
          and the admin route silently 200s without inserting. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}
      >
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={values.companyWebsite ?? ""}
            onChange={(event) => updateField("companyWebsite", event.target.value)}
          />
        </label>
      </div>

      <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id="contact-privacy"
          checked={values.privacyAccepted === true}
          onChange={(event) =>
            updateField("privacyAccepted", event.target.checked as unknown as true)
          }
          required
        />
        <label htmlFor="contact-privacy" style={{ fontSize: 14 }}>
          {labels.privacyLabel}{" "}
          <a href={`${import.meta.env.BASE_URL}privacy`} target="_blank" rel="noreferrer">
            {labels.privacyLink}
          </a>
          .
        </label>
      </div>
      {errors.privacyAccepted && (
        <p className="form-field-error" style={{ color: "var(--app-error, #c33)" }}>
          {errors.privacyAccepted}
        </p>
      )}

      <AppButton type="submit" className="mt-2 w-fit" isDisabled={submit.kind === "submitting"}>
        {submit.kind === "submitting" ? labels.formSubmitting : labels.formSubmit}
      </AppButton>

      {submit.kind === "success" && (
        <span id="msg" role="status" aria-live="polite">
          {labels.formSuccess}
        </span>
      )}
      {submit.kind === "error" && (
        <span role="alert" aria-live="assertive">
          {submit.message}
        </span>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

```powershell
pnpm -F docs typecheck
pnpm -F docs lint
```

Expected: PASS. If `AppButton`'s `isDisabled` prop is misnamed (HeroUI sometimes uses `disabled`), swap accordingly — check `packages/ui/src/components/heroui/AppButton.tsx`.

- [ ] **Step 3: Commit**

```powershell
git add apps/docs/src/components/sections/ContactForm.tsx
git commit -m "feat(docs): wire ContactForm to admin /api/leads (honeypot + delay + privacy + i18n errors)"
```

---

## Task 10: Overlay `siteConfig` phone/email in `ContactSection.tsx`

**Files:**
- Modify: `apps/docs/src/components/sections/ContactSection.tsx`

The portfolio currently reads `content.contact.email` from the bundled JSON. Phase 3 lets the admin override it: ContactSection fetches from `siteConfig` on mount, falls back silently if the admin is unreachable.

- [ ] **Step 1: Read the current file to know what to preserve**

```powershell
Get-Content apps/docs/src/components/sections/ContactSection.tsx
```

(Identify where `contact.email` / `contact.phone` are rendered — those are the values to overlay.)

- [ ] **Step 2: Add the siteConfig effect**

Edit `apps/docs/src/components/sections/ContactSection.tsx`. Add these imports at the top:

```ts
import { useEffect, useState } from "react";
import { fetchPublicSiteConfig, PUBLIC_SITE_CONFIG_FALLBACK, type PublicSiteConfig } from "../../lib/siteConfig";
```

Inside the `ContactSection` component body (before the `return`), add:

```ts
const adminBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE as string | undefined)?.replace(/\/$/, "");
const [siteConfig, setSiteConfig] = useState<PublicSiteConfig>(PUBLIC_SITE_CONFIG_FALLBACK);

useEffect(() => {
  if (!adminBaseUrl) return;
  let cancelled = false;
  fetchPublicSiteConfig(adminBaseUrl).then((value) => {
    if (!cancelled) setSiteConfig(value);
  });
  return () => {
    cancelled = true;
  };
}, [adminBaseUrl]);

const displayEmail = siteConfig.contactEmail || contact.email;
const displayPhone = siteConfig.phone;
```

Replace any `{contact.email}` render in the JSX with `{displayEmail}`. If the component currently doesn't render `phone`, optionally add it under the email line:

```tsx
{displayPhone ? (
  <p className="contact-phone">
    <FaPhone /> {displayPhone}
  </p>
) : null}
```

(Skip the phone block if `FaPhone` isn't already imported — keep this task minimal; phone display can be a separate polish task.)

- [ ] **Step 3: Typecheck + lint**

```powershell
pnpm -F docs typecheck
pnpm -F docs lint
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add apps/docs/src/components/sections/ContactSection.tsx
git commit -m "feat(docs): overlay phone + contact email from admin siteConfig in ContactSection"
```

---

## Task 11: `/privacy` page + route

**Files:**
- Create: `apps/docs/src/pages/PrivacyPage.tsx`
- Modify: `apps/docs/src/App.tsx`

A standalone, lightweight page reachable from the contact form's checkbox label. Renders the localized privacy notice from `messages.<locale>.privacy`.

- [ ] **Step 1: Write the page**

Write `apps/docs/src/pages/PrivacyPage.tsx`:

```tsx
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import type { Messages } from "../i18n/messages";

type PrivacyPageProps = {
  labels: Messages;
};

export default function PrivacyPage({ labels }: PrivacyPageProps) {
  const { privacy } = labels;
  return (
    <Section id="privacy">
      <Container>
        <div className="privacy-page" style={{ maxWidth: "70ch", margin: "0 auto", padding: "32px 0" }}>
          <h1 className="sub-title">{privacy.title}</h1>
          <p>{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.heading} style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: "1.2rem", margin: "0 0 6px" }}>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p style={{ marginTop: 32 }}>
            <Link to="/">← {privacy.backToSite}</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Register the route in `App.tsx`**

In `apps/docs/src/App.tsx`, add the import next to the other page imports:

```ts
import PrivacyPage from "./pages/PrivacyPage";
```

In the `<Routes>` block (before the catch-all `<Route path="*" element={<Navigate to="/" replace />} />`), add:

```tsx
<Route path="/privacy" element={<PrivacyPage labels={labels} />} />
```

- [ ] **Step 3: Typecheck + lint**

```powershell
pnpm -F docs typecheck
pnpm -F docs lint
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add apps/docs/src/pages/PrivacyPage.tsx apps/docs/src/App.tsx
git commit -m "feat(docs): /privacy page with localized notice (en/it/fr) and route"
```

---

## Task 12: End-to-end manual smoke test

**Files:** none modified — verifying.

- [ ] **Step 1: Run all gates**

```powershell
pnpm -F web-next lint
pnpm -F web-next typecheck
pnpm -F web-next test

pnpm -F docs lint
pnpm -F docs typecheck
pnpm -F docs test
```

Expected: every command clean. Test counts after Phase 3 (rough):
- web-next: Phase 2's 57 + 5 (createLead/recordLeadNotification) + 3 (sendLeadNotification) + 9 (POST /api/leads) + 6 (GET /api/site-config) = **80 tests**.
- docs: previous 5 (contactForm.schema + portfolioContent.schema) - existing replaced + 7 (new contactForm.schema) + 6 (siteConfig) = **~15 tests**.

- [ ] **Step 2: Run both dev servers in parallel**

In two terminals:

```powershell
pnpm -F web-next dev      # port 3001
pnpm -F docs dev          # port 5173
```

- [ ] **Step 3: Walk the public surface in a browser**

Open `http://localhost:5173/`:

1. **Privacy link** — scroll to the contact section, find the privacy checkbox. The "privacy notice" link opens `/privacy`. Page renders, sections in your locale, back link works.
2. **Submit without consent** — fill the form fields but leave the privacy checkbox unchecked → inline error in the user's locale ("Please accept the privacy notice to continue." / Italian / French).
3. **Submit too fast** — refresh the page, fill the form quickly + check privacy + submit within 3 seconds → the success message renders (silent 200 from the API). Verify in the Neon SQL editor that NO row was inserted: `SELECT count(*) FROM leads;` should be unchanged.
4. **Submit a real lead** — fill the form, wait 5+ seconds, check privacy, submit → success message renders. Verify the row in Neon: `SELECT id, source, name, email, message, privacy_accepted_at, privacy_version, last_notified_at, notification_error FROM leads ORDER BY created_at DESC LIMIT 1;`. Expected: source `contact_form`, your inputs, `privacy_accepted_at` set, `privacy_version` = `v1-2026-05`, AND either `last_notified_at` (if Resend works) or `notification_error` (if Resend isn't configured).
5. **Honeypot** — open devtools, find the off-screen `company_website` input, type junk into it via the console: `document.querySelector('input[name="company_website"]').value = "https://spam.test"`. Submit (with valid other fields + privacy + 5s wait). Success message renders. Verify in Neon: NO new row.
6. **Site config overlay** — in `/admin/site-config` change the contact email + save. Wait 5 minutes (or clear localStorage key `itshassan.siteConfig.v1` in devtools), reload `/`, verify the contact section now shows the admin-saved email. Confirm `GET http://localhost:3001/api/site-config` from the browser network tab returns `{ phone, contactEmail }` only — no `notifyEmail`.
7. **Foreign origin sanity** — from devtools console on a different domain (e.g. `https://example.com`), `fetch('http://localhost:3001/api/site-config').then(r => r.text())`. Expect a 403 + browser CORS error.
8. **CORS preflight** — devtools network tab should show an `OPTIONS /api/leads` request followed by `POST /api/leads` on form submit. Both should be 2xx.

- [ ] **Step 4: Verify the admin can see the new leads**

Open `http://localhost:3001/admin`. Sign in. The new lead row(s) should appear in the table with source "Contact form", the message preview, and a "New" status pill. Click in → the detail page shows `notification_error` if Resend failed, or `last_notified_at` if it succeeded.

- [ ] **Step 5: Phase-3 checkpoint commit + tag**

```powershell
git status                    # expect clean
git tag phase-3-public
```

(Optional — gives a marker before Phase 4.)

---

## Self-review notes (read before reporting Phase 3 done)

1. **Spec coverage.** Phase 3 covers:
   - Build-order **step 8** (`POST /api/leads` with zod, honeypot, delay, Resend with error capture) → Task 3
   - Build-order **step 9** (`GET /api/site-config` public CORS + cache) → Task 4
   - Build-order **step 10** (`apps/docs` ContactForm wired + siteConfig fetcher with fallback) → Tasks 8, 9, 10
   - Spec decision **#19** (privacy: required checkbox + `/privacy` page + `privacy_accepted_at` + `privacy_version` stored on lead) → Tasks 6, 7, 9, 11
   - Spec decision **#10** (single recipient resolver via `getNotificationRecipient`) → Task 2 uses it; Task 3 routes through it. No call site reads `contact_email` directly.
   - Spec decision **#13** (`runtime = "nodejs"`) → every new route exports it.
   - Spec decision **#17** (CORS allowlists env-driven through `lib/origin`) → all new routes use `isAllowedPublicOrigin` + `withCors`.
   - Followup **A17** (i18n form errors) — Task 6 adds the labels, Task 7 plumbs them through the schema factory, Task 9 wires them through the form.
2. **Out of scope confirmed.** Cal embed/webhook, Vercel project setup, OVH CNAME, Resend domain verification, DEV_NO_DB cleanup — all Phase 4 or 5.
3. **Type consistency.**
   - JSON contract uses snake_case (`company_website`, `started_at`, `privacy_accepted`) per spec. TS internal state uses camelCase. Conversion happens at the fetch call in `ContactForm.tsx` (Task 9).
   - `createLead` returns `Lead | null`; the route returns 500 when null. `sendLeadNotification` returns `SendResult`; the route always returns 200 even when this is `{ok: false}` (logged via `recordLeadNotification`).
   - `PublicSiteConfig` is `{ phone, contactEmail }` — strict subset of the admin's `SiteConfig`. The route in Task 4 explicitly projects to this shape so `notifyEmail` can never leak.
4. **Placeholder scan.** No "TODO" / "TBD" / "fix later" in the plan. Every code step is complete.
5. **Anti-spam contract.** Honeypot and min-delay rejections are **silent 200s** per spec: never give bots a signal to retune. The route tests assert this. The form sees a success message either way — that's the intended UX.
6. **DB-as-truth.** The `POST /api/leads` route inserts the row before calling Resend, and a Resend failure does not roll back the row. `notification_error` is captured for retry-from-admin (future Phase). The route returns 500 only when the insert itself fails (no row returned).
7. **A9 followup not introduced.** Phase 3 deliberately does NOT add `siteConfig` to the existing `contentApi` RTK Query (which already mixes local JSON + GitHub origins per followup A9). The new fetcher is a plain function in `lib/siteConfig.ts` — keeps the audit smell from growing.
8. **i18n shape changes.** `Messages["contact"]` gains 7 keys (`formSubmitting`, `formError`, the 4 form-error labels, the 2 privacy labels) AND a new top-level `privacy` block. All three locales must add all new keys — Task 6 step 5's typecheck enforces this; if you miss one, TS errors with "missing property `formError` in type `Messages`".

---

## Phase 3 done — what's next

When this plan is fully checked off:

- A visitor submitting the contact form on the portfolio creates a row in the admin DB, Hassan gets a Resend notification, and the lead shows up in `/admin`.
- The portfolio reads `phone` + `contactEmail` live from the admin domain, with a 5-min localStorage cache + hard-coded fallback so the portfolio renders even if the admin is down.
- The `/privacy` page exists in EN/IT/FR and is reachable from the form's required consent checkbox.
- `pnpm check` passes everywhere. ~80 admin tests + ~15 docs tests green.

**Next plan to write:** **Phase 4 — Cal.com embed + webhook.** Scope: `@calcom/embed-react` integration on the portfolio's contact section + the `/audit` follow-up step, plus the `POST /api/cal/webhook` receiver on `apps/web-next` (raw body, HMAC verify against `CAL_WEBHOOK_SECRET`, `extractCalLead` defensive mapping, upsert on `cal_booking_id`). Cal.com Free tier webhook support is uncertain — Phase 4 should plan a fallback path where the embed ships even if webhooks aren't available, with bookings reconciled manually.

After Phase 4: **Phase 5 — Deployment.** New Vercel project for `apps/web-next` with Root Directory = `apps/web-next` and build command `pnpm -w turbo run build --filter=web-next...`. OVH CNAME `admin.itshassan.it → cname.vercel-dns.com`. Resend domain verification (SPF/DKIM/DMARC DNS in OVH). Cal webhook URL pointed at the production admin domain. Decision on the DEV_NO_DB escape hatch (keep as recovery flag or remove).
