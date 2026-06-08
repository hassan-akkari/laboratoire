# Cal.com Integration (Phase 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Book a Discovery Call" Cal.com popup button to the portfolio (`apps/docs`) and save every booking as a lead in the admin DB (`apps/web-next`) via HMAC-verified webhook.

**Architecture:** `apps/web-next` receives `POST /api/cal/webhook`, verifies the Cal.com HMAC-SHA256 signature, extracts the first attendee's name/email/startTime from the payload, then upserts a `source: "cal"` lead into the existing `leads` table. `BOOKING_RESCHEDULED` and `BOOKING_CANCELLED` update `bookingStatus` on the existing row (same `uid`). `BOOKING_CREATED` also fires an admin email notification via Resend. `apps/docs` installs `@calcom/embed-react`, renders a `CalBookButton` that opens a modal popup on click, and is wired into `FinalCTASection`.

**Tech Stack:** `@calcom/embed-react`, `node:crypto` (HMAC + timingSafeEqual), `zod` (webhook payload validation), Drizzle ORM (two-query upsert), Resend (admin notification email).

---

## Pre-flight checklist (before Task 1)

- `CAL_WEBHOOK_SECRET` copied from Cal.com → saved in `apps/web-next/.env.local`
- Cal.com event: `itshassan/discovery-call` (15 min, Cal Video)
- Cal.com webhook triggers configured: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
- Webhook subscriber URL: placeholder for now — update to `https://<your-domain>/api/cal/webhook` after deploy

---

## File Map

### apps/web-next

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/cal/verifySignature.ts` | CREATE | HMAC-SHA256 verify using `node:crypto` |
| `lib/cal/verifySignature.test.ts` | CREATE | Unit tests for signature verifier |
| `lib/cal/extract.ts` | CREATE | Zod schema + defensive payload extraction |
| `lib/cal/extract.test.ts` | CREATE | Unit tests for extractor |
| `lib/admin/leads.ts` | MODIFY | Add `upsertCalLead` function |
| `lib/admin/leads.test.ts` | MODIFY | Add tests for `upsertCalLead` |
| `app/api/cal/webhook/route.ts` | CREATE | `POST /api/cal/webhook` handler |
| `app/api/cal/webhook/route.test.ts` | CREATE | Integration tests for webhook route |
| `.env.example` | MODIFY | Uncomment `CAL_WEBHOOK_SECRET=` |

### apps/docs

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | MODIFY | Add `@calcom/embed-react` dependency |
| `src/components/ui/CalBookButton.tsx` | CREATE | Cal.com popup button component |
| `src/data/finalCtaContent.ts` | MODIFY | Add `calLabel` per locale |
| `src/components/sections/FinalCTASection.tsx` | MODIFY | Wire in `CalBookButton` |
| `.env.example` | MODIFY | Add `VITE_CAL_LINK=itshassan/discovery-call` |
| `.env.local` | MODIFY | Add `VITE_CAL_LINK=itshassan/discovery-call` |

---

## Task 1: Signature Verifier

**Files:**
- Create: `apps/web-next/lib/cal/verifySignature.ts`
- Create: `apps/web-next/lib/cal/verifySignature.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web-next/lib/cal/verifySignature.test.ts`:

```ts
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCalSignature } from "./verifySignature";

