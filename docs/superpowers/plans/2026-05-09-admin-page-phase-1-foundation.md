# Admin Page — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the auth + DB foundation in `apps/web-next` so that (a) we can run `db:migrate` + `db:seed` against Neon, (b) `POST /api/admin/login` with valid credentials returns a signed iron-session cookie, (c) `/admin/*` and `/api/admin/*` are gated by `apps/web-next/proxy.ts` (with `/api/admin/login` carved out), and (d) the existing `/checkout` booking-demo flow keeps working untouched.

**Architecture:** Drizzle ORM over Neon HTTP driver for Postgres. Three tables (`users`, `leads`, `site_config`). Iron-session for the admin cookie alongside the existing sentinel-cookie booking demo. Defense in depth: `proxy.ts` does presence-only redirects; route handlers re-verify the seal via `getAdminSession()` / `requireAdminSession()`.

**Tech stack:** Next.js 16.1.6 (App Router, Node.js runtime), Drizzle ORM, `@neondatabase/serverless`, `iron-session`, `bcryptjs`, `zod` (existing), `vitest` (existing), `tsx` (added for the seed script).

**Spec reference:** [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md). This plan covers build-order steps 1–4 of the spec. Phases 2–5 are separate plans.

**Pre-flight (do these BEFORE Task 1, outside the plan):**

- Create a Neon project in `aws-eu-central-1` (Frankfurt). Region is immutable after creation.
- Copy the `DATABASE_URL` (the pooled HTTP URL from Neon's dashboard).
- Decide an `ADMIN_PASSWORD` (will be bcrypt-hashed; you only need it once for the seed).
- Generate a 32+ char `ADMIN_SESSION_SECRET` (e.g. `pwsh -c "[Convert]::ToBase64String([byte[]](1..48 | %{Get-Random -Max 256}))"`).
- Put all of these in `apps/web-next/.env.local` (ignored by git).

---

## File map (Phase 1 only)

```
apps/web-next/
  proxy.ts                              RENAMED from middleware.ts; admin matcher added
  drizzle.config.ts                     NEW
  drizzle/                              NEW (generated migrations land here)
    0000_<name>.sql                     NEW (committed)
  lib/
    db/
      schema.ts                         NEW
      client.ts                         NEW
    origin.ts                           NEW
    origin.test.ts                      NEW
    adminSession.ts                     NEW
    adminSession.test.ts                NEW
  scripts/
    seed.ts                             NEW
  app/api/admin/
    login/route.ts                      NEW
    login/route.test.ts                 NEW
    logout/route.ts                     NEW
    logout/route.test.ts                NEW
  .env.example                          NEW
  package.json                          MODIFIED: deps + db scripts
  tsconfig.json                         MODIFIED: add @/* path alias

(deleted at the end of Task 13:)
  middleware.ts                         DELETED (renamed to proxy.ts)
```

---

## Task 1: Add path alias `@/*` and admin dependencies

**Files:**
- Modify: `apps/web-next/tsconfig.json`
- Modify: `apps/web-next/package.json` (auto via `pnpm add`)
- Modify: `pnpm-lock.yaml` (auto)

- [ ] **Step 1: Add `@/*` path alias to tsconfig**

Edit `apps/web-next/tsconfig.json`. Add `baseUrl` and `paths` inside `compilerOptions`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }],
    "types": ["vitest/globals"]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Install runtime dependencies**

```powershell
pnpm -F web-next add drizzle-orm @neondatabase/serverless iron-session bcryptjs resend
```

Expected: pnpm-lock.yaml updates and `apps/web-next/package.json` `dependencies` gains those five entries.

- [ ] **Step 3: Install dev dependencies**

```powershell
pnpm -F web-next add -D drizzle-kit @types/bcryptjs tsx
```

- [ ] **Step 4: Run typecheck to verify no breakage**

```powershell
pnpm -F web-next typecheck
```

