---
name: orchestrator
description: Use when the user asks to create, fix, refactor, or audit a feature, page, endpoint, component, or config in this monorepo and wants automatic team assembly with competitive variant selection via agenthub. Accepts a runtime mode (interactive | unattended); defaults to interactive. Do NOT use for single-character fixes, content-only edits, or tasks resolvable with one inline edit.
version: "2.1.0"
author: Hassan Akkari
created: 2026-05-08
updated: 2026-06-20
modes: [interactive, unattended]
requires:
  agenthub: [init, spawn, eval, merge, run, status, board]
  post-competition: engineering-skills:adversarial-reviewer
  planning: superpowers:writing-plans
repo_context: c:/dev/laboratoire — canonical context in .claude/CLAUDE.md
---

# Skill: orchestrator

Dato un task in linguaggio naturale (IT o EN), questo skill:

1. **Classifica** il task sugli assi: stack, dominio, azione, complessità.
2. **Seleziona** depth e team composition per la competition.
3. **Configura e lancia** un agenthub session in worktrees git isolati.
4. **Giudica** il winner con criteri specifici per il task type.
5. Esegue un **adversarial pass** post-competition (raccomandato per task complex).

---

## Flowchart

```
INPUT: task + mode (default interactive)
   |
   v
[Step 0: RESOLVE MODE (interactive | unattended)]
   |
   v
[Step 1: CLASSIFY: stack/domain/action/complexity + confidence]
   |
   +--[confidence low?]--> interactive: ASK | unattended: ABORT+notify
   |
   v
[Out-of-scope?] --YES--> route to AGENTS.md handler / inline (do not compete)
   |
   v
[Step 1.5: ENTP PRE-FLIGHT? gate: complex | conf!=high | --challenge | strategy task]
   |   interactive: surface reframings -> human picks proceed|reframe|abort
   |   unattended:  advisory only -> entp_preflight run-log; NEVER blocks; error->log+proceed
   v
[Step 2: DEPTH] simple->Depth-1 | complex->Depth-2
   |
   +--[ambiguous?]--> interactive: ASK | unattended: Depth-1 + adversarial
   |
   v
[Step 4: INIT (hub_init.py --task --base-branch main) -> assert base_branch]
[SPAWN N variant agents in worktrees (push disabled); >=2 must materialize]
[OBJECTIVE GATE: pnpm check per worktree (timeout); disqualify failures]
   |
   +--[all fail / <2 variants]--> interactive: SURFACE | unattended: ABORT+notify
   |
   v
[JUDGE (LLM judge, task-type rubric)]
   |
   v
[ADVERSARIAL (fail-closed gate)]
   |
   +--[CRITICAL / escalated MEDIUM / reviewer error]--> interactive: SURFACE | unattended: ABORT+notify
   |
   v
[WRITE CEILING]
   interactive: ask -> merge --no-ff to main
   unattended:  cleanup worktrees, leave winner branch, STOP (commit-to-branch)
   |
   v
[Step 6: write run-log]  ->  [Step 7: notify (file + push)]
(cost backstop checked at SPAWN / post-JUDGE / post-ADVERSARIAL boundaries)
```

---

## Step 0 — Resolve execution mode (do this FIRST)

Inspect the args for a mode keyword (see `references/execution-modes.md`):

- `mode=unattended`, `--unattended`, "unattended", "headless", "non-interactive" → **MODE = unattended**
- `mode=interactive`, `--interactive`, "interactive", "ask me" → **MODE = interactive**
- no keyword → **MODE = interactive** (fail-safe default)

Strip the mode keyword from the args; the remainder is the task description.

MODE governs three switches for the rest of this skill: human gates (interactive
asks/confirms; unattended treats any "ask the human" branch as ABORT), write
ceiling (interactive merges after approval; unattended commits-to-branch and
STOPS), and failure (interactive surfaces & waits; unattended aborts clean +
notifies). Note the run start time for the wall-clock cost backstop. Whatever the
outcome, Step 6 writes a run-log record and Step 7 notifies.

---

## Step 1 — Classification

Read the task and fill this mental YAML:

```yaml
stack:    # next | vite-spa | ui-lib | config | cross
domain:   # frontend | backend | fullstack | devops
action:   # create | refactor | fix | audit
complexity: # simple | complex
```

**Confidence.** Also emit a confidence level for the classification: `high` /
`med` / `low`. If you cannot confidently fix stack/domain/action/complexity →
confidence = low → **unresolved failure**: interactive asks the user; unattended
ABORTS + notifies (Steps 6–7). Record the confidence in the run-log.