function sign(body: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

describe("verifyCalSignature", () => {
  const secret = "test-secret-abc123";
  const body = '{"triggerEvent":"BOOKING_CREATED"}';

  it("returns true when signature matches", () => {
    const sig = sign(body, secret);
    expect(verifyCalSignature(body, sig, secret)).toBe(true);
  });

  it("returns false when signature is wrong", () => {
    expect(verifyCalSignature(body, "sha256=wronghex", secret)).toBe(false);
  });

  it("returns false when signature header is null", () => {
    expect(verifyCalSignature(body, null, secret)).toBe(false);
  });

  it("returns false when header lacks sha256= prefix", () => {
    const hex = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyCalSignature(body, hex, secret)).toBe(false);
  });

  it("uses timingSafeEqual (lengths must match — different lengths return false not throw)", () => {
    expect(verifyCalSignature(body, "sha256=short", secret)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter web-next test lib/cal/verifySignature
```

Expected: FAIL with `Cannot find module './verifySignature'`

- [ ] **Step 3: Implement `verifySignature.ts`**

Create `apps/web-next/lib/cal/verifySignature.ts`:

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyCalSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  try {
    return timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter web-next test lib/cal/verifySignature
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web-next/lib/cal/verifySignature.ts apps/web-next/lib/cal/verifySignature.test.ts
git commit -m "feat(web-next): Cal.com HMAC-SHA256 signature verifier"
```

---

## Task 2: Payload Extractor

**Files:**
- Create: `apps/web-next/lib/cal/extract.ts`
- Create: `apps/web-next/lib/cal/extract.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web-next/lib/cal/extract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { extractCalBooking } from "./extract";

const basePayload = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    uid: "uid-abc123",
    type: "Discovery Call",
    startTime: "2026-06-01T09:00:00.000Z",
    attendees: [{ name: "Alice Rossi", email: "alice@example.com" }],
  },
};

describe("extractCalBooking", () => {
  it("extracts name, email, bookingId, startTime, eventType from BOOKING_CREATED", () => {
    const result = extractCalBooking(basePayload);
    expect(result).not.toBeNull();
    expect(result?.bookingId).toBe("uid-abc123");
    expect(result?.trigger).toBe("BOOKING_CREATED");
    expect(result?.name).toBe("Alice Rossi");
    expect(result?.email).toBe("alice@example.com");
    expect(result?.startTime).toEqual(new Date("2026-06-01T09:00:00.000Z"));
    expect(result?.eventType).toBe("Discovery Call");
  });

  it("extracts from BOOKING_RESCHEDULED", () => {
    const result = extractCalBooking({ ...basePayload, triggerEvent: "BOOKING_RESCHEDULED" });
    expect(result?.trigger).toBe("BOOKING_RESCHEDULED");
  });

  it("extracts from BOOKING_CANCELLED", () => {
    const result = extractCalBooking({ ...basePayload, triggerEvent: "BOOKING_CANCELLED" });
    expect(result?.trigger).toBe("BOOKING_CANCELLED");
  });

  it("returns null when triggerEvent is unknown", () => {
    expect(extractCalBooking({ ...basePayload, triggerEvent: "MEETING_ENDED" })).toBeNull();
  });

  it("returns null when attendees array is empty", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, attendees: [] } };
    expect(extractCalBooking(body)).toBeNull();
  });

  it("returns null when payload is missing uid", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, uid: undefined } };
    expect(extractCalBooking(body)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(extractCalBooking(null)).toBeNull();
    expect(extractCalBooking("string")).toBeNull();
  });

  it("sets startTime to null when startTime is missing", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, startTime: undefined } };
    const result = extractCalBooking(body);
    expect(result?.startTime).toBeNull();
  });

  it("sets eventType to null when type is missing", () => {
    const body = { ...basePayload, payload: { ...basePayload.payload, type: undefined } };
    const result = extractCalBooking(body);
    expect(result?.eventType).toBeNull();
  });

  it("preserves rawPayload as-is", () => {
    const result = extractCalBooking(basePayload);
    expect(result?.rawPayload).toBe(basePayload);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter web-next test lib/cal/extract
```

Expected: FAIL with `Cannot find module './extract'`

- [ ] **Step 3: Implement `extract.ts`**

Create `apps/web-next/lib/cal/extract.ts`:

```ts
import { z } from "zod";

const attendeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const payloadSchema = z.object({
  uid: z.string(),
  type: z.string().optional(),
  startTime: z.string().optional(),
  attendees: z.array(attendeeSchema).optional(),
});

const webhookSchema = z.object({
  triggerEvent: z.enum(["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"]),
  payload: payloadSchema,
});

export type CalExtract = {
  bookingId: string;
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  name: string;
  email: string;
  startTime: Date | null;
  eventType: string | null;
  rawPayload: unknown;
};

export function extractCalBooking(body: unknown): CalExtract | null {
  const result = webhookSchema.safeParse(body);
  if (!result.success) return null;
  const { triggerEvent, payload } = result.data;
  const attendee = payload.attendees?.[0];
  if (!attendee) return null;
  return {
    bookingId: payload.uid,
    trigger: triggerEvent,
    name: attendee.name,
    email: attendee.email,
    startTime: payload.startTime ? new Date(payload.startTime) : null,
    eventType: payload.type ?? null,
    rawPayload: body,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter web-next test lib/cal/extract
```

Expected: 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web-next/lib/cal/extract.ts apps/web-next/lib/cal/extract.test.ts
git commit -m "feat(web-next): Cal.com payload extractor with zod schema"
```

---

## Task 3: upsertCalLead

**Files:**
- Modify: `apps/web-next/lib/admin/leads.ts`
- Modify: `apps/web-next/lib/admin/leads.test.ts`

The DB schema already has all required columns: `calBookingId`, `calPayload`, `scheduledAt`, `bookingStatus` (enum: `scheduled`/`rescheduled`/`cancelled`), `source` enum includes `"cal"`. No migration needed.

- [ ] **Step 1: Write the failing tests**

Add to the bottom of `apps/web-next/lib/admin/leads.test.ts`:

```ts
describe("upsertCalLead", () => {
  beforeEach(() => {
    mockState.selectByIdRows = [];
    mockState.updateReturn = [];
    mockState.setSpy.mockReset();
    mockState.insertSpy.mockReset();
    mockState.whereSpy.mockReset();
  });

  it("inserts a new lead when no existing row found for calBookingId", async () => {
    mockState.selectByIdRows = [];
    const inserted = {
      id: "new-id",
      source: "cal",
      calBookingId: "uid-abc",
      bookingStatus: "scheduled",
      status: "new",
    };
    mockState.updateReturn = [inserted as unknown as Lead];
    const result = await upsertCalLead({
      calBookingId: "uid-abc",
      name: "Alice",
      email: "alice@example.com",
      scheduledAt: new Date("2026-06-01T09:00:00Z"),
      sourceDetail: "Discovery Call",
      calPayload: { uid: "uid-abc" },
      bookingStatus: "scheduled",
    });
    expect(result?.id).toBe("new-id");
    expect(mockState.insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "cal",
        calBookingId: "uid-abc",
        name: "Alice",
        email: "alice@example.com",
        bookingStatus: "scheduled",
        privacyVersion: "cal-implicit",
      }),
    );
  });

  it("updates bookingStatus when existing row found for calBookingId", async () => {
    const existing = { id: "existing-id", calBookingId: "uid-abc" } as unknown as Lead;
    mockState.selectByIdRows = [existing];
    const updated = { id: "existing-id", bookingStatus: "rescheduled" } as unknown as Lead;
    mockState.updateReturn = [updated];
    const result = await upsertCalLead({
      calBookingId: "uid-abc",
      name: "Alice",
      email: "alice@example.com",
      scheduledAt: new Date("2026-06-02T10:00:00Z"),
      sourceDetail: "Discovery Call",
      calPayload: { uid: "uid-abc" },
      bookingStatus: "rescheduled",
    });
    expect(result?.id).toBe("existing-id");
    expect(mockState.insertSpy).not.toHaveBeenCalled();
    expect(mockState.setSpy).toHaveBeenCalledWith(
      expect.objectContaining({ bookingStatus: "rescheduled" }),
    );
  });

  it("returns null when insert returns no row", async () => {
    mockState.selectByIdRows = [];
    mockState.updateReturn = [];
    const result = await upsertCalLead({
      calBookingId: "uid-xyz",
      name: "Bob",
      email: "bob@example.com",
      scheduledAt: null,
      sourceDetail: null,
      calPayload: {},
      bookingStatus: "scheduled",
    });
    expect(result).toBeNull();
  });
});
```

Add `upsertCalLead` to the import line at the top of the test file:
```ts
import {
  createLead,
  getLeadById,
  getLeads,
  recordLeadNotification,
  updateLead,
  upsertCalLead,
} from "./leads";
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm --filter web-next test lib/admin/leads
```

Expected: 3 new tests FAIL with `upsertCalLead is not a function`

- [ ] **Step 3: Implement `upsertCalLead` in `leads.ts`**

Add to the bottom of `apps/web-next/lib/admin/leads.ts` (after `recordLeadNotification`):

```ts
export type UpsertCalLeadInput = {
  calBookingId: string;
  name: string;
  email: string;
  scheduledAt: Date | null;
  sourceDetail: string | null;
  calPayload: unknown;
  bookingStatus: "scheduled" | "rescheduled" | "cancelled";
};

export async function upsertCalLead(input: UpsertCalLeadInput): Promise<Lead | null> {
  const existing = await db
    .select()
    .from(schema.leads)
    .where(eq(schema.leads.calBookingId, input.calBookingId))
    .limit(1);

  if (existing[0]) {
    const rows = await db
      .update(schema.leads)
      .set({
        bookingStatus: input.bookingStatus,
        scheduledAt: input.scheduledAt,
        calPayload: input.calPayload,
        updatedAt: new Date(),
      })
      .where(eq(schema.leads.id, existing[0].id))
      .returning();
    return rows[0] ?? null;
  }

  const rows = await db
    .insert(schema.leads)
    .values({
      source: "cal",
      sourceDetail: input.sourceDetail,
      name: input.name,
      email: input.email,
      calBookingId: input.calBookingId,
      calPayload: input.calPayload,
      scheduledAt: input.scheduledAt,
      bookingStatus: input.bookingStatus,
      status: "new",
      privacyAcceptedAt: new Date(),
      privacyVersion: "cal-implicit",
    })
    .returning();
  return rows[0] ?? null;
}
```

- [ ] **Step 4: Run all leads tests to verify they pass**

```bash
pnpm --filter web-next test lib/admin/leads
```

Expected: all tests PASS (existing + 3 new)

- [ ] **Step 5: Commit**

```bash
git add apps/web-next/lib/admin/leads.ts apps/web-next/lib/admin/leads.test.ts
git commit -m "feat(web-next): add upsertCalLead for idempotent Cal.com booking storage"
```

---

## Task 4: Webhook Route

**Files:**
- Create: `apps/web-next/app/api/cal/webhook/route.ts`
- Create: `apps/web-next/app/api/cal/webhook/route.test.ts`

`runtime = "nodejs"` is required — the route reads raw body text before JSON.parse (needed for HMAC verification) and uses `node:crypto` indirectly via `verifyCalSignature`.

- [ ] **Step 1: Write the failing tests**

Create `apps/web-next/app/api/cal/webhook/route.test.ts`:

```ts
import { createHmac } from "node:crypto";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.CAL_WEBHOOK_SECRET = "test-secret-xyz";
});

const verifyMock = vi.fn();
vi.mock("@/lib/cal/verifySignature", () => ({
  verifyCalSignature: (...args: unknown[]) => verifyMock(...args),
}));

const extractMock = vi.fn();
vi.mock("@/lib/cal/extract", () => ({
  extractCalBooking: (body: unknown) => extractMock(body),
}));

const upsertMock = vi.fn();
const recordNotifMock = vi.fn();
vi.mock("@/lib/admin/leads", () => ({
  upsertCalLead: (input: unknown) => upsertMock(input),
  recordLeadNotification: (id: string, outcome: unknown) => recordNotifMock(id, outcome),
}));

const getSiteConfigMock = vi.fn();
vi.mock("@/lib/admin/siteConfig", () => ({
  getSiteConfig: () => getSiteConfigMock(),
}));

const sendMock = vi.fn();
vi.mock("@/lib/email", async () => {
  const actual = await vi.importActual<typeof import("@/lib/email")>("@/lib/email");
  return { ...actual, sendLeadNotification: (...args: unknown[]) => sendMock(...args) };
});

import { POST } from "./route";

function makeRequest(body: string, sig: string | null = null) {
  return new Request("https://admin.itshassan.it/api/cal/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(sig ? { "x-cal-signature-256": sig } : {}),
    },
    body,
  });
}

