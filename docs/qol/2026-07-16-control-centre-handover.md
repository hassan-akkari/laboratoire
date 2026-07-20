# Control Centre — Handover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Read first, in this order:** `CLAUDE.md` (repo root), `apps/control-centre/README.md`, `docs/digital-garden.md`, `docs/qol/control-centre-roadmap.md`. This plan assumes you have read them.

**Goal:** Close the remaining gaps of the QoL control-centre system: finish F1 (real notes live on itshassan.it/notes), harden the F2 tracker workflow, and stage F3/F4/F5 behind explicit decision gates.

**Architecture:** `apps/control-centre` is a local-only Next.js 16 dashboard (port 3002) whose business logic is pure and unit-tested; external services hide behind typed connectors in `lib/connectors/types.ts`. The public digital garden is a separate pipeline: Obsidian vault → `apps/docs/scripts/vault-sync.ts` → `apps/docs/src/content/data/notes.json` → Vercel.

**Tech Stack:** Node 24, pnpm 10 (frozen lockfile), Next.js 16 App Router, TypeScript 5.9 strict, zod 4, vitest 3.

**Created:** 2026-07-16 · **Updated:** 2026-07-20 — branch `claude/qol-control-centre-9fsas9` pushed to origin, 9 commits ahead of `main`, **not merged**. Since the first draft: F1 content shipped on the branch (`cb728d0` 8 real vault notes, `0ec47cc` garden mechanics, `c1d067a` SEO hardening). Companion doc for that session's full state + SEO backlog: `_handover-qol-garden-seo.md` (repo root, committed).

## Global Constraints

- Node `>=24 <25`, pnpm `10.0.0`. Install with `pnpm -w install --frozen-lockfile`.
- Run `pnpm check` (lint + typecheck + test, from repo root) before every push. All three must pass.
- **Atomic commits: one task = one commit.** Anything out of scope goes to `.claude/_followup.md` (committed tech-debt radar — append, never delete entries), not into the current change.
- Any `package.json` dependency change must include the regenerated `pnpm-lock.yaml` **in the same commit** (CI enforces frozen lockfile).
- `apps/control-centre` is **local-only forever**: never add it to `vercel.json`, never add auth, never deploy it. It reads the local filesystem and the job pipeline.
- **Privacy rule (do not bend):** only vault notes with `publish: true` frontmatter may enter `apps/docs/src/content/data/notes.json`. The repo is public — committed JSON is as public as the site. Never commit raw vault content.
- Commit style: conventional-ish prefixes (`feat:`, `fix:`, `docs:`, `chore:`), match recent `git log` style. Sign-off/co-author lines per your own harness rules.
- Host is Windows 11 / NTFS. Any new script must be cross-platform Node (no bash-isms in npm scripts).
- Update the checkboxes in `docs/qol/control-centre-roadmap.md` in the same commit that completes a roadmap item.

## Decision & input gates (Hassan)

Tasks below reference these gates. **A gated task must not start until its gate is answered.** Everything in Phase A has no gate — start there.