### Stack resolution rules

| Trigger phrase / path hint | stack |
|---|---|
| "pagina /…", "route /app/…", "server action", "app router", `apps/web-next` | `next` |
| "componente React", "Redux", "MSW", `apps/web-react`, `apps/docs` | `vite-spa` |
| "componente condiviso", "HeroUI wrapper", "Storybook", `packages/ui` | `ui-lib` |
| "turbo", "eslint config", "tsconfig", `vercel.json`, "pnpm" | `config` |
| task tocca 2+ stack sopra | `cross` |

### Complexity heuristics

**simple** if ALL of:
- File count stimato ≤ 3
- Nessuna nuova dipendenza introdotta
- Nessun cambio cross-workspace
- Nessuna business logic con edge case multipli

**complex** if ANY of:
- File count stimato ≥ 4
- Introduce nuova route + schema + handler + test
- Tocca 2+ workspace (e.g., `packages/ui` + `apps/web-next`)
- Richiede decisioni architetturali (state shape, data fetching strategy)
- Business logic con promo/pricing/auth ramificazioni

---

## Step 1.5 — ENTP pre-flight critic (gated; advisory)

Optionally invoke the global `entp` skill in **pre-flight mode** to stress-test the
task's FRAMING / RISK / SCOPE before spending competition budget. ENTP is advisory:
it can recommend `don't-build`, but it NEVER blocks, aborts, merges, or downgrades a
gate (preserves G2). Runs after Step 1 (so it has real complexity + confidence) and
after the out-of-scope check, before Step 2 depth.

**Gate — run ENTP only when it can find leverage. Run if ANY:**
- `complexity = complex`, OR
- `confidence != high`, OR
- the (mode-stripped) args contain `--challenge`, OR
- the task is strategic in nature (planning / architecture / tradeoff-evaluation / "should we…?").

Otherwise (simple AND high-confidence AND mechanical) → SKIP; record
`entp_preflight: skipped (gate)` in the run-log.

**Pre-flight mode (the named scoped invocation):** invoke the `entp` skill — or
dispatch `Agent(subagent_type=<host type>, prompt=<the entp pre-flight contract>)` —
handing it ONLY:
- the verbatim task text,
- minimal repo context (the smallest CLAUDE.md constraints relevant to framing),
- the Step 1 classification + confidence.

Instruct it explicitly: **pre-flight mode — no code, no diffs, no run logs; advisory
only; run `analyze + challenge + decide` on FRAMING / SCOPE only.** Withholding code
is what keeps the 3-role boundary clean (ENTP ≠ adversarial-reviewer ≠ judge). Take
ENTP's CORE structured set (reframings · risky assumptions · scope verdict · optional
better target).

**Mode contract (preserves G2 — ENTP NEVER blocks):**
- **interactive** → surface ENTP's reframings + verdict; the human picks
  `proceed | reframe | abort`. `reframe` = restate the task and re-run from Step 1;
  `abort` = clean stop (Steps 6–7).
- **unattended** → **advisory only**: write the verdict to the run-log
  `entp_preflight` field and PROCEED regardless. ENTP adds no "ask-human" branch and
  gains no abort power. If ENTP errors → record `entp_preflight: skipped (error)` and
  PROCEED — the OPPOSITE of the adversarial pass's fail-closed behavior (by design;
  pre-commitment advice is not a safety gate). ENTP is NOT an unresolved-failure
  trigger (see `references/execution-modes.md`).

---

## Step 2 — Depth selection

| Depth | Quando | Struttura competition |
|---|---|---|
| **1 (lone specialists)** | complexity = simple | 3 varianti, ognuna condotta da un singolo specialist con prospettiva diversa |
| **2 (mini-teams)** | complexity = complex | 3 varianti, ognuna con un lead + 2-3 sub-specialist chiamati via `Agent` tool internamente |

**Regola dei costi**: Depth-2 ≈ 3-4× il costo di Depth-1. Se il task è
ambiguamente simple/complex:
- **interactive** → chiedi chiarimento all'utente.
- **unattended** → NON abortire: declassa a **Depth-1 + adversarial pass**
  (cost-safe default). Questo è l'unico trigger di failure che in unattended NON
  porta ad abort.

---

## Step 3 — Variant assembly

Per ogni stack+action, il roster di specialisti è definito in `references/task-taxonomy.md`. Regole generali:

- Variant A: **approccio architetturale dominante** (es. schema-first, RSC-first)
- Variant B: **approccio opposto** (es. handler-first, forms-first)
- Variant C: **approccio qualità/test** (TDD-led, type-safety-first)

