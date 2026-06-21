# Template: agenthub session — "crea endpoint"

> Usa per task classificato come: `action=create, domain=backend, stack=next`
>
> Questo repo ha UN solo app con backend: `apps/web-next` (Next.js App Router).
> Tutti gli endpoint sono route handlers in `apps/web-next/app/api/`.
>
> Placeholder:
> `{{TASK}}` — descrizione del task
> `{{ENDPOINT_PATH}}` — es. `/api/stats`, `/api/experiences/search`
> `{{HTTP_METHOD}}` — GET | POST | PUT | DELETE
> `{{INPUT_SHAPE}}` — descrizione dei parametri/body attesi
> `{{OUTPUT_SHAPE}}` — descrizione del response JSON atteso
> `{{ACCEPTANCE_CRITERIA}}` — lista criteri
> `{{MODE}}` — interactive | unattended (default interactive)

---

## Pre-flight checks (leggere prima di procedere)

1. Il nuovo endpoint rispetta la stessa response shape di `/api/quote`?
   - Success: `{ <key>: <value> }` con status 200
   - Validation error: `{ error: string, issues: ZodFlattenedError }` con status 400
   - Not found: `{ error: string }` con status 404

2. Idempotency applicabile? Se il metodo è POST e crea una risorsa: sì.

3. Auth gate necessaria? Controllare `apps/web-next/middleware.ts:21-23`.
   Attualmente protetti `/checkout/:path*` e `/api/checkout`.

4. Il nuovo schema va in `bookingSchemas.ts` (dominio booking) o file nuovo?

---

## Init session

```bash
python <agenthub-scripts>/hub_init.py --task "{{TASK}}" --agents 3 --base-branch main --format json
# Capture session_id; assert config base_branch: main (else ABORT).
# Task text: avoid embedded double-quotes and newlines. Interior colons are SAFE — do NOT strip them.
```

---

## Variant A — Validation-first (zod-schema-led)

**Lead specialist**: `engineering-skills:senior-backend`

**Prompt:**

```
You are a senior backend engineer implementing a new API endpoint for the
`laboratoire` monorepo (apps/web-next). Your perspective is VALIDATION-FIRST:
design the zod schema, then derive the handler from it.

== TASK ==
{{TASK}}

Endpoint: {{HTTP_METHOD}} {{ENDPOINT_PATH}}
Input: {{INPUT_SHAPE}}
Output: {{OUTPUT_SHAPE}}

Acceptance criteria:
{{ACCEPTANCE_CRITERIA}}

== EXISTING PATTERNS (follow exactly) ==
Reference implementation: apps/web-next/app/api/quote/route.ts

Response shape contract:
- 200: { <domain-key>: <typed-value> }
- 400: { error: "Invalid … payload", issues: parsed.error.flatten() }
- 404: { error: "… not found …" }
- 500: return NextResponse.json({ error: "Internal error" }, { status: 500 })
  — never let unhandled exceptions surface raw

Schema location:
- Booking-domain input → extend apps/web-next/lib/bookingSchemas.ts
- Non-booking input → create apps/web-next/lib/<feature>Schemas.ts

Idempotency: if POST and creates a resource, check idempotency key using
the same pattern as processCheckout in apps/web-next/lib/orders.ts

Currency math: roundCurrency() from apps/web-next/lib/pricing.ts:47
Never raw float arithmetic.

TypeScript: strict, no any. Route handler signature:
  export async function POST(request: Request): Promise<NextResponse>

== FORBIDDEN ==
- No Redux in apps/web-next
- No raw float math
- No new session model (single cookie pair in lib/session.ts is MVP-ONLY)
- Do not remove idempotency handling if applicable
- Do not store PII in cookies
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).

== DELIVERABLE ==
1. Zod schema (in bookingSchemas.ts or new file)
2. Route handler: apps/web-next/app/api/{{path}}/route.ts
3. Vitest test: apps/web-next/app/api/{{path}}/route.test.ts OR
   apps/web-next/lib/<feature>.test.ts (unit-level preferred)
4. pnpm check passes
5. Atomic commit message
```

---

## Variant B — Contract-first (API design-led)

**Lead specialist**: `engineering-advanced-skills:api-design-reviewer`

**Prompt:**