const validExtract = {
  bookingId: "uid-abc123",
  trigger: "BOOKING_CREATED" as const,
  name: "Alice Rossi",
  email: "alice@example.com",
  startTime: new Date("2026-06-01T09:00:00Z"),
  eventType: "Discovery Call",
  rawPayload: {},
};

describe("POST /api/cal/webhook", () => {
  beforeEach(() => {
    verifyMock.mockReset();
    extractMock.mockReset();
    upsertMock.mockReset();
    recordNotifMock.mockReset();
    getSiteConfigMock.mockReset();
    sendMock.mockReset();
    getSiteConfigMock.mockResolvedValue({
      id: 1,
      contactEmail: "admin@example.com",
      notifyEmail: null,
    });
    sendMock.mockResolvedValue({ ok: true, id: "msg-1" });
  });

  afterEach(() => vi.restoreAllMocks());

  it("returns 500 when CAL_WEBHOOK_SECRET is not set", async () => {
    const saved = process.env.CAL_WEBHOOK_SECRET;
    delete process.env.CAL_WEBHOOK_SECRET;
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(500);
    process.env.CAL_WEBHOOK_SECRET = saved;
  });

  it("returns 401 when signature verification fails", async () => {
    verifyMock.mockReturnValue(false);
    const res = await POST(makeRequest("{}", "sha256=bad"));
    expect(res.status).toBe(401);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("returns 200 with skipped:true when extract returns null (unknown event)", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(null);
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.skipped).toBe(true);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("upserts lead and sends email on BOOKING_CREATED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        calBookingId: "uid-abc123",
        name: "Alice Rossi",
        email: "alice@example.com",
        bookingStatus: "scheduled",
      }),
    );
    expect(sendMock).toHaveBeenCalledWith(
      "admin@example.com",
      expect.objectContaining({ name: "Alice Rossi", source: "cal" }),
    );
    expect(recordNotifMock).toHaveBeenCalledWith("lead-1", expect.objectContaining({ ok: true }));
  });

  it("does NOT send email on BOOKING_RESCHEDULED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue({ ...validExtract, trigger: "BOOKING_RESCHEDULED" });
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ bookingStatus: "rescheduled" }),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("does NOT send email on BOOKING_CANCELLED", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue({ ...validExtract, trigger: "BOOKING_CANCELLED" });
    upsertMock.mockResolvedValue({ id: "lead-1" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ bookingStatus: "cancelled" }),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 500 when upsert fails", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue(null);
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("still returns 200 when Resend fails (DB is truth)", async () => {
    verifyMock.mockReturnValue(true);
    extractMock.mockReturnValue(validExtract);
    upsertMock.mockResolvedValue({ id: "lead-1" });
    sendMock.mockResolvedValue({ ok: false, error: "Resend down" });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(recordNotifMock).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ ok: false }),
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm --filter web-next test app/api/cal/webhook
```

Expected: FAIL with `Cannot find module './route'`

- [ ] **Step 3: Implement the webhook route**

Create `apps/web-next/app/api/cal/webhook/route.ts`:

```ts
import type { NextRequest } from "next/server";
import { verifyCalSignature } from "@/lib/cal/verifySignature";
import { extractCalBooking } from "@/lib/cal/extract";
import { upsertCalLead, recordLeadNotification } from "@/lib/admin/leads";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { getNotificationRecipient, sendLeadNotification } from "@/lib/email";

export const runtime = "nodejs";

const BOOKING_STATUS = {
  BOOKING_CREATED: "scheduled",
  BOOKING_RESCHEDULED: "rescheduled",
  BOOKING_CANCELLED: "cancelled",
} as const;

export async function POST(request: NextRequest | Request): Promise<Response> {
  const rawBody = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const sig = request.headers.get("X-Cal-Signature-256");
  if (!verifyCalSignature(rawBody, sig, secret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(rawBody) as unknown;
  const booking = extractCalBooking(body);
  if (!booking) {
    return Response.json({ ok: true, skipped: true });
  }

  const bookingStatus = BOOKING_STATUS[booking.trigger];

  const lead = await upsertCalLead({
    calBookingId: booking.bookingId,
    name: booking.name,
    email: booking.email,
    scheduledAt: booking.startTime,
    sourceDetail: booking.eventType,
    calPayload: booking.rawPayload,
    bookingStatus,
  });

  if (!lead) {
    return Response.json({ error: "Upsert failed" }, { status: 500 });
  }

  if (booking.trigger === "BOOKING_CREATED") {
    const config = await getSiteConfig().catch(() => null);
    if (config) {
      const recipient = getNotificationRecipient(config);
      const scheduledStr = booking.startTime
        ? booking.startTime.toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Rome",
          })
        : "time unknown";
      const result = await sendLeadNotification(recipient, {
        name: booking.name,
        email: booking.email,
        message: `Booked: ${booking.eventType ?? "Discovery Call"} on ${scheduledStr}`,
        source: "cal",
      });
      try {
        await recordLeadNotification(lead.id, result);
      } catch {
        // non-fatal — lead is already saved
      }
    }
  }

  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter web-next test app/api/cal/webhook
```

Expected: 8 tests PASS

- [ ] **Step 5: Run full web-next test suite**

```bash
pnpm --filter web-next test
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web-next/app/api/cal/webhook/route.ts apps/web-next/app/api/cal/webhook/route.test.ts
git commit -m "feat(web-next): POST /api/cal/webhook — verify signature, upsert lead, notify on booking"
```

---

## Task 5: Update .env.example files

**Files:**
- Modify: `apps/web-next/.env.example`
- Modify: `apps/docs/.env.example`
- Modify: `apps/docs/.env.local`

- [ ] **Step 1: Uncomment CAL_WEBHOOK_SECRET in web-next .env.example**

In `apps/web-next/.env.example`, change:
```
# CAL_WEBHOOK_SECRET=
```
to:
```
CAL_WEBHOOK_SECRET=your-cal-webhook-secret-here
```

- [ ] **Step 2: Add VITE_CAL_LINK to docs .env.example**

In `apps/docs/.env.example`, add at the end:
```
# Cal.com event link (username/slug)
VITE_CAL_LINK=itshassan/discovery-call
```

- [ ] **Step 3: Add VITE_CAL_LINK to docs .env.local**

In `apps/docs/.env.local`, add at the end:
```
VITE_CAL_LINK=itshassan/discovery-call
```

- [ ] **Step 4: Verify web-next .env.local has CAL_WEBHOOK_SECRET set**

Open `apps/web-next/.env.local` and confirm `CAL_WEBHOOK_SECRET=<your-secret>` is present (you copied this from Cal.com when creating the webhook).

- [ ] **Step 5: Commit .env.example changes only (never commit .env.local)**

```bash
git add apps/web-next/.env.example apps/docs/.env.example
git commit -m "chore: add CAL_WEBHOOK_SECRET and VITE_CAL_LINK to .env.example files"
```

---

## Task 6: CalBookButton Component

**Files:**
- Modify: `apps/docs/package.json` (add `@calcom/embed-react`)
- Create: `apps/docs/src/components/ui/CalBookButton.tsx`

- [ ] **Step 1: Install @calcom/embed-react**

```bash
pnpm --filter docs add @calcom/embed-react
```

Expected: package added to `apps/docs/package.json` dependencies.

- [ ] **Step 2: Create CalBookButton.tsx**

Create `apps/docs/src/components/ui/CalBookButton.tsx`:

```tsx
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { AppButton } from "@laboratoire/ui";

const CAL_LINK = (import.meta.env.VITE_CAL_LINK as string | undefined) ?? "itshassan/discovery-call";
const CAL_NAMESPACE = CAL_LINK.split("/")[1] ?? "discovery-call";

type Props = {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "bordered" | "flat";
};

export default function CalBookButton({ label, size = "lg", variant = "bordered" }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: CAL_NAMESPACE }).then((cal) => {
      if (!cancelled) {
        cal("ui", { layout: "month_view", hideEventTypeDetails: false });
        calRef.current = cal;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppButton
      as="button"
      type="button"
      size={size}
      variant={variant}
      onClick={() => calRef.current?.("modal", { calLink: CAL_LINK })}
      startContent={<FaCalendarAlt aria-hidden="true" />}
    >
      {label}
    </AppButton>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter docs typecheck
```

Expected: no errors. If `@calcom/embed-react` types cause issues, the `any` cast on `calRef` should absorb them.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/package.json apps/docs/src/components/ui/CalBookButton.tsx pnpm-lock.yaml
git commit -m "feat(docs): CalBookButton component using @calcom/embed-react popup"
```

---

## Task 7: Wire CalBookButton into FinalCTASection

**Files:**
- Modify: `apps/docs/src/data/finalCtaContent.ts`
- Modify: `apps/docs/src/components/sections/FinalCTASection.tsx`

- [ ] **Step 1: Add calLabel to FinalCtaContent type and data**

In `apps/docs/src/data/finalCtaContent.ts`, add `calLabel: string` to the type and each locale:

```ts
export type FinalCtaContent = {
  title: string;
  subtitle: string;
  auditLabel: string;
  auditHref: string;
  calLabel: string;        // ADD THIS
  whatsappLabel: string;
  whatsappHref: string;
  emailLabel: string;
  emailHref: string;
  footnote: string;
};
```

Add `calLabel` to each locale object:
- `it`: `calLabel: "Prenota una chiamata"`
- `en`: `calLabel: "Book a call"`
- `fr`: `calLabel: "Réserver un appel"`

- [ ] **Step 2: Add CalBookButton to FinalCTASection**

In `apps/docs/src/components/sections/FinalCTASection.tsx`:

1. Add import at the top (after existing imports):
```tsx
import CalBookButton from "../ui/CalBookButton";
```

2. In the `motion.div` containing the buttons, add `CalBookButton` as the second button (between audit and whatsapp):

```tsx
<motion.div
  variants={fadeUpVariants}
  className="mt-8 flex flex-wrap gap-3"
>
  <AppButton
    as="a"
    href={content.auditHref}
    size="lg"
    endContent={<FaArrowRight aria-hidden="true" />}
  >
    {content.auditLabel}
  </AppButton>
  <CalBookButton label={content.calLabel} />
  <AppButton
    as="a"
    href={whatsappHref}
    target="_blank"
    rel="noreferrer"
    size="lg"
    variant="bordered"
    startContent={<FaWhatsapp aria-hidden="true" />}
  >
    {content.whatsappLabel}
  </AppButton>
  <AppButton
    as="a"
    href={emailHref}
    size="lg"
    variant="flat"
    startContent={<FaRegEnvelope aria-hidden="true" />}
  >
    {content.emailLabel}
  </AppButton>
</motion.div>
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter docs typecheck
```

Expected: no errors.

- [ ] **Step 4: Run dev server and verify popup opens**

```bash
pnpm dev:docs
```

Open browser at `http://localhost:5173`. Scroll to the final CTA section. Click "Book a call" / "Prenota una chiamata". Verify Cal.com popup opens showing the Discovery Call booking page.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/data/finalCtaContent.ts apps/docs/src/components/sections/FinalCTASection.tsx
git commit -m "feat(docs): add Cal.com Discovery Call booking button to FinalCTASection"
```

---

## Task 8: Final quality check + deploy prep

- [ ] **Step 1: Run full check**

```bash
pnpm check
```

Expected: lint + typecheck + tests all PASS.

- [ ] **Step 2: Update Cal.com webhook subscriber URL**

Once `apps/web-next` is deployed (or when you have a domain/ngrok URL):
1. Go to Cal.com → Discovery Call → Webhooks
2. Edit the webhook
3. Set subscriber URL to: `https://<your-admin-domain>/api/cal/webhook`
4. Save

- [ ] **Step 3: Set environment variables on deploy target**

On the hosting platform for `apps/web-next`:
- Add `CAL_WEBHOOK_SECRET=<same secret from Cal.com>`

- [ ] **Step 4: Smoke test with a real booking**

1. Book a test call on `cal.com/itshassan/discovery-call`
2. Verify Cal.com fires the webhook (check webhook logs in Cal.com settings)
3. Verify lead appears in admin at `<admin-domain>/admin` with source `cal` and bookingStatus `scheduled`
4. Verify admin email notification received (if Resend is configured)

- [ ] **Step 5: Final commit**

```bash
git add apps/web-next/.env.example apps/docs/.env.example
git commit -m "chore(phase-4): env examples updated — Cal.com integration complete"
```

---

## Notes

- `privacyVersion: "cal-implicit"` on Cal leads — by booking via Cal.com, the user implicitly consented to data sharing as part of the booking flow. This is an MVP note; update if formal GDPR language is required.
- Admin UI (`apps/web-next/app/admin`) already renders `bookingStatus`, `scheduledAt`, source filter, and stats — **no UI changes needed**.
- Email notification fires only on `BOOKING_CREATED` (not RESCHEDULED/CANCELLED) to avoid spam. If you want rescheduled notifications, add `"BOOKING_RESCHEDULED"` to the trigger check in `route.ts`.
- Cal.com `uid` stays the same on reschedule — the upsert correctly updates the existing row.