Ogni variante riceve un **prompt self-contained** che include:
- Il task completo con acceptance criteria
- Il repo context estratto da CLAUDE.md (stack, gotchas rilevanti, conventions)
- Il suo ruolo e prospettiva specifica
- La lista `forbidden_actions` del repo applicabile

---

## Step 4 — agenthub session (real 2.9.0 contract)

Drive agenthub via the EXACT commands in `references/agenthub-contract.md`. Do
NOT use `--name` or `--criteria` (they don't exist). Do NOT set the session
state to `merged` — the `init→merged` transition is rejected by agenthub, and
the git merge does the real integration work.

1. **INIT** — `hub_init.py --task "<task; no embedded quotes/newlines>" --agents 3
   --base-branch main --format json`; capture `session_id`; ASSERT
   `config.yaml base_branch: main` (else ABORT). hub_init failure / no session_id → ABORT.
   - interactive: confirm the depth/team plan with the user before spawning.
2. **SPAWN** — all variant `Agent(...)` calls in ONE message, `isolation:
   "worktree"`, each with its self-contained prompt (templates). Disable push in
   each worktree. If <2 variants materialize → unresolved failure.
3. **OBJECTIVE GATE (G3)** — `pnpm check` (non-interactive, 20-min timeout) in each
   worktree; disqualify fail/timeout. All fail → unresolved failure.
4. **JUDGE** — LLM judge mode: read `git diff main...hub/{session}/agent-{N}/attempt-1`;
   rank by the Step 5 rubric; tie-break fewer lines.
5. **ADVERSARIAL (G4, fail-closed)** — `engineering-skills:adversarial-reviewer` on
   the winner diff. CRITICAL → unresolved failure. Unattended: MEDIUM touching
   pricing/auth/session/middleware escalates to a stop. Reviewer error/no verdict →
   treat as CRITICAL. Non-escalated MEDIUM/LOW → `_followup.md`.
6. **WRITE CEILING (mode-dependent):**
   - interactive: present winner + rationale; ask "merge variant <X> to main?".
     Yes → INTERACTIVE MERGE sequence. No → abort + clean up.
   - unattended: UNATTENDED STOP sequence — cleanup worktrees, leave the winning
     branch, STOP. NEVER merge/push.

Check the cost backstop (`references/execution-modes.md`) at the SPAWN, post-JUDGE,
and post-ADVERSARIAL boundaries: if `RUN_AGENT_CEILING` (12) or
`RUN_WALLCLOCK_MINUTES` (45) is exceeded → unresolved failure (abort + notify).

Template concreti per ogni task type in `templates/`.

---

## Step 5 — Judge rubric (per task type — used in LLM judge mode, NOT a CLI flag)

These weighted criteria are the rubric applied when reading variant diffs in
Step 4's JUDGE step. There is no `--criteria` flag; this is prose for the judge.
Weights sum to 100.

| Task type | Criteri primari (peso) | Criteri secondari |
|---|---|---|
| create-page | correctness 30% / TypeScript strictness 25% / UX/accessibility 20% / test coverage 15% / convention adherence 10% | Atomic commit-readiness |
| fix-bug | root cause addressed 35% / no regression 30% / minimal diff 20% / test added 15% | No silent failure swallowing |
| create-endpoint | validation completeness 30% / idempotency handling 25% / error response shape 20% / test coverage 15% / convention 10% | Security: no PII leak |
| refactor | convention adherence 30% / type safety gain 25% / diff minimality 20% / test retention 15% / reversibility 10% | No scope creep |
| audit | finding severity accuracy 35% / actionability 30% / completeness 25% / false positive rate 10% | Followup radar entries |

---

## Step 6 — Write the run-log record (always, every terminal state)

Write exactly one file per `references/run-log-format.md`:
`_orchestrator-runs/<YYYY-MM-DD>-<slug>.md`. Fill every field (task,
classification + confidence, depth, variant leads, per-variant objective-gate
results, judge winner + rationale, adversarial verdict, cost audit, terminal
state). Never reopen a prior run's file; on date+slug collision append `-2`.
Commit it. NEVER read a prior run-log into any agent prompt (audit-only).

## Step 7 — Notify (every terminal state)

1. The run-log file (Step 6) is the source of truth — already written.
2. Best-effort `PushNotification({ message: "<one line, <200 chars, no md>",
   status: "proactive" })`. "not sent" → do nothing. Never fails the run. On
   `aborted-DIRTY`, the message must flag that manual cleanup is needed.

---

## Out-of-scope (non lanciare agenthub per questi)

- **Typo / one-word content edit** — inline edit diretto.
- **i18n copy update su una singola locale** — usa `portfolio-content-curator` da AGENTS.md (tutte e 3 le locale insieme).
- **Bump di una dipendenza isolata** — isola in un commit separato, nessuna competition utile.
- **Deploy config change** — usa `deploy-warden` da AGENTS.md.
- **Domande su come funziona il codice** — usa `Explore` sub-agent o `feature-dev:code-explorer`.
- **Bootstrap / CLAUDE.md update** — usa `claude-md-management:revise-claude-md`.

---

## Invarianti del repo da rispettare in ogni competition

Queste regole si applicano a **tutte** le varianti. Inserirle in ogni variant prompt.

1. `pnpm check` (lint + typecheck + test) deve passare.
2. Atomic commit: un task = un commit. Scope creep → `_followup.md`.
3. `web-next` non usa Redux; `docs`/`web-react` non usano Server Actions.
4. Nessun edit a mano di `pnpm-lock.yaml`. Se cambi deps/peerDeps/devDeps in qualsiasi `package.json`, esegui `pnpm install --no-frozen-lockfile` e includi il lock rigenerato nello **stesso commit** (`.npmrc` enforce `frozen-lockfile` in CI — separarli rompe la build).
5. `packages/ui` non importa da `apps/*` mai.
6. I18n: mai modificare una sola locale senza aggiornare le altre due.
7. Currency math: sempre via `roundCurrency()` in `lib/pricing.ts`.
8. `orders.ts`/`session.ts` hanno guard `MVP-ONLY` — non rimuovere senza approvazione esplicita.

### v2 execution guardrails (in addition to the 8 above)

- **G1** Unattended NEVER push / merge / `gh pr merge`. Enforced at the write
  ceiling AND structurally: push is disabled in every variant worktree at SPAWN,
  and variant prompts forbid push/merge/checkout-main.
- **G2** Mode fail-safe: default interactive; unattended treats any "ask human"
  branch as ABORT (never blocks). Every long op (`pnpm check`, spawn) is timeout-bounded.
- **G3** Objective gate (`pnpm check`) is hard, per-worktree, timeout-bounded, run
  via direct Bash (never the 120s ranker eval-cmd). No override.
- **G4** Adversarial pass is FAIL-CLOSED: CRITICAL (or reviewer error / no verdict)
  stops the run; unattended escalates pricing/auth/session/middleware MEDIUMs.
- **G5** Abort is clean AND verified: cleanup worktrees, then assert `git status`
  + `git worktree list` are clean; residue → terminal state `aborted-DIRTY` + notify.
- **G6** Cost backstop is structural: `RUN_AGENT_CEILING`=12, `RUN_WALLCLOCK_MINUTES`=45,
  checked at phase boundaries (a prose skill can't live-meter subagent tokens; token
  cost is post-hoc audit only).
- **G7** Run log (`_orchestrator-runs/<date>-<slug>.md`) is append-only at the
  directory level, one file per run, committed, AUDIT-ONLY (never fed to agents).
- **G8** Secrets hygiene: never place secrets/env values into any variant/judge/
  adversarial prompt. Operator is the trusted task source; over-reach bounded by
  forbidden actions + the write ceiling.
- **G9** Project "agents" in `.claude/AGENTS.md` are PROMPT TEMPLATES, not
  `subagent_type`s. Route out-of-scope as `Agent(subagent_type=<host type>,
  prompt=<mandate>)`; `claude-md-management:revise-claude-md` is a Skill.

---

## Riferimenti

- `references/task-taxonomy.md` — tassonomia completa con team raccomandato per leaf
- `references/specialist-roster.md` — tabella specialist con trigger/anti-trigger
- `templates/agenthub-session-create-page.md` — template concreto per "crea pagina"
- `templates/agenthub-session-fix-bug.md` — template concreto per "fixa bug"
- `templates/agenthub-session-create-endpoint.md` — template concreto per "crea endpoint"
- `examples/walkthrough-create-dashboard.md` — narrazione end-to-end di un task reale ⚠️ (v1 command forms — superseded by `references/agenthub-contract.md`; rewrite deferred to Phase 2)
- `references/execution-modes.md` — the interactive vs unattended mode axis
- `references/agenthub-contract.md` — the real agenthub 2.9.0 interface
- `references/run-log-format.md` — run-log location + record template