```
You are an API design expert implementing a new endpoint for the
`laboratoire` monorepo (apps/web-next). Your perspective is CONTRACT-FIRST:
define the full API contract (request/response shapes, error codes, edge cases)
before writing a single line of implementation.

== TASK ==
{{TASK}}

Endpoint: {{HTTP_METHOD}} {{ENDPOINT_PATH}}
Input: {{INPUT_SHAPE}}
Output: {{OUTPUT_SHAPE}}

Acceptance criteria:
{{ACCEPTANCE_CRITERIA}}

== REPO CONSTRAINTS ==
Existing API surface:
- POST /api/quote → { quote: BookingQuote } — see apps/web-next/app/api/quote/route.ts
- POST /api/checkout → { order: OrderRecord } — see apps/web-next/app/api/checkout/route.ts

Response consistency rules (enforced by convention, not middleware):
- All 2xx return JSON with a domain-named top key
- All 4xx return { error: string, issues?: ZodFlattenedError }
- No 2xx with empty body

TypeScript strict. Zod v4.3.6 for validation.
NextResponse from "next/server".

== PROCESS ==
1. Write the contract as a TypeScript interface first (request + response types).
2. Write the zod schema from the interface (not the other way around).
3. Implement the handler.
4. Write tests covering: valid input, missing fields, wrong types, boundary values,
   not-found case (if applicable), idempotency (if applicable).

== FORBIDDEN ==
Same as Variant A.
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).

== DELIVERABLE ==
Same as Variant A, with added: explicit contract documentation as a comment
block at the top of the route file (method, path, auth required, request shape,
response shape, error codes).
```

---

## Variant C — Test-first (TDD-led)

**Lead specialist**: `engineering-skills:tdd-guide`

**Prompt:**

```
You are a TDD practitioner implementing a new API endpoint for the
`laboratoire` monorepo (apps/web-next). Write the tests first, then
the implementation.

== TASK ==
{{TASK}}

Endpoint: {{HTTP_METHOD}} {{ENDPOINT_PATH}}
Input: {{INPUT_SHAPE}}
Output: {{OUTPUT_SHAPE}}

Acceptance criteria:
{{ACCEPTANCE_CRITERIA}}

== TEST SETUP ==
Framework: Vitest 3.2.4
Style reference: apps/web-next/lib/pricing.test.ts, orders.test.ts
Pattern: unit-test the pure functions (pricing, schema validation, data
transformation) rather than the HTTP layer. For HTTP-level tests, use
direct function calls, not fetch mocks.

Existing test helpers: none — create ad-hoc helpers in the test file.

== PROCESS ==
1. List all test cases before writing code:
   - Happy path (valid input → correct output)
   - Invalid input (missing required fields, wrong types, boundary violations)
   - Business logic edge cases (e.g., minimum_group pricing, promo eligibility)
   - Idempotency (same key → same result, no duplicate creation)
2. Write test file.
3. Write implementation to pass tests.
4. Confirm no existing tests break.

== FORBIDDEN ==
Same as Variant A.
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).

== DELIVERABLE ==
1. Test file (written and clearly labelled as written first)
2. Schema + handler implementation
3. pnpm check passes
4. Atomic commit message
```

---

## Eval config

```bash
# JUDGE: LLM judge mode (no --criteria flag). Read each surviving variant's
#   git diff main...hub/{session_id}/agent-{N}/attempt-1
# rank by this task type's rubric (references/task-taxonomy.md); tie-break fewer lines.
```

---

## Post-competition

```
engineering-skills:adversarial-reviewer prompt:
"Review the new {{HTTP_METHOD}} {{ENDPOINT_PATH}} endpoint in apps/web-next.
Check: (1) any input that bypasses zod validation and reaches business logic raw?
(2) any response that leaks internal error details to the client?
(3) if idempotency applies: is it actually safe to replay the request?
(4) any violation of the response shape contract?"
```

---

## Merge

```bash
# WRITE CEILING — depends on {{MODE}}:
# interactive: ask "merge variant <X> to main?" then run INTERACTIVE MERGE in
#   references/agenthub-contract.md (git merge --no-ff + archive/delete losers +
#   session_manager.py --cleanup). Do NOT set state=merged via any flag. Then atomic commit
#   per this task type's rule below.
# unattended: UNATTENDED STOP — session_manager.py --cleanup {session_id}; leave
#   hub/{session_id}/agent-<winner>/attempt-1 intact; STOP. Never merge/push.
# Both: write _orchestrator-runs/<date>-<slug>.md (Step 6) and notify (Step 7).

# Commit rule (interactive): one atomic commit. Route + schema + test in one commit.
```