Expected: PASS (no new code yet, only config + deps).

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/tsconfig.json apps/web-next/package.json pnpm-lock.yaml
git commit -m "chore(web-next): add admin deps (drizzle, iron-session, bcryptjs, resend, tsx) and @/* path alias"
```

---

## Task 2: Drizzle schema (`lib/db/schema.ts`)

**Files:**
- Create: `apps/web-next/lib/db/schema.ts`

- [ ] **Step 1: Create the schema file**

Write `apps/web-next/lib/db/schema.ts`:

```ts
import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const leadSourceEnum = pgEnum("lead_source", ["contact_form", "cal"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "closed"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "scheduled",
  "rescheduled",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: leadSourceEnum("source").notNull(),
    sourceDetail: text("source_detail"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    calBookingId: text("cal_booking_id"),
    calPayload: jsonb("cal_payload"),
    status: leadStatusEnum("status").notNull().default("new"),
    bookingStatus: bookingStatusEnum("booking_status"),
    notes: text("notes"),
    lastNotifiedAt: timestamp("last_notified_at", { withTimezone: true }),
    notificationError: text("notification_error"),
    privacyAcceptedAt: timestamp("privacy_accepted_at", { withTimezone: true }),
    privacyVersion: text("privacy_version"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt.desc()),
    index("leads_status_idx").on(t.status),
    uniqueIndex("leads_cal_booking_id_uq")
      .on(t.calBookingId)
      .where(sql`${t.calBookingId} IS NOT NULL`),
  ],
);

export const siteConfig = pgTable(
  "site_config",
  {
    id: integer("id").primaryKey(),
    phone: text("phone").notNull().default(""),
    contactEmail: text("contact_email").notNull().default(""),
    notifyEmail: text("notify_email"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("site_config_singleton", sql`${t.id} = 1`)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type SiteConfig = typeof siteConfig.$inferSelect;
```

- [ ] **Step 2: Typecheck**

```powershell
pnpm -F web-next typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add apps/web-next/lib/db/schema.ts
git commit -m "feat(web-next): drizzle schema for users, leads, site_config"
```

---

## Task 3: Drizzle config + DB client + db scripts

**Files:**
- Create: `apps/web-next/drizzle.config.ts`
- Create: `apps/web-next/lib/db/client.ts`
- Modify: `apps/web-next/package.json` (scripts)

- [ ] **Step 1: Create drizzle.config.ts**

Write `apps/web-next/drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // drizzle-kit will only run when called via pnpm db:* scripts which load .env.local via tsx --env-file.
  // If we get here in another context, fail loud.
  throw new Error("DATABASE_URL is not set. Run db:* scripts via pnpm so .env.local is loaded.");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
```

- [ ] **Step 2: Create the DB client**

Write `apps/web-next/lib/db/client.ts`:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export { schema };
```

- [ ] **Step 3: Add db scripts to package.json**

Edit `apps/web-next/package.json` `scripts`:

```json
"scripts": {
  "dev": "next dev --port 3001",
  "build": "next build",
  "start": "next start --port 3001",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "db:generate": "tsx --env-file=.env.local node_modules/drizzle-kit/bin.cjs generate",
  "db:migrate": "tsx --env-file=.env.local node_modules/drizzle-kit/bin.cjs migrate",
  "db:push": "tsx --env-file=.env.local node_modules/drizzle-kit/bin.cjs push",
  "db:studio": "tsx --env-file=.env.local node_modules/drizzle-kit/bin.cjs studio",
  "db:seed": "tsx --env-file=.env.local scripts/seed.ts"
}
```

(The `tsx --env-file=.env.local node_modules/drizzle-kit/bin.cjs <cmd>` form is what gets `.env.local` loaded *and* uses the locally installed drizzle-kit. If `drizzle-kit/bin.cjs` doesn't resolve, fall back to `pnpm exec drizzle-kit <cmd>` and load env via a one-line wrapper.)

- [ ] **Step 4: Typecheck**

```powershell
pnpm -F web-next typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/drizzle.config.ts apps/web-next/lib/db/client.ts apps/web-next/package.json
git commit -m "feat(web-next): drizzle config, neon client, db scripts"
```

---

## Task 4: Generate the first migration

**Files:**
- Create (auto-generated): `apps/web-next/drizzle/0000_<name>.sql`
- Create (auto-generated): `apps/web-next/drizzle/meta/_journal.json`, `apps/web-next/drizzle/meta/0000_snapshot.json`

- [ ] **Step 1: Run drizzle-kit generate**

Make sure `apps/web-next/.env.local` exists with at least `DATABASE_URL=...`. Then:

```powershell
pnpm -F web-next db:generate
```

Expected: drizzle creates `apps/web-next/drizzle/0000_<random_name>.sql` containing `CREATE TYPE`s, `CREATE TABLE`s, indexes, the partial unique index, and the singleton check constraint.

- [ ] **Step 2: Inspect the migration**

Open the generated SQL. Confirm it contains:
- `CREATE TYPE lead_source`, `lead_status`, `booking_status` (enums).
- `CREATE TABLE users`, `leads`, `site_config`.
- `CREATE INDEX leads_created_at_idx`, `leads_status_idx`.
- `CREATE UNIQUE INDEX leads_cal_booking_id_uq … WHERE cal_booking_id IS NOT NULL`.
- `CONSTRAINT site_config_singleton CHECK (id = 1)`.

If anything's missing, the schema needs fixing — go back to Task 2.

- [ ] **Step 3: Apply the migration to Neon**

```powershell
pnpm -F web-next db:migrate
```

Expected: drizzle reports the migration applied. Sanity-check from the Neon SQL editor: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';` returns the three tables.

- [ ] **Step 4: Commit the migration**

```powershell
git add apps/web-next/drizzle/
git commit -m "feat(web-next): initial drizzle migration (users, leads, site_config)"
```

---

## Task 5: Seed script

**Files:**
- Create: `apps/web-next/scripts/seed.ts`

- [ ] **Step 1: Write the seed script**

Write `apps/web-next/scripts/seed.ts`:

```ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../lib/db/client";

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingUser = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(schema.users).values({ email, passwordHash });
    console.log(`✔ Created admin user ${email}`);
  } else {
    await db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.email, email));
    console.log(`✔ Updated password for ${email}`);
  }

  const existingConfig = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, 1))
    .limit(1);

  if (existingConfig.length === 0) {
    await db.insert(schema.siteConfig).values({
      id: 1,
      phone: "",
      contactEmail: email,
      notifyEmail: null,
    });
    console.log("✔ Created site_config singleton row");
  } else {
    console.log("• site_config singleton already exists");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

- [ ] **Step 2: Run the seed**

```powershell
pnpm -F web-next db:seed
```

Expected output:
```
✔ Created admin user h.akkari@sibyllanetwork.com
✔ Created site_config singleton row
```

Re-running should be safe (updates password, skips config).

- [ ] **Step 3: Verify in Neon**

In Neon SQL editor:
```sql
SELECT id, email, created_at FROM users;
SELECT * FROM site_config;
```

Expected: one row in each.

- [ ] **Step 4: Commit**

```powershell
git add apps/web-next/scripts/seed.ts
git commit -m "feat(web-next): admin user + site_config seed script"
```

---

## Task 6: `lib/origin.ts` — CORS / Origin helpers (TDD)

**Files:**
- Create: `apps/web-next/lib/origin.test.ts`
- Create: `apps/web-next/lib/origin.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/lib/origin.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isAllowedAdminOrigin,
  isAllowedPublicOrigin,
  requireAdminOrigin,
  withCors,
} from "./origin";

const PUBLIC = "https://itshassan.it,http://localhost:5173";
const ADMIN = "https://admin.itshassan.it,http://localhost:3001";

describe("origin allowlists", () => {
  const original = {
    pub: process.env.PUBLIC_ALLOWED_ORIGINS,
    adm: process.env.ADMIN_ALLOWED_ORIGINS,
  };

  beforeEach(() => {
    process.env.PUBLIC_ALLOWED_ORIGINS = PUBLIC;
    process.env.ADMIN_ALLOWED_ORIGINS = ADMIN;
  });

  afterEach(() => {
    process.env.PUBLIC_ALLOWED_ORIGINS = original.pub;
    process.env.ADMIN_ALLOWED_ORIGINS = original.adm;
  });

  it("accepts allowed public origins", () => {
    expect(isAllowedPublicOrigin("https://itshassan.it")).toBe(true);
    expect(isAllowedPublicOrigin("http://localhost:5173")).toBe(true);
  });

  it("rejects unknown / null / empty public origins", () => {
    expect(isAllowedPublicOrigin("https://evil.com")).toBe(false);
    expect(isAllowedPublicOrigin(null)).toBe(false);
    expect(isAllowedPublicOrigin("")).toBe(false);
  });

  it("isolates public and admin allowlists", () => {
    expect(isAllowedAdminOrigin("https://itshassan.it")).toBe(false);
    expect(isAllowedPublicOrigin("https://admin.itshassan.it")).toBe(false);
  });

  it("accepts allowed admin origins", () => {
    expect(isAllowedAdminOrigin("https://admin.itshassan.it")).toBe(true);
    expect(isAllowedAdminOrigin("http://localhost:3001")).toBe(true);
  });

  it("withCors sets ACAO + Vary on allowed origins, omits on disallowed", () => {
    const ok = withCors(new Response("body"), "https://itshassan.it", "public");
    expect(ok.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(ok.headers.get("Vary")).toBe("Origin");

    const denied = withCors(new Response("body"), "https://evil.com", "public");
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("requireAdminOrigin returns 403 for foreign origins, null for allowed", () => {
    const allowedReq = new Request("https://admin.itshassan.it/x", {
      headers: { origin: "https://admin.itshassan.it" },
    });
    expect(requireAdminOrigin(allowedReq)).toBeNull();

    const deniedReq = new Request("https://admin.itshassan.it/x", {
      headers: { origin: "https://evil.com" },
    });
    const res = requireAdminOrigin(deniedReq);
    expect(res?.status).toBe(403);
  });
});
```

- [ ] **Step 2: Run the test (it should fail with module-not-found)**

```powershell
pnpm -F web-next test -- origin.test
```

Expected: FAIL — `Cannot find module './origin'`.

- [ ] **Step 3: Write the implementation**

Write `apps/web-next/lib/origin.ts`:

```ts
function parseList(env: string | undefined): Set<string> {
  if (!env) return new Set();
  return new Set(
    env
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function isAllowedPublicOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return parseList(process.env.PUBLIC_ALLOWED_ORIGINS).has(origin);
}

export function isAllowedAdminOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return parseList(process.env.ADMIN_ALLOWED_ORIGINS).has(origin);
}

export function withCors(
  response: Response,
  origin: string | null,
  kind: "public" | "admin",
): Response {
  const allowed =
    kind === "public" ? isAllowedPublicOrigin(origin) : isAllowedAdminOrigin(origin);
  if (allowed && origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export function requireAdminOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!isAllowedAdminOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- origin.test
```

Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/origin.ts apps/web-next/lib/origin.test.ts
git commit -m "feat(web-next): origin allowlist helpers (lib/origin.ts) with tests"
```

---

## Task 7: `lib/adminSession.ts` — iron-session helpers (TDD)

**Files:**
- Create: `apps/web-next/lib/adminSession.test.ts`
- Create: `apps/web-next/lib/adminSession.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/lib/adminSession.test.ts`:

```ts
import { beforeAll, describe, expect, it } from "vitest";
import { sealAdminSession, unsealAdminSession } from "./adminSession";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

describe("admin session seal/unseal", () => {
  it("round-trips a valid session", async () => {
    const sealed = await sealAdminSession({ userId: "abc-123" });
    expect(typeof sealed).toBe("string");
    expect(sealed.length).toBeGreaterThan(20);

    const data = await unsealAdminSession(sealed);
    expect(data?.userId).toBe("abc-123");
  });

  it("rejects tampered cookies", async () => {
    const sealed = await sealAdminSession({ userId: "abc-123" });
    const tampered = sealed.slice(0, -3) + "XYZ";
    const data = await unsealAdminSession(tampered);
    expect(data).toBeNull();
  });

  it("returns null for null / empty input", async () => {
    expect(await unsealAdminSession(null)).toBeNull();
    expect(await unsealAdminSession("")).toBeNull();
    expect(await unsealAdminSession(undefined)).toBeNull();
  });

  it("throws if secret missing or too short", async () => {
    const original = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = "tooshort";
    await expect(sealAdminSession({ userId: "x" })).rejects.toThrow(
      /ADMIN_SESSION_SECRET/,
    );
    process.env.ADMIN_SESSION_SECRET = original;
  });
});
```

- [ ] **Step 2: Run the test (should fail with module-not-found)**

```powershell
pnpm -F web-next test -- adminSession.test
```

Expected: FAIL — `Cannot find module './adminSession'`.

- [ ] **Step 3: Write the implementation**

Write `apps/web-next/lib/adminSession.ts`:

```ts
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type AdminSessionData = {
  userId: string;
};

function getPassword(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 32 chars");
  }
  return secret;
}

export async function sealAdminSession(data: AdminSessionData): Promise<string> {
  return sealData(data, { password: getPassword(), ttl: ADMIN_TTL_SECONDS });
}

export async function unsealAdminSession(
  raw: string | null | undefined,
): Promise<AdminSessionData | null> {
  if (!raw) return null;
  try {
    const data = await unsealData<AdminSessionData>(raw, {
      password: getPassword(),
      ttl: ADMIN_TTL_SECONDS,
    });
    if (!data?.userId) return null;
    return data;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/" as const,
  maxAge: ADMIN_TTL_SECONDS,
};

/** For Route Handlers / Server Actions: returns null when not signed in. */
export async function getAdminSession(): Promise<AdminSessionData | null> {
  const store = await cookies();
  const raw = store.get(ADMIN_COOKIE_NAME)?.value ?? null;
  return unsealAdminSession(raw);
}

/** For Server Component pages: redirects to /admin/login when not signed in. */
export async function requireAdminSession(): Promise<AdminSessionData> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- adminSession.test
```

Expected: 4 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/lib/adminSession.ts apps/web-next/lib/adminSession.test.ts
git commit -m "feat(web-next): admin session helpers (iron-session) with tests"
```

---

## Task 8: `/api/admin/login` route (TDD with mocked DB)

**Files:**
- Create: `apps/web-next/app/api/admin/login/route.test.ts`
- Create: `apps/web-next/app/api/admin/login/route.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/app/api/admin/login/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

const mockUsers: { id: string; email: string; passwordHash: string }[] = [];
let bcryptCompareImpl: (pw: string, hash: string) => Promise<boolean> = async () => false;

vi.mock("@/lib/db/client", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => mockUsers,
        }),
      }),
    }),
  },
  schema: {
    users: { email: "email" },
  },
}));