| Gate | Question for Hassan | Blocks |
| --- | --- | --- |
| **H1** | ✅ **RESOLVED 2026-07-19.** Vault = `C:\Users\Hassan\Documents\Obsidian\my control center` (local git repo, **no remote yet** — that part is gate H3). 8 real notes shipped in `cb728d0`. On other machines set `VAULT_DIR` in `apps/control-centre/.env.local`. | — |
| **H2** | Postgres provider for F3: **Supabase** (fills the Upwork skill gap — the roadmap's stated reason) or the **Neon** instance that already backs the contact form. One sentence answer is enough. | C1, C2 |
| **H3** | Should the vault get a remote (`gh repo create hassan-vault --private --source . --push` from the vault dir)? Enables nightly auto-commit + git diary + cross-PC publishing. | D1 |
| **H4** | Live Gmail: OAuth credentials for the Gmail API (or the decision to stay mock). | D2 |
| **H5** | Current CV source file (any format) for the tailoring template. | D3 |
| **D0** | ✅ **MOOT.** Real notes are already on the branch — deploy is now a plain PR + merge (Task B2). | — |

**Outstanding manual security item (Hassan, independent of any task):** the Neon database password and `ADMIN_SESSION_SECRET` leaked in a June transcript and have not been rotated. Rotation steps are in `_handover-qol-garden-seo.md` (step 4). An executing agent must not attempt this — remind Hassan if still open.

---

## Phase A — executable now, no gates

### Task A1: Follow-up cadence rule (tracker)

Closes roadmap F2 item "definire regola follow-up". Today `nextFollowUpAt` exists in the schema and can be set manually (`setFollowUpAction`), but nothing ever suggests a date — new applications get `null` and silently sink in the board sort.

**Rule to implement:** a status change re-baselines the follow-up. Cadence: `scouted` → +7 days, `applied` → +7, `screening` → +5, `interview` → +3, closed statuses (`offer`, `rejected`, `ghosted`) → `null` (schema already defines these as closed in `CLOSED_STATUSES`). Rationale: a status change means the old follow-up date belonged to the previous stage; manual override via the existing `setFollowUpAction` still works afterwards.

**Files:**
- Modify: `apps/control-centre/lib/tracker/schema.ts` (add `suggestNextFollowUp`)
- Modify: `apps/control-centre/lib/tracker/store.ts:44-52` (`setStatus`)
- Modify: `apps/control-centre/lib/tracker/actions.ts:28-54` (`addApplicationAction`)
- Test: `apps/control-centre/lib/tracker/schema.test.ts` (append a describe block)

**Interfaces:**
- Consumes: `ApplicationStatus`, `CLOSED_STATUSES` pattern already in `schema.ts`.
- Produces: `suggestNextFollowUp(status: ApplicationStatus, todayIso: string): string | null` — exported from `schema.ts`; Task A2 imports it.

- [ ] **Step 1: Write the failing test** — append to `apps/control-centre/lib/tracker/schema.test.ts`:

```ts
describe("suggestNextFollowUp", () => {
  it("applied → +7 days", () => {
    expect(suggestNextFollowUp("applied", "2026-07-16")).toBe("2026-07-23");
  });

  it("interview → +3 days", () => {
    expect(suggestNextFollowUp("interview", "2026-07-16")).toBe("2026-07-19");
  });

  it("crosses month boundaries correctly", () => {
    expect(suggestNextFollowUp("screening", "2026-07-29")).toBe("2026-08-03");
  });

  it("closed statuses clear the follow-up", () => {
    expect(suggestNextFollowUp("offer", "2026-07-16")).toBeNull();
    expect(suggestNextFollowUp("rejected", "2026-07-16")).toBeNull();
    expect(suggestNextFollowUp("ghosted", "2026-07-16")).toBeNull();
  });
});
```

Add `suggestNextFollowUp` to the existing import from `./schema` at the top of the file.

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm -F control-centre test`
Expected: FAIL — `suggestNextFollowUp` is not exported.

- [ ] **Step 3: Implement in `schema.ts`** (below `isFollowUpOverdue`):

```ts
/** Days until the next follow-up, per stage. Closed statuses have none. */
const FOLLOW_UP_CADENCE_DAYS: Partial<Record<ApplicationStatus, number>> = {
  scouted: 7,
  applied: 7,
  screening: 5,
  interview: 3,
};

/**
 * A status change re-baselines the follow-up: the old date belonged to the
 * old stage. Returns null for closed statuses (nothing left to chase).
 */
export function suggestNextFollowUp(
  status: ApplicationStatus,
  todayIso: string,
): string | null {
  const days = FOLLOW_UP_CADENCE_DAYS[status];
  if (days === undefined) return null;
  const date = new Date(`${todayIso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm -F control-centre test`
Expected: PASS (all existing tests still green).

- [ ] **Step 5: Wire into `setStatus` in `store.ts`** — replace the current body:

```ts
export async function setStatus(
  id: string,
  status: ApplicationStatus,
  todayIso: string,
): Promise<void> {
  // A status change IS a contact event — that's what keeps "last contact"
  // honest without a separate logging chore. It also re-baselines the
  // follow-up: the previous date belonged to the previous stage.
  await updateApplication(id, {
    status,
    lastContactAt: todayIso,
    nextFollowUpAt: suggestNextFollowUp(status, todayIso),
  });
}
```

Add `suggestNextFollowUp` to the import from `./schema`.

- [ ] **Step 6: Wire into `addApplicationAction` in `actions.ts`** — the new-application form currently hard-codes `nextFollowUpAt: null`; change that line to:

```ts
    nextFollowUpAt: suggestNextFollowUp("applied", todayIso()),
```

Import `suggestNextFollowUp` from `./schema`.

- [ ] **Step 7: Verify end-to-end** — `pnpm dev:centre`, open `http://localhost:3002/tracker`, change any application's status, confirm the follow-up date updates and board re-sorts. Then `pnpm check` from root.

- [ ] **Step 8: Commit**

```bash
git add apps/control-centre/lib/tracker docs/qol/control-centre-roadmap.md
git commit -m "feat(control-centre): follow-up cadence rule on status change"
```

Tick `- [x] definire regola follow-up` in the roadmap's F2 checklist in the same commit.

### Task A2: Scout → tracker handoff

Closes the workflow gap behind "prompt/processo shortlist mattutina": the scout page ranks listings but there is no way to act on one. Add a **Track** button per kept listing that creates a `scouted` application; the morning routine becomes scout page → Track → tracker board.

**Files:**
- Modify: `apps/control-centre/lib/tracker/schema.ts` (add `hasOpenDuplicate`)
- Modify: `apps/control-centre/lib/tracker/actions.ts` (add `trackListingAction`)
- Modify: `apps/control-centre/app/scout/page.tsx` (button per kept listing)
- Test: `apps/control-centre/lib/tracker/schema.test.ts`

**Interfaces:**
- Consumes: `suggestNextFollowUp` from Task A1; `addApplication`, `listApplications` from `lib/tracker/store.ts`; `JobListing` shape from `lib/connectors/types.ts` (fields: `title`, `company`, `location`, `country`, `stack: string[]`, `url`).
- Produces: `trackListingAction(formData: FormData): Promise<void>` (server action); `hasOpenDuplicate(applications: Application[], company: string, role: string): boolean` exported from `schema.ts`.

- [ ] **Step 1: Write the failing test** — append to `schema.test.ts`:

```ts
describe("hasOpenDuplicate", () => {
  const base: Application = {
    id: "1",
    company: "Acme",
    role: "Frontend Engineer",
    location: "Zürich, CH",
    source: "scout",
    stack: ["react"],
    status: "scouted",
    appliedAt: null,
    lastContactAt: null,
    nextFollowUpAt: null,
    notes: "",
  };

  it("true when an open application matches company+role (case-insensitive)", () => {
    expect(hasOpenDuplicate([base], "acme", "frontend engineer")).toBe(true);
  });

  it("false when the matching application is closed", () => {
    expect(
      hasOpenDuplicate([{ ...base, status: "rejected" }], "Acme", "Frontend Engineer"),
    ).toBe(false);
  });

  it("false for a different role at the same company", () => {
    expect(hasOpenDuplicate([base], "Acme", "Backend Engineer")).toBe(false);
  });
});
```

Extend the import from `./schema` with `hasOpenDuplicate` and (if not already imported by existing tests) the `Application` type.

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm -F control-centre test`
Expected: FAIL — `hasOpenDuplicate` is not exported.

- [ ] **Step 3: Implement in `schema.ts`** (below `suggestNextFollowUp`):

```ts
/** Guards the scout → tracker handoff against double-clicks and re-tracks. */
export function hasOpenDuplicate(
  applications: Application[],
  company: string,
  role: string,
): boolean {
  const key = (value: string) => value.trim().toLowerCase();
  return applications.some(
    (app) =>
      isOpen(app) &&
      key(app.company) === key(company) &&
      key(app.role) === key(role),
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm -F control-centre test`
Expected: PASS.

- [ ] **Step 5: Add the server action** — append to `apps/control-centre/lib/tracker/actions.ts`:

```ts
const trackListingSchema = z.object({
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  location: z.string().trim().min(1),
  stack: z.string().trim(),
  url: z.string().trim(),
});

/** Scout → tracker handoff. Idempotent: re-tracking an open duplicate is a no-op. */
export async function trackListingAction(formData: FormData): Promise<void> {
  const input = trackListingSchema.parse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    stack: formData.get("stack") ?? "",
    url: formData.get("url") ?? "",
  });

  const applications = await listApplications();
  if (hasOpenDuplicate(applications, input.company, input.role)) {
    return;
  }

  await addApplication({
    company: input.company,
    role: input.role,
    location: input.location,
    source: "scout",
    stack: input.stack
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
    status: "scouted",
    appliedAt: null,
    lastContactAt: null,
    nextFollowUpAt: suggestNextFollowUp("scouted", todayIso()),
    notes: input.url,
  });
  refresh();
  revalidatePath("/scout");
}
```

Extend the imports: `listApplications` from `./store`, `hasOpenDuplicate` and `suggestNextFollowUp` from `./schema`.

- [ ] **Step 6: Add the button on the scout page** — in `app/scout/page.tsx`, import the action (`import { trackListingAction } from "@/lib/tracker/actions";`) and inside the kept-listings `<li>` (after the rationale `<span>`) add:

```tsx
            <form action={trackListingAction}>
              <input type="hidden" name="company" value={entry.listing.company} />
              <input type="hidden" name="role" value={entry.listing.title} />
              <input type="hidden" name="location" value={`${entry.listing.location}, ${entry.listing.country}`} />
              <input type="hidden" name="stack" value={entry.listing.stack.join(", ")} />
              <input type="hidden" name="url" value={entry.listing.url} />
              <button type="submit">Track</button>
            </form>
```

Style the button consistently with `app/globals.css` (the tracker page's forms show the existing pattern — reuse those classes rather than inventing new CSS).

- [ ] **Step 7: Verify end-to-end** — `pnpm dev:centre`; on `/scout` click **Track** on a hot listing; confirm it appears on `/tracker` as `scouted` with a follow-up date 7 days out; click **Track** again on the same listing and confirm no duplicate row appears. Then `pnpm check`.

- [ ] **Step 8: Commit**

```bash
git add apps/control-centre
git commit -m "feat(control-centre): scout-to-tracker handoff with duplicate guard"
```

### Task A3: Tracker backup script

`data/applications.json` is gitignored and lives nowhere else — one bad write loses the pipeline. Local copy is enough (local-only app); no cloud.

**Files:**
- Create: `apps/control-centre/scripts/backup.mjs`
- Modify: `apps/control-centre/package.json` (add `"backup"` script)
- Modify: `apps/control-centre/README.md` (backup/restore paragraph under "State")

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `pnpm -F control-centre backup` → timestamped copy under `data/backups/` (already covered by the gitignored `data/` dir — verify `apps/control-centre/.gitignore` covers `data/`; it does).

- [ ] **Step 1: Write the script** — `apps/control-centre/scripts/backup.mjs`:

```js
// Copies data/applications.json to data/backups/applications-<timestamp>.json.
// Restore = copy a backup over data/applications.json (zod re-validates on read).
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "data", "applications.json");
const backupsDir = join(root, "data", "backups");

if (!existsSync(source)) {
  console.error(`[backup] nothing to back up: ${source} does not exist`);
  process.exit(1);
}

mkdirSync(backupsDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const target = join(backupsDir, `applications-${stamp}.json`);
copyFileSync(source, target);
console.log(`[backup] wrote ${target}`);
```

- [ ] **Step 2: Add the npm script** — in `apps/control-centre/package.json` scripts:

```json
    "backup": "node scripts/backup.mjs"
```

(No dependency changes, so no lockfile change.)

- [ ] **Step 3: Verify** — start the app once so `data/applications.json` exists (seeded on first run), then:

Run: `pnpm -F control-centre backup`
Expected: `[backup] wrote ...data\backups\applications-2026-07-16T....json` and the file exists.

- [ ] **Step 4: Document** — append to the "State" section of `apps/control-centre/README.md`:

```markdown
Run `pnpm -F control-centre backup` before risky edits — it snapshots
`data/applications.json` into `data/backups/` (gitignored, local-only).
Restore by copying a snapshot back over `data/applications.json`.
```

- [ ] **Step 5: Commit**

```bash
git add apps/control-centre/scripts/backup.mjs apps/control-centre/package.json apps/control-centre/README.md
git commit -m "feat(control-centre): tracker backup script"
```

---

## Phase B — finish F1

### Task B1: Sync real notes — ✅ DONE (`cb728d0`, 2026-07-19)

8 real notes from the vault replaced the samples; roadmap checkboxes updated in the same commit. The publishing flow for FUTURE notes stays: edit vault → `pnpm -F docs vault:sync -- --vault "<vault path>"` (dry-run first, review the `notes.json` diff for privacy — only `publish: true` slugs, unpublished wikilink targets flattened to plain text) → commit → push. Never hand-edit `notes.json`.

### Task B2: Deploy — the only F1 step left

- [ ] **Step 1: Open a PR** from `claude/qol-control-centre-9fsas9` to `main` (title: `feat(qol): control centre + digital garden F1 + SEO hardening`). Vercel auto-deploys `apps/docs` on merge; `apps/control-centre` is not built by Vercel (`vercel.json` builds docs only) — confirm `vercel.json` is unchanged in the diff.
- [ ] **Step 2: Hassan merges** (his call — outward-facing).
- [ ] **Step 3: Verify production:** `https://itshassan.it/en/notes` lists 8 notes with filter chips, a detail page renders backlinks, `https://itshassan.it/feed.xml` serves RSS, `https://itshassan.it/sitemap.xml` includes the note URLs, an OG card renders on share.
- [ ] **Step 4: Tick the roadmap** — "deploy controllato" checkbox + update the status header line of `docs/qol/control-centre-roadmap.md` (F1 fully done). Commit as `docs(qol): mark F1 complete`.

**F1 done criterion (from the roadmap): public URL with the note list and at least three real notes.**

---

## Phase C — F3 Supabase/Postgres, then F4 MCP (gate H2)

These are whole subsystems; per plan-writing discipline they get their own detailed plan **after** gate H2 resolves. Do not improvise them from this document.

### Task C1: Author + execute the F3 migration plan

- [ ] **Step 1: After H2**, write a dedicated plan (`docs/qol/<date>-f3-postgres.md`) in the same format as this one, covering exactly the roadmap F3 checklist: tables `notes`, `note_tags`, `note_links` (schema per roadmap Stream 3); a `supabase`/`postgres` target added to `apps/docs/scripts/vault-sync.ts` (upsert, same parser — the script was written target-agnostic on purpose); RLS read-only for anonymous clients; full-text search via GIN index (`websearch_to_tsquery` — see the sample note in `resources/vault-sample/TIL - Postgres websearch_to_tsquery.md`, it was written as the design note for this); site reads from DB at build or runtime; documented rollback to static JSON.
- [ ] **Step 2: Get the plan reviewed by Hassan** (it involves credentials, cost, and a public-facing data path), then execute it task-by-task.

**Done criterion: same notes served from the database + working search.**

### Task C2: F4 MCP server on the vault

Blocked until C1 is stable. Scope from the roadmap: read-only tools `search`, `get note`, `backlinks`, `recent changes`; private notes must be unreachable; verified with a real AI client. Same procedure: dedicated plan first.

---

## Phase D — F5 leftovers + live connectors (gates H3, H4, H5)

### Task D1: Nightly vault import + git diary (gate H3)

Only if H3 = yes (vault becomes a git repo). Scope: nightly job (Windows Task Scheduler or equivalent) that imports AI-chat exports into the vault, auto-commits with a readable message, and the existing digest module (`lib/digest/git.ts`) pointed at the vault repo as a second source. Dedicated plan when unblocked.

### Task D2: Live Gmail connector (gate H4)

Implement `MailConnector` (interface in `lib/connectors/types.ts:50-54`) against the Gmail API with `mode: "live"`. Pages don't change — that is the whole point of the connector seam. Requires OAuth credentials from Hassan; store them outside the repo (env/local secrets file, gitignored), never commit them. Triage rules (`lib/inbox/triage.ts`) stay untouched and already have tests.

### Task D3: CV tailoring template (gate H5)

Roadmap F2 leftover. Deliverable: a template + short process doc (`docs/qol/cv-tailoring.md`) that takes a tracker entry (company, role, stack) and produces a tailored CV variant from Hassan's base CV. No code required unless Hassan wants it wired into the tracker UI later.

### Backlog (no gate, deliberately not scheduled)

- **Live job feed:** Indeed has no public API; scraping violates ToS. Realistic options: manual paste flow, RSS-based boards, or a paid aggregator API. Needs its own decision gate when job search intensity justifies it.
- **Live calendar connector:** Google Calendar behind `CalendarConnector` (`lib/connectors/types.ts:66-70`), same seam and same credential rules as D2. Low value until the briefing page drives real mornings.
- **LLM triage/scoring layer:** README marks this as a conscious later step — rule-based stays primary; an LLM pass only for the ambiguous middle.
- **Reproducible machine setup (F5.5):** separate concern, separate plan.
- **Garden "run sync" button in the dashboard:** CLI covers it today (YAGNI).

---

## Phase E — SEO follow-ups (no gate, executable now)

The 2026-07-19/20 session ran a full SEO audit and implemented the critical items; the remainder is a prioritized, self-contained list in **`_handover-qol-garden-seo.md` → section "SEO TODO — next session"** (repo root). Execute in the order given there: perf-1 (Tailwind `@source` over-scan, ~55KB CSS), perf-3 (drop HeroUI v2 provider), perf-2 (home sections client→server), then content/structured-data/tech items. content-2 needs Hassan's copy approval before merging. Treat that list as part of this plan — same global constraints, same reporting contract.

---

## Reporting contract for the executing agent

After each task: state what was committed (hash + message), paste the `pnpm check` tail, and list any scope creep appended to `.claude/_followup.md`. If a gate blocks you, stop and surface the gate — do not substitute your own answer for Hassan's.
