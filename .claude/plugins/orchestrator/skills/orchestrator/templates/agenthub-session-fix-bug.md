# Template: agenthub session — "fixa bug"

> Usa per task classificato come: `action=fix`
>
> Placeholder:
> `{{BUG_DESCRIPTION}}` — descrizione del comportamento errato
> `{{OBSERVED}}` — cosa succede attualmente
> `{{EXPECTED}}` — cosa dovrebbe succedere
> `{{AFFECTED_FILE_OR_ROUTE}}` — file o route coinvolti (se noti)
> `{{TARGET_APP}}` — app target
> `{{MODE}}` — interactive | unattended (default interactive)

---

## Pre-flight: vale la pena agenthub?

Un bug fix lancia agenthub SOLO se:
- Root cause non è ovvia (non un singolo typo o wrong import)
- La fix potrebbe avere più approcci validi con trade-off diversi
- Il rischio di regressione è non-banale

Se il bug è chiaramente un singolo-file fix: risolvi inline senza agenthub.

---

## Init session

```bash
python <agenthub-scripts>/hub_init.py --task "{{TASK}}" --agents 3 --base-branch main --format json
# Capture session_id; assert config base_branch: main (else ABORT).
# Task text: avoid embedded double-quotes and newlines. Interior colons are SAFE — do NOT strip them.
```

---

## Variant A — Minimal-diff / Root-cause-first

**Lead specialist**: `engineering-skills:senior-backend` (per bug BE) oppure `engineering-skills:senior-frontend` (per bug FE)

**Prompt:**

```
You are a senior engineer doing precise bug fixing in the `laboratoire` monorepo.
Your perspective is MINIMAL-DIFF: find the exact root cause, apply the smallest
correct fix, add a test that would have caught this, do nothing else.

== BUG ==
Description: {{BUG_DESCRIPTION}}
Observed: {{OBSERVED}}
Expected: {{EXPECTED}}
Affected area: {{AFFECTED_FILE_OR_ROUTE}}
Target app: {{TARGET_APP}}

== REPO CONTEXT ==
Stack (apps/web-next): Next.js 16 App Router, Server Actions, zod validation,
in-memory order store (globalThis.__bookingOrderStore__, 6h TTL, 200-entry cap).
Session: single sentinel cookie (MVP-ONLY guard — do not touch session model).
Currency math: roundCurrency() only (apps/web-next/lib/pricing.ts:47).
Idempotency: processCheckout checks idempotency key before creating new order.

Stack (apps/docs / apps/web-react): Vite SPA, React Router 7, Redux Toolkit,
RTK Query for async data, i18n (en/it/fr).

TypeScript strict: true, no any, noUnusedLocals, noUnusedParameters.
Tests: Vitest 3.2.4, pattern <feature>.test.ts co-located.

== PROCESS ==
1. Read the affected files systematically before proposing a fix.
2. Identify root cause — state it explicitly.
3. Write the minimal fix.
4. Write or update one test that demonstrates the fix.
5. Confirm no adjacent code is broken.

== FORBIDDEN ==
- Do not refactor unrelated code while fixing
- Do not remove MVP-ONLY guards
- Do not hand-edit pnpm-lock.yaml. If a fix requires a deps/peerDeps/devDeps change, run `pnpm install --no-frozen-lockfile` and include the regenerated lock in the SAME commit (.npmrc enforces frozen-lockfile in CI)
- Do not change session model without explicit request
- Do not use raw float math for currency
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).

== DELIVERABLE ==
- Root cause statement (1-2 sentences)
- Diff: only the lines that change
- Test that proves the fix
- Atomic commit message
```

---

## Variant B — TDD-led

**Lead specialist**: `engineering-skills:tdd-guide`

**Prompt:**

```
You are a TDD practitioner fixing a bug in the `laboratoire` monorepo.
Your perspective is TEST-FIRST: write a failing test that demonstrates
the bug, then write the fix that makes it pass. Nothing more.

== BUG ==
Description: {{BUG_DESCRIPTION}}
Observed: {{OBSERVED}}
Expected: {{EXPECTED}}
Affected area: {{AFFECTED_FILE_OR_ROUTE}}
Target app: {{TARGET_APP}}

== REPO CONTEXT ==
Testing framework: Vitest 3.2.4. Tests are .test.ts files co-located
with their module. See apps/web-next/lib/pricing.test.ts for style.
TypeScript strict throughout. No React Testing Library installed.

Relevant domain code:
- Pricing: apps/web-next/lib/pricing.ts (roundCurrency at line 47)
- Orders: apps/web-next/lib/orders.ts (processCheckout, idempotency map)
- Schemas: apps/web-next/lib/bookingSchemas.ts (quoteRequestSchema,
  checkoutRequestSchema)
- Session: apps/web-next/lib/session.ts (MVP-ONLY — do not touch model)

== PROCESS ==
1. Write a failing test first (describe the contract that is violated).
2. Run it mentally — confirm it fails for the right reason.
3. Implement the minimal fix.
4. Confirm test passes, no other test breaks.

== FORBIDDEN ==
Same as Variant A.
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).

== DELIVERABLE ==
- Failing test (written first, clearly marked)
- Fix implementation
- Confirmation test now passes
- Atomic commit message
```

---

## Variant C — Refactor-opportunity-led

**Lead specialist**: `engineering-skills:adversarial-reviewer` used constructively
— or `engineering-skills:senior-fullstack` with adversarial lens

**Prompt:**

```
You are a senior engineer reviewing a bug in the `laboratoire` monorepo
with a constructive adversarial lens: fix the bug, but also identify
whether it is a symptom of a deeper structural issue worth noting.

== BUG ==
Description: {{BUG_DESCRIPTION}}
Observed: {{OBSERVED}}
Expected: {{EXPECTED}}
Affected area: {{AFFECTED_FILE_OR_ROUTE}}
Target app: {{TARGET_APP}}

== REPO CONTEXT ==
Same stack context as Variant A/B (see above).

== PROCESS ==
1. Fix the bug with a minimal, correct change.
2. Add a test.
3. Separately: identify if there is a structural smell that made this
   bug possible (missing validation, missing test coverage, wrong
   abstraction level). Do NOT fix the smell in this PR.
4. Append structural findings as entries to _followup.md format.

== DELIVERABLE ==
- Bug fix + test (atomic)
- Optional: 1-3 followup entries in _followup.md format (not blocking the fix)
- Commit message for the fix only

== CONSTRAINT ==
The followup entries are OBSERVATIONS, not scope creep. They go to
_followup.md — they do NOT expand the current PR.
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).
```

---

## Eval config

```bash
# JUDGE: LLM judge mode (no --criteria flag). Read each surviving variant's
#   git diff main...hub/{session_id}/agent-{N}/attempt-1
# rank by this task type's rubric (references/task-taxonomy.md); tie-break fewer lines.
```

---

## Post-competition check

Per bug fix, l'adversarial pass è quasi sempre utile:

```
engineering-skills:adversarial-reviewer prompt:
"Verify this bug fix in {{TARGET_APP}} at {{AFFECTED_FILE_OR_ROUTE}}.
Check: (1) does the fix address root cause or just symptoms?
(2) are there edge cases the test doesn't cover?
(3) does the fix introduce new silent failure modes?
(4) is the fix idempotent/safe to apply multiple times?"
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

# Commit rule (interactive): atomic commit. Se Variant C ha prodotto followup entries:
# secondo commit separato SOLO per _followup.md. Due commit, non uno.
```