vi.mock("bcryptjs", () => ({
  default: { compare: (pw: string, hash: string) => bcryptCompareImpl(pw, hash) },
}));

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) => (cookieStore.has(k) ? { value: cookieStore.get(k) } : undefined),
    set: (k: string, v: string) => cookieStore.set(k, v),
    delete: (k: string) => cookieStore.delete(k),
  }),
}));

import { POST } from "./route";

function makeRequest(body: unknown, origin: string | null = "https://admin.itshassan.it") {
  return new Request("https://admin.itshassan.it/api/admin/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    mockUsers.length = 0;
    cookieStore.clear();
    bcryptCompareImpl = async () => false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects requests with disallowed Origin", async () => {
    const res = await POST(makeRequest({ email: "a@b.c", password: "x" }, "https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("rejects malformed body", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 401 for unknown email", async () => {
    const res = await POST(makeRequest({ email: "unknown@x.com", password: "pw" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 when password mismatch", async () => {
    mockUsers.push({ id: "u1", email: "a@b.c", passwordHash: "$hash" });
    bcryptCompareImpl = async () => false;
    const res = await POST(makeRequest({ email: "a@b.c", password: "wrong" }));
    expect(res.status).toBe(401);
  });

  it("sets admin_session cookie and returns 200 on valid credentials", async () => {
    mockUsers.push({ id: "u1", email: "a@b.c", passwordHash: "$hash" });
    bcryptCompareImpl = async () => true;
    const res = await POST(makeRequest({ email: "a@b.c", password: "right" }));
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(true);
    const cookieValue = cookieStore.get("admin_session");
    expect(cookieValue?.length ?? 0).toBeGreaterThan(20);
  });
});
```

- [ ] **Step 2: Run the test (should fail with module-not-found)**

```powershell
pnpm -F web-next test -- "api/admin/login/route.test"
```

Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 3: Write the route handler**

Write `apps/web-next/app/api/admin/login/route.ts`:

```ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  sealAdminSession,
} from "@/lib/adminSession";
import { db, schema } from "@/lib/db/client";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const found = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);

  const user = found[0];
  if (!user) {
    // Don't leak whether the email exists; small fixed delay.
    await new Promise((r) => setTimeout(r, 200));
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sealed = await sealAdminSession({ userId: user.id });
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, sealed, ADMIN_COOKIE_OPTIONS);
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- "api/admin/login/route.test"
```

Expected: 5 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/admin/login/
git commit -m "feat(web-next): /api/admin/login route with origin check, zod validation, bcrypt verify, iron-session"
```

---

## Task 9: `/api/admin/logout` route (TDD)

**Files:**
- Create: `apps/web-next/app/api/admin/logout/route.test.ts`
- Create: `apps/web-next/app/api/admin/logout/route.ts`

- [ ] **Step 1: Write the failing test**

Write `apps/web-next/app/api/admin/logout/route.test.ts`:

```ts
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
  process.env.ADMIN_ALLOWED_ORIGINS = "https://admin.itshassan.it";
});

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
  return new Request("https://admin.itshassan.it/api/admin/logout", {
    method: "POST",
    headers: origin ? { origin } : {},
  });
}

describe("POST /api/admin/logout", () => {
  beforeEach(() => cookieStore.clear());
  afterEach(() => vi.restoreAllMocks());

  it("rejects disallowed Origin", async () => {
    const res = await POST(makeRequest("https://evil.com"));
    expect(res.status).toBe(403);
  });

  it("returns 401 when not signed in", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("clears the cookie and returns 200 when signed in", async () => {
    const sealed = await sealAdminSession({ userId: "u1" });
    cookieStore.set("admin_session", sealed);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(cookieStore.has("admin_session")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL (module not found)**

```powershell
pnpm -F web-next test -- "api/admin/logout/route.test"
```

- [ ] **Step 3: Write the route**

Write `apps/web-next/app/api/admin/logout/route.ts`:

```ts
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
} from "@/lib/adminSession";
import { requireAdminOrigin } from "@/lib/origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest | Request) {
  const originRejection = requireAdminOrigin(request);
  if (originRejection) return originRejection;

  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
pnpm -F web-next test -- "api/admin/logout/route.test"
```

Expected: 3 passing tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/app/api/admin/logout/
git commit -m "feat(web-next): /api/admin/logout route with origin check"
```

---

## Task 10: Rename `middleware.ts` → `proxy.ts` and add admin matchers

**Files:**
- Create (via rename): `apps/web-next/proxy.ts`
- Delete: `apps/web-next/middleware.ts`

- [ ] **Step 1: Move the file with `git mv`**

```powershell
git mv apps/web-next/middleware.ts apps/web-next/proxy.ts
```

- [ ] **Step 2: Rewrite the file as the new proxy**

Replace the entire contents of `apps/web-next/proxy.ts`:

```ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./lib/adminSession";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "./lib/session";

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public carve-out: login route is reachable without a session
  if (path === "/api/admin/login") {
    return NextResponse.next();
  }

  // The login PAGE is also public
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // Admin gate
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const hasAdminCookie = request.cookies.has(ADMIN_COOKIE_NAME);
    if (hasAdminCookie) {
      // Presence-only check; route handler / page validates the seal
      return NextResponse.next();
    }
    if (path.startsWith("/api/admin")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Booking demo gate (existing logic, untouched)
  if (path.startsWith("/checkout")) {
    const hasSession =
      request.cookies.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;
    if (hasSession) return NextResponse.next();
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
```

- [ ] **Step 3: Typecheck**

```powershell
pnpm -F web-next typecheck
```

Expected: PASS.

- [ ] **Step 4: Run all tests**

```powershell
pnpm -F web-next test
```

Expected: every previous test (origin, adminSession, login, logout, plus the existing orders/pricing/session) passes.

- [ ] **Step 5: Commit**

```powershell
git add apps/web-next/proxy.ts apps/web-next/middleware.ts
git commit -m "feat(web-next): rename middleware.ts -> proxy.ts (Next.js 16); add admin matcher with /api/admin/login carve-out"
```

(`git add` will record the deletion of `middleware.ts` and creation of `proxy.ts` because of the prior `git mv`.)

---

## Task 11: `.env.example`

**Files:**
- Create: `apps/web-next/.env.example`

- [ ] **Step 1: Write the example file**

```bash
# === Phase 1: Foundation ===
DATABASE_URL=postgres://user:pass@host/db
ADMIN_EMAIL=h.akkari@sibyllanetwork.com
ADMIN_PASSWORD=changeme
ADMIN_SESSION_SECRET=at-least-32-chars-of-random-data-please-change-me
PUBLIC_ALLOWED_ORIGINS=https://itshassan.it,http://localhost:5173
ADMIN_ALLOWED_ORIGINS=https://admin.itshassan.it,http://localhost:3001

# === Phase 2+: Email & Privacy ===
# RESEND_API_KEY=
# RESEND_FROM=Hassan <noreply@itshassan.it>
# PRIVACY_VERSION=v1-2026-05

# === Phase 4+: Cal.com ===
# CAL_WEBHOOK_SECRET=
```

- [ ] **Step 2: Confirm `.env.local` is git-ignored**

Read `.gitignore` at the repo root or `apps/web-next/`. Confirm `.env.local` (or `.env*.local`) is listed. If missing, add `apps/web-next/.env.local` to `.gitignore`.

- [ ] **Step 3: Commit**

```powershell
git add apps/web-next/.env.example
git commit -m "chore(web-next): .env.example for phase 1 (DB, admin auth, origin allowlists)"
```

---

## Task 12: End-to-end smoke test (manual)

**Files:** none modified — just verifying the foundation.

- [ ] **Step 1: Start the dev server**

```powershell
pnpm -F web-next dev
```

Confirm it starts on `http://localhost:3001` with no errors.

- [ ] **Step 2: Try logging in with bad credentials**

In a second terminal:

```powershell
curl -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: http://localhost:3001" `
  -H "Content-Type: application/json" `
  --data '{"email":"h.akkari@sibyllanetwork.com","password":"wrong"}'
```

Expected: `HTTP/1.1 401`, body `{"error":"Invalid credentials"}`. No cookie set.

- [ ] **Step 3: Try with foreign Origin**

```powershell
curl -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: https://evil.com" `
  -H "Content-Type: application/json" `
  --data '{"email":"h.akkari@sibyllanetwork.com","password":"whatever"}'
```

Expected: `HTTP/1.1 403`, body `Forbidden`.

- [ ] **Step 4: Log in with correct credentials and capture the cookie**

```powershell
curl -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: http://localhost:3001" `
  -H "Content-Type: application/json" `
  --data "{\"email\":\"h.akkari@sibyllanetwork.com\",\"password\":\"<your real ADMIN_PASSWORD>\"}" `
  -c admin-cookie.txt
```

Expected: `HTTP/1.1 200`, body `{"ok":true}`, `Set-Cookie: admin_session=...; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` in the response headers. `admin-cookie.txt` should now contain the cookie.

- [ ] **Step 5: Confirm the proxy gates `/admin/leads` (page does not exist yet, but proxy decision is what we're testing)**

Without cookie:

```powershell
curl -i http://localhost:3001/admin/leads
```

Expected: `HTTP/1.1 307` redirect to `/admin/login?next=/admin/leads`.

With cookie:

```powershell
curl -i -b admin-cookie.txt http://localhost:3001/admin/leads
```

Expected: `HTTP/1.1 404` (page truly doesn't exist yet — Phase 2). The point: proxy let the request through because the cookie is present.

- [ ] **Step 6: Confirm the booking demo still works**

Without cookie:

```powershell
curl -i http://localhost:3001/checkout
```

Expected: `HTTP/1.1 307` redirect to `/login?next=/checkout` (the booking-demo login, not the admin login).

- [ ] **Step 7: Log out**

```powershell
curl -i -X POST http://localhost:3001/api/admin/logout `
  -H "Origin: http://localhost:3001" `
  -b admin-cookie.txt
```

Expected: `HTTP/1.1 200`, `Set-Cookie: admin_session=; ... Max-Age=0`.

- [ ] **Step 8: Re-confirm gating**

```powershell
curl -i -b admin-cookie.txt http://localhost:3001/admin/leads
```

After logout the cookie file is stale (maxAge=0) so the cookie is no longer sent. Expected: `307` redirect to `/admin/login`.

- [ ] **Step 9: If anything failed, debug; do not proceed to Phase 2 with a broken foundation**

Specifically check:
- Did `.env.local` actually load? (Drizzle and the dev server both need it.)
- Is `ADMIN_SESSION_SECRET` actually 32+ chars?
- Does the booking-demo `/checkout` redirect still go to `/login` (not `/admin/login`)?
- Does the `/api/admin/login` carve-out actually skip the auth check?

- [ ] **Step 10: Final Phase-1 checkpoint commit**

```powershell
git status
# expect: clean working tree
git log --oneline -10
# expect: all the per-task commits in order
```

If anything is uncommitted, commit it now, then:

```powershell
git tag phase-1-foundation
```

(Optional — gives a marker we can return to before starting Phase 2.)

---

## Self-review notes (read these before reporting Phase 1 done)

1. **Spec coverage check.** Phase 1 covers spec build-order steps 1–4: DB setup, seed, admin auth, proxy split. Steps 5–14 are out of scope here.
2. **Defense in depth.** Proxy uses cookie *presence* only. Real verification is in the route handlers via `getAdminSession()` (which calls `unsealData`) and in pages via `requireAdminSession()` (Phase 2).
3. **Login carve-out.** `/api/admin/login` is unreachable for the rest of the gate (would otherwise create a login loop) but the route handler still requires a valid Origin.
4. **Cookie name / scope reality check.** `admin_session` (admin) vs `web_next_session` (booking demo) — confirm both exist after Task 10 by inspecting the `cookies` files in browser devtools.
5. **No frontend in Phase 1.** There is no `/admin/login` page yet. Only the API routes exist. Phase 2 adds the pages.
6. **bcrypt cost = 12.** Slow on purpose; the `200ms` fake delay on unknown email matches the rough hash cost so timing doesn't leak email existence.
7. **Migration is committed.** Re-running `db:generate` after schema changes will create `0001_*.sql`. Never edit committed migrations — generate a new one.

---

## Phase 1 done — what's next

When this plan is fully checked off:

- DB exists in Neon with three tables and one user row.
- `pnpm -F web-next test` passes (origin, adminSession, login route, logout route, plus pre-existing tests).
- Manual smoke test in Task 12 passes.
- `apps/web-next/proxy.ts` replaces `middleware.ts`.
- The booking demo at `/checkout` is unchanged.

Next plan to write (when you're ready to start it): **Phase 2 — Admin UI** (`/admin` shell, leads list, lead detail, site-config edit, "Send test email"). That plan will pull in `lib/email.ts` (Resend) since the test-email button needs it.
