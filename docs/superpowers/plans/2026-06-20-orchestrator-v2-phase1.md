# Orchestrator v2 — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Revision 2** (2026-06-20): folds in a 4-lens adversarial review (spec coverage / agenthub-contract-vs-source / plan hygiene / unattended safety). Notable corrections vs rev 1: dropped the rejected `--state merged` call, added the missing branch-creation task, made G1 (no push/merge) a *structural* control, replaced the dead-letter token ceiling with an enforceable agent-count + wall-clock backstop, made the adversarial gate fail-closed, fixed an incorrect "strip all colons" instruction, and wired the §3 routing diamonds + flowchart into the actual SKILL body.

**Goal:** Add an `interactive | unattended` execution-mode axis to the existing `orchestrator` skill, and reconcile its agenthub invocations with the actually-installed agenthub 2.9.0 interface, so unattended runs are quality-first, commit-to-branch-only, abort cleanly on unresolved failure, and record every run in a committed audit log with dual notification.

**Architecture:** The `orchestrator` skill is a **pure-prose Claude Code skill** (`SKILL.md` + `references/` + `templates/` + `examples/`, no executable code). Phase 1 edits markdown only. The runtime behavior is whatever the model does when it reads the skill, so "implementation" = writing precise instructions, and "tests" = grep assertions, the agenthub `dry_run.py` validator, and two end-to-end rehearsals (unattended + interactive) on throwaway tasks. A new `mode` runtime argument is parsed from the skill's natural-language `args` (no new frontmatter key); mode flips three switches — human gates, write ceiling, failure behavior — while the v1 classify→compete→judge spine stays identical.

**Tech Stack:** Markdown skill files; agenthub 2.9.0 (Python CLIs `hub_init.py` / `result_ranker.py` / `session_manager.py` / `board_manager.py` / `dag_analyzer.py` + LLM-coordinator `/hub:*` skills); git worktrees; `PushNotification` tool; pnpm 10 / Turbo monorepo gates (`pnpm check`).

## Global Constraints

These apply to **every** task. Exact values copied from the spec (`docs/superpowers/specs/2026-06-20-orchestrator-v2-design.md`) and recon (verified against the installed scripts).

- **Skill is markdown-only.** No scripts added to the orchestrator skill. Sub-files are `.md`, referenced by relative path in backticks, Read on demand.
- **Target skill dir:** `.claude/plugins/orchestrator/skills/orchestrator/`. The agenthub scripts dir (call it `<agenthub-scripts>`) is `~/.claude/plugins/cache/claude-code-skills/agenthub/2.9.0/skills/agenthub/scripts`.
- **Version bump in lockstep:** `SKILL.md` frontmatter `version` → `"2.0.0"` AND `.claude/plugins/orchestrator/.claude-plugin/plugin.json` `version` → `2.0.0`. Quote the YAML version string.
- **Default mode is `interactive`** (fail-safe). Mode is never auto-inferred to `unattended`.
- **Unattended write ceiling = commit-to-branch, STOP.** Never `push`, never `merge`, never `gh pr merge`. Enforced both in the orchestrator's write ceiling AND structurally in each worktree (Task 7). (Spec G1.)
- **Unattended never blocks.** Any path that would prompt a human → abort clean + notify. Every long-running operation (`pnpm check`, spawn) has a finite timeout. (Spec §4, G2.)
- **Objective gate `pnpm check` is a hard gate**, run via direct Bash in each worktree with a finite wall-clock timeout — NOT through `result_ranker.py --eval-cmd` (hard-coded 120s; a monorepo `pnpm check` exceeds it). (Spec G3.)
- **Adversarial pass is a fail-closed gate.** A CRITICAL finding stops the run; a reviewer error / unparseable verdict is treated as CRITICAL (fail-closed), never as pass. (Spec G4.)
- **Run log:** one file per run at repo root `_orchestrator-runs/<YYYY-MM-DD>-<slug>.md`, **committed**, append-only at the directory level, **never read back into any agent prompt** (audit-only, no cross-run learning in v2). (Spec §6/§7/§9.)
- **agenthub real contract (source-verified, v2.9.0):** `hub_init.py` takes `--task` (REQUIRED), **not** `--name`; there is **no** `--criteria` flag — quality judging uses LLM `--judge` mode. `--base-branch` defaults to the *current* branch, so **always pass `--base-branch main`** AND assert it in config after init. Branch naming is `hub/{session-id}/agent-{N}/attempt-{M}`. `session_manager.py` enforces a state machine `init→running→evaluating→merged|archived` — do NOT call `--state merged` from `init` (it errors); the git merge itself is what matters.
- **Repo invariants (v1, retained, injected into every variant prompt):** `pnpm check` must pass · atomic commit (scope creep → `_followup.md`) · web-next no Redux / docs+web-react no Server Actions · no manual `pnpm-lock.yaml` edits (regenerate lock in same commit) · `packages/ui` never imports `apps/*` · i18n always all three locales · currency via `roundCurrency()` · don't remove `MVP-ONLY` guards.
- **Secrets hygiene (spec G8):** never place secrets/env values into any variant/judge/adversarial prompt. The operator is the trusted task source; agent over-reach is bounded by forbidden actions + the write ceiling.
- **Project "agents" are prompt templates, not `subagent_type`s** (spec G9): route out-of-scope work as `Agent(subagent_type=<HOST type>, prompt=<mandate>)`; `claude-md-management:revise-claude-md` is a **Skill**, not an agent.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `references/execution-modes.md` | Create | Mode axis: 3 switches, fail-safe default, abort-clean(+verify), write ceilings, cost backstop constants, notification policy, audit-only run-log note. |
| `references/agenthub-contract.md` | Create | Reconciled real agenthub 2.9.0 interface; INIT(+base-branch assert)/SPAWN(+push-disable, failure handling)/OBJECTIVE GATE(+timeout)/JUDGE/ADVERSARIAL(+CRITICAL rubric, fail-closed)/INTERACTIVE MERGE/UNATTENDED STOP/CLEANUP; gotchas. |
| `references/run-log-format.md` | Create | Run-record template, location/commit convention, slug rule, terminal states incl. `aborted-DIRTY`, audit-only note. |
| `SKILL.md` | Modify | Frontmatter (v2.0.0, `modes:`, description); flowchart rewrite; Step 0 mode parse; Step 1 confidence branch; Step 2 depth mode-branch; Step 4 mode-aware compete/gate/judge/adversarial/ceiling; Step 5 retitled judge rubric; cost-backstop section; Steps 6–7 run-log + notify; invariants G1–G9; references list. |
| `templates/agenthub-session-create-page.md` | Modify | Real contract calls + `{{MODE}}` branch + git-isolation forbidden actions + corrected task-text guidance. |
| `templates/agenthub-session-create-endpoint.md` | Modify | Same. |
| `templates/agenthub-session-fix-bug.md` | Modify | Same. |
| `.claude/plugins/orchestrator/.claude-plugin/plugin.json` | Modify | `version` → `2.0.0`. |
| `.gitignore` (repo root) | Modify | Add `.agenthub/`. |
| `_orchestrator-runs/.gitkeep` | Create | Establish committed run-log directory. |

`examples/walkthrough-create-dashboard.md`, `references/specialist-roster.md`, `references/task-taxonomy.md` are NOT modified in Phase 1.

---

### Task 0: Create the working branch

**Files:** none (git only).

**Interfaces:** Produces the branch every later task commits to. Without this, commits land on `docs/orchestrator-v2-spec` and Task 8's "main unchanged" assertion is a false pass.

- [ ] **Step 1: Branch off main**

The spec + this plan live on `docs/orchestrator-v2-spec`; the skill changes are independent of them, so branch off `main`.

```bash
git checkout main
git checkout -b feat/orchestrator-v2-phase1
```

- [ ] **Step 2: Verify**

Run: `git branch --show-current`
Expected: `feat/orchestrator-v2-phase1`

(The plan/spec docs remain readable on `docs/orchestrator-v2-spec`; reference them from there during implementation.)

---

### Task 1: Execution-modes reference doc

**Files:** Create `.claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md`

**Interfaces:** Produces the mode keywords (`mode=unattended`/`mode=interactive`), the three switches, the abort policy, the cost-backstop constants (`RUN_AGENT_CEILING`, `RUN_WALLCLOCK_MINUTES`), and terminal states ∈ {`merged`, `committed-to-branch`, `aborted`, `aborted-DIRTY`}. Tasks 3–5 and 7 consume these names verbatim.

- [ ] **Step 1: Write the reference doc** with exactly this content:

```markdown
# Execution modes — orchestrator v2

> The mode axis is the only new concept in v2. It flips three switches; the
> v1 classify → depth-select → compete → judge spine is identical in both modes.

## Modes

`mode ∈ { interactive, unattended }`. **Default: interactive** (fail-safe).
Resolved in Step 0 from the args. NEVER auto-inferred to unattended.

## The three switches

| Switch | interactive | unattended |
|---|---|---|
| Human gates | ask on ambiguity; confirm before merge | none: any "ask the human" branch becomes ABORT |
| Write ceiling | merge to `main` AFTER explicit human approval | commit-to-branch, STOP — never push, never merge |
| On unresolved failure | surface to human, wait | abort clean + notify |

(Task source is identical in both modes — the operator hands the skill a task.)

## Unresolved-failure triggers (both modes hit these; mode decides the reaction)

1. Classification confidence is low.
2. Depth is ambiguous (simple vs complex) — interactive asks; unattended does NOT
   abort, it cost-safely defaults to Depth-1 + adversarial.
3. ALL variants fail the objective gate (`pnpm check`), OR fewer than 2 variants
   successfully spawn+commit (a 1-variant "competition" is not quality-first).
4. The adversarial pass returns CRITICAL (or errors — fail-closed).
5. The cost backstop is breached (see below).
6. `hub_init` fails / yields no session_id, or base_branch != main after init.

- interactive → ask / surface and wait.
- unattended → ABORT: do not merge, clean up worktrees, write the run-log record
  (`terminal state: aborted — <reason>`), notify. main untouched.

(Trigger 2 is the one exception: ambiguous depth is NOT an abort — it resolves to
Depth-1 + adversarial in unattended.)

## Write ceiling detail

- **interactive:** after eval + adversarial + objective gate, present winner +
  judge rationale, ask "merge variant <X> to main?". Yes → INTERACTIVE MERGE
  sequence (`agenthub-contract.md`). No → treat as abort (clean up).
- **unattended:** after eval + adversarial + objective gate, leave the winning
  branch `hub/{session-id}/agent-{winner}/attempt-1` intact (the agent already
  committed there), run worktree cleanup, STOP. Terminal state =
  `committed-to-branch`. NEVER call the merge sequence.

## Cost backstop (enforceable; NOT a live token meter)

A prose skill running in the main loop cannot reliably meter the live token
consumption of parallel detached worktree agents. So the backstop is structural
and checked at phase boundaries (before SPAWN, after JUDGE, after ADVERSARIAL):

- `RUN_AGENT_CEILING = 12` total dispatched agents per run (covers Depth-2's 9 +
  margin; the orchestrator counts the Agent calls it issues).
- `RUN_WALLCLOCK_MINUTES = 45` per run (note start time via `date`; check elapsed
  at each phase boundary).
- Inherent caps that bound cost without metering: ≤3 variants, Depth ≤2 (≤9
  agents), single attempt (NO retry loops), NO re-spawn on partial failure.

If either ceiling is exceeded → unresolved failure (abort + run-log
`aborted — cost backstop: <which ceiling>` + notify). Approximate token cost is
recorded POST-HOC in the run-log Cost field for audit/tuning — it is not the
enforcement trigger.

## Abort = clean (and VERIFIED)

Abort runs `session_manager.py --cleanup {session}` (removes worktrees only),
retains hub branches for forensic inspection (never merged), leaves `main` and
the working tree untouched. Then VERIFY:

- `git status --porcelain` shows nothing beyond the run-log file, AND
- `git worktree list` shows no remaining `hub/...` worktree.

If verification fails (residue, or a worktree that wouldn't remove — common on
Windows/NTFS file locks, see CLAUDE.md gotcha #9), record terminal state
`aborted-DIRTY` and make the push notification flag that manual cleanup is needed.
No fallback ladder and no best-effort commit in Phase 1.

## Notification policy (both terminal states)

1. **Report file (source of truth):** the run-log record. Always written.
2. **Push (best-effort):** `PushNotification({ message, status: "proactive" })`,
   < 200 chars, one line, no markdown. If "not sent", do nothing; never fails the run.

## Run-log access constraint

The run log is AUDIT-ONLY and append-only. It must NEVER be read back into a
variant/judge/adversarial prompt, and it is NOT a routing input. There is no
cross-run learning in v2.
```

- [ ] **Step 2: Verify**

Run: `grep -E "committed-to-branch|never push, never merge|aborted-DIRTY|RUN_AGENT_CEILING = 12|RUN_WALLCLOCK_MINUTES = 45|AUDIT-ONLY" .claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md`
Expected: ≥6 matches.

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md
git commit -m "feat(orchestrator): execution-modes reference (modes, abort-verify, cost backstop, notify)"
```

---

### Task 2: agenthub real-contract reference doc

**Files:** Create `.claude/plugins/orchestrator/skills/orchestrator/references/agenthub-contract.md`

**Interfaces:** Consumes mode names + terminal states (Task 1). Produces the exact sequences SKILL.md Step 4 (Task 5) and the templates (Task 7) cite — `INIT`, `SPAWN`, `OBJECTIVE GATE`, `JUDGE`, `ADVERSARIAL`, `INTERACTIVE MERGE`, `UNATTENDED STOP`, `CLEANUP` — plus the CRITICAL rubric.

- [ ] **Step 1: Write the reference doc** with exactly this content:

```markdown
# agenthub real contract (v2.9.0) — orchestrator v2

> v1's templates called `agenthub:init --name …` and `agenthub:eval --criteria …`.
> Neither flag exists in the installed agenthub 2.9.0. This file is the source of
> truth. Scripts: `~/.claude/plugins/cache/claude-code-skills/agenthub/2.9.0/skills/agenthub/scripts/` (call it <agenthub-scripts>).

## Hard facts (source-verified — respect these)

- `hub_init.py` requires `--task` (NOT `--name`). No `--name` flag exists.
- `--base-branch` defaults to the CURRENT branch (from .git/HEAD). ALWAYS pass
  `--base-branch main`, then ASSERT it in config after init (see INIT).
- Session id = local timestamp `%Y%m%d-%H%M%S`, no collision guard → serialize
  inits; never launch two in the same second.
- `config.yaml` is written as quoted single-line YAML and read with
  `line.split(":", 1)` (key before first colon, rest is the value). Interior
  colons in the task text are SAFE. The real fragilities are embedded double-quotes
  and newlines — avoid those in `--task`; do NOT strip interior colons.
- `result_ranker.py` runs `--eval-cmd` with a HARD 120s timeout per worktree. Do
  NOT route `pnpm check` through it.
- There is NO `--criteria` flag. Weighted task-type criteria (task-taxonomy.md)
  are the LLM-JUDGE RUBRIC text, not a CLI argument.
- Worktrees are created ONLY by spawning agents with `isolation: "worktree"`.
  Branch naming: `hub/{session-id}/agent-{N}/attempt-{M}`.
- `session_manager.py` enforces VALID_TRANSITIONS init→running→evaluating→
  merged|archived. A fresh session is `init`. Do NOT call `--state merged` — it
  is rejected from `init` and the git merge does the real work anyway. Session
  state is cosmetic for our flow; skip it.
- "terminal state" in our run-log (merged / committed-to-branch / aborted /
  aborted-DIRTY) is an ORCHESTRATOR concept, distinct from agenthub session state;
  only the word `merged` coincides.

## INIT

Note the start time for the wall-clock backstop (`date -u +%s`). Then:

    python <agenthub-scripts>/hub_init.py \
      --task "<task text; no embedded double-quotes or newlines>" \
      --agents 3 --base-branch main --format json

Capture `session_id` from the JSON. THEN assert the base branch took:

    grep '^base_branch:' .agenthub/sessions/<session_id>/config.yaml
    # must read `base_branch: main`. If not → ABORT (unresolved failure).

If hub_init errors or yields no session_id → ABORT (unresolved failure).

## SPAWN

Issue all N `Agent(...)` calls in a SINGLE message, each with
`isolation: "worktree"` and its full self-contained variant prompt. Count the
agents dispatched against `RUN_AGENT_CEILING`. After worktrees exist, structurally
disable push in each so a rogue agent physically cannot push:

    git -C <each-worktree-path> remote set-url --push origin DISABLED_no_push

Resolve worktree paths from `git worktree list --porcelain` (match the branch
`hub/{session-id}/agent-{N}/attempt-1`). If fewer than 2 worktrees/branches
materialize → ABORT (unresolved failure: no real competition).

## OBJECTIVE GATE (per variant — BEFORE judging)

For each agent branch, run `pnpm check` NON-INTERACTIVELY in that worktree, with a
finite wall-clock timeout (vitest run mode, not watch):

    cd <worktree-path> && timeout 1200 pnpm check    # 20-min ceiling per variant

- exit 0 → variant qualifies.
- non-zero or TIMEOUT → variant DISQUALIFIED.
- ALL variants disqualified → unresolved failure.

## JUDGE (LLM judge mode — quality-first; no --criteria flag)

For each surviving variant: `git diff main...hub/{session-id}/agent-{N}/attempt-1`.
Rank by this task type's rubric in `references/task-taxonomy.md` (Step 5 weights).
Tie-break: simpler diff (fewer lines). Record winner + per-criterion rationale.

## ADVERSARIAL (fail-closed gate)

Dispatch `engineering-skills:adversarial-reviewer` on the winner diff + the repo
invariants. Require it to justify each finding's severity using this rubric:

  CRITICAL = any of: repo-invariant violation; secret/env exposure; `pnpm check`
  would fail; data loss; auth/session bypass; currency math not via roundCurrency.
  MEDIUM/LOW = everything else.

- CRITICAL finding → blocker → unresolved failure.
- In UNATTENDED, any MEDIUM touching pricing/auth/session/middleware ESCALATES to a
  gate stop (conservative bias; no human to catch a misrating).
- If the reviewer fails, errors, times out, or returns no parseable verdict →
  treat as CRITICAL (FAIL-CLOSED). Never default to pass.
- Non-escalated MEDIUM/LOW → `_followup.md`.

## WRITE CEILING — INTERACTIVE MERGE (only after human approval)

    git checkout main
    git merge --no-ff hub/{session-id}/agent-{winner}/attempt-1 \
      -m "hub: merge agent-{winner} — <task slug>"
    # archive + delete each loser branch:
    git tag hub/archive/{session-id}/agent-{N} hub/{session-id}/agent-{N}/attempt-1
    git branch -D hub/{session-id}/agent-{N}/attempt-1
    python <agenthub-scripts>/session_manager.py --cleanup {session-id}   # worktrees only
    # do NOT call --state merged (rejected from 'init'; cosmetic).

## WRITE CEILING — UNATTENDED STOP (never merges)

    # winner branch hub/{session-id}/agent-{winner}/attempt-1 already holds the commit
    python <agenthub-scripts>/session_manager.py --cleanup {session-id}
    # DO NOT checkout main, merge, or push. terminal state = committed-to-branch.

## CLEANUP ON ABORT (then VERIFY per execution-modes.md)

    python <agenthub-scripts>/session_manager.py --cleanup {session-id}
    git status --porcelain      # expect only the run-log file
    git worktree list           # expect no hub/... worktree
    # residue or stuck worktree → terminal state aborted-DIRTY + notify "manual cleanup".
```

- [ ] **Step 2: Verify**

Run: `grep -E "hub_init.py|--base-branch main|base_branch: main|FAIL-CLOSED|timeout 1200|DISABLED_no_push|Do NOT call .--state merged|fewer than 2" .claude/plugins/orchestrator/skills/orchestrator/references/agenthub-contract.md`
Expected: ≥7 matches.
Run: `grep -nE "agenthub:init|agenthub:eval|--criteria \"|strip.*colon" .claude/plugins/orchestrator/skills/orchestrator/references/agenthub-contract.md`
Expected: no command-invocation matches (only the "v1 called" warning + "interior colons SAFE" wording).

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/agenthub-contract.md
git commit -m "feat(orchestrator): real agenthub 2.9.0 contract (state-safe merge, fail-closed gate, push-disable)"
```

---

### Task 3: Run-log format + committed directory + gitignore scratch

**Files:** Create `references/run-log-format.md`; create `_orchestrator-runs/.gitkeep`; modify root `.gitignore`.

**Interfaces:** Consumes terminal-state names (Task 1). Produces the record template + path `_orchestrator-runs/<YYYY-MM-DD>-<slug>.md` + slug rule (SKILL Step 6 consumes).

- [ ] **Step 1: Write `references/run-log-format.md`** with exactly this content:

```markdown
# Run-log format — orchestrator v2

> Every run (success OR abort) writes exactly ONE file. Append-only at the
> DIRECTORY level: never reopen a prior run's file (avoids merge conflicts under
> parallel/headless runs). AUDIT-ONLY: never read a run-log back into any agent
> prompt; it is not a routing input (no cross-run learning in v2).

## Location & naming

- Directory: `_orchestrator-runs/` at repo ROOT. COMMITTED (not gitignored).
- Filename: `<YYYY-MM-DD>-<slug>.md`.
- Slug rule: lowercase task; keep `[a-z0-9]`; collapse other runs to `-`; trim
  leading/trailing `-`; cap 50 chars. "Fix /api/checkout 500 on invalid promoCode"
  → `fix-api-checkout-500-on-invalid-promocode`.
- On date+slug collision, append `-2`, `-3`, … (never overwrite).

## Record template (fill every field)

    # Orchestrator run — <slug>

    > Run <YYYY-MM-DD HH:MM> · mode: <interactive|unattended> · base: main · terminal state: <merged|committed-to-branch|aborted|aborted-DIRTY>

    ## Task
    <verbatim task text>

    ## Classification
    - stack / domain / action / complexity: <…> (confidence: <high|med|low>)
    - depth: <1|2>
    - variant leads: <lead-A>, <lead-B>, <lead-C>

    ## Objective gate (pnpm check per variant)
    | variant | pnpm check | note |
    |---|---|---|
    | A | pass/fail/timeout | … |
    | B | pass/fail/timeout | … |
    | C | pass/fail/timeout | … |

    ## Judge
    - winner: <A|B|C>
    - rationale: <per-criterion summary>

    ## Adversarial verdict
    <pass | CRITICAL blocker: … | escalated MEDIUM: … | reviewer-error→fail-closed>

    ## Cost (post-hoc audit; NOT the backstop trigger)
    - agents dispatched: <n> / 12 · wall-clock: <m> min / 45 · output tokens (approx): <…>

    ## Terminal state
    <merged @ <sha> | committed-to-branch hub/<session>/agent-<X>/attempt-1 | aborted — <reason> | aborted-DIRTY — <reason> + manual cleanup>
```

- [ ] **Step 2: Create `_orchestrator-runs/.gitkeep`** with this single line:

```
# Orchestrator run logs (one committed file per run). Format: .claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md
```

- [ ] **Step 3: Append to the END of root `.gitignore`** (after the existing `.vercel` line):

```
# AgentHub orchestration scratch (session board, worktree coordination)
.agenthub/
```

- [ ] **Step 4: Verify**

Run: `git check-ignore .agenthub/x` → Expected: prints `.agenthub/x`.
Run: `git status --porcelain` → Expected: shows `_orchestrator-runs/.gitkeep` and `.gitignore`; `.agenthub/` does NOT appear.

- [ ] **Step 5: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md _orchestrator-runs/.gitkeep .gitignore
git commit -m "feat(orchestrator): committed run-log dir + format (audit-only); gitignore .agenthub"
```

---

### Task 4: SKILL.md — frontmatter, Step 0, and Step 1/Step 2 mode branches

**Files:** Modify `SKILL.md` — frontmatter (lines 1-12); insert `Step 0` before `## Step 1 — Classification`; add a confidence branch to Step 1; add a mode branch to Step 2.

**Interfaces:** Consumes mode names (Task 1). Produces the resolved `MODE`, a classification `confidence` value, and the §3 routing diamonds at their decision points.

- [ ] **Step 1: Replace the frontmatter** (lines 1-12) with:

```yaml
---
name: orchestrator
description: Use when the user asks to create, fix, refactor, or audit a feature, page, endpoint, component, or config in this monorepo and wants automatic team assembly with competitive variant selection via agenthub. Accepts a runtime mode (interactive | unattended); defaults to interactive. Do NOT use for single-character fixes, content-only edits, or tasks resolvable with one inline edit.
version: "2.0.0"
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
```

- [ ] **Step 2: Insert Step 0** immediately after the `---` separator that follows the flowchart and immediately before the `## Step 1 — Classification` heading. Insert this block, and ensure it is followed by its own `---` separator before Step 1:

```markdown
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
```

- [ ] **Step 3: Add a confidence branch to Step 1 — Classification.** After the classification YAML block, append:

```markdown
**Confidence.** Also emit a confidence level for the classification: `high` /
`med` / `low`. If you cannot confidently fix stack/domain/action/complexity →
confidence = low → **unresolved failure**: interactive asks the user; unattended
ABORTS + notifies (Steps 6–7). Record the confidence in the run-log.
```

- [ ] **Step 4: Add a mode branch to Step 2 — Depth selection.** Replace the existing "Regola dei costi" sentence that says *"Non attivare Depth-2 se il task è ambiguamente simple/complex — chiedi chiarimento o declassa a Depth-1 con adversarial pass."* with:

```markdown
**Regola dei costi**: Depth-2 ≈ 3-4× il costo di Depth-1. Se il task è
ambiguamente simple/complex:
- **interactive** → chiedi chiarimento all'utente.
- **unattended** → NON abortire: declassa a **Depth-1 + adversarial pass**
  (cost-safe default). Questo è l'unico trigger di failure che in unattended NON
  porta ad abort.
```

- [ ] **Step 5: Verify**

Run: `grep -E "version: \"2.0.0\"|modes: \[interactive, unattended\]|Step 0 — Resolve execution mode|confidence = low|Depth-1 \+ adversarial pass" .claude/plugins/orchestrator/skills/orchestrator/SKILL.md`
Expected: 5 matches.

- [ ] **Step 6: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/SKILL.md
git commit -m "feat(orchestrator): v2.0.0 frontmatter, Step 0 mode parse, confidence + depth mode branches"
```

---

### Task 5: SKILL.md — flowchart, Step 4–7, cost backstop, invariants

**Files:** Modify `SKILL.md` — the flowchart block, `## Step 4 — agenthub session`, `## Step 5`, the invariants section, the references list; add a cost-backstop subsection and Steps 6–7.

**Interfaces:** Consumes `MODE` (Task 4), the sequences in `agenthub-contract.md` (Task 2), run-log format (Task 3), execution-modes policy (Task 1). Produces the complete mode-aware runtime.

- [ ] **Step 1: Rewrite the flowchart block** (the fenced ``` flowchart near SKILL.md lines 28-59) to the real, mode-aware verbs. Replace the entire fenced block with:

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

- [ ] **Step 2: Replace `## Step 4 — agenthub session`** with:

```markdown
## Step 4 — agenthub session (real 2.9.0 contract)

Drive agenthub via the EXACT commands in `references/agenthub-contract.md`. Do
NOT use `--name` or `--criteria` (they don't exist). Do NOT call `--state merged`.

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
```

- [ ] **Step 3: Retitle the Step 5 criteria section.** Replace the heading + opening sentence of `## Step 5 — Judge criteria (per task type)` with:

```markdown
## Step 5 — Judge rubric (per task type — used in LLM judge mode, NOT a CLI flag)

These weighted criteria are the rubric applied when reading variant diffs in
Step 4's JUDGE step. There is no `--criteria` flag; this is prose for the judge.
Weights sum to 100.
```

(Leave the existing per-task-type weight rows unchanged.)

- [ ] **Step 4: Replace the invariants section** keeping the existing 8 numbered repo invariants, then appending:

```markdown
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
```

- [ ] **Step 5: Add Step 6 and Step 7** after Step 5:

```markdown
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
```

- [ ] **Step 6: Append the three new references** to `## Riferimenti`:

```markdown
- `references/execution-modes.md` — the interactive vs unattended mode axis
- `references/agenthub-contract.md` — the real agenthub 2.9.0 interface
- `references/run-log-format.md` — run-log location + record template
```

- [ ] **Step 7: Verify consistency**

Run: `grep -E "real 2.9.0 contract|OBJECTIVE GATE \(G3\)|FAIL-CLOSED|Step 6 — Write the run-log|Step 7 — Notify|G8 Secrets hygiene|G9 Project" .claude/plugins/orchestrator/skills/orchestrator/SKILL.md`
Expected: ≥7 matches.
Run: `grep -nE "agenthub:(init|run|eval|merge)|--criteria \"|--state merged" .claude/plugins/orchestrator/skills/orchestrator/SKILL.md`
Expected: NO matches (no fictional flag, no stale flowchart node, no rejected state call anywhere in the skill body).

- [ ] **Step 8: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/SKILL.md
git commit -m "feat(orchestrator): mode-aware flowchart + Step 4-7, fail-closed gate, G1-G9, cost backstop"
```

---

### Task 6: Bump plugin manifest version

**Files:** Modify `.claude/plugins/orchestrator/.claude-plugin/plugin.json`

- [ ] **Step 1: Find the version line**

Run: `grep -n "\"version\"" .claude/plugins/orchestrator/.claude-plugin/plugin.json`
Expected: shows the current `"version": "1.0.0"` line.

- [ ] **Step 2: Change the version value to `2.0.0`** (edit only the version string).

- [ ] **Step 3: Verify**

Run: `grep "\"version\": \"2.0.0\"" .claude/plugins/orchestrator/.claude-plugin/plugin.json`
Expected: 1 match.

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/orchestrator/.claude-plugin/plugin.json
git commit -m "chore(orchestrator): bump plugin manifest to 2.0.0"
```

---

### Task 7: Update the three templates — real contract, mode branch, git-isolation

**Files:** Modify the three `templates/agenthub-session-*.md`.

**Interfaces:** Consumes `agenthub-contract.md` sequences (Task 2), `MODE` (Task 4).

- [ ] **Step 1: Add `{{MODE}}` to each template's substitution legend.** Add:

```
- {{MODE}} — interactive | unattended (default interactive)
```

- [ ] **Step 2: Replace each `agenthub:init --name "…"` call** with the real form:

```bash
python <agenthub-scripts>/hub_init.py \
  --task "{{TASK}}" --agents 3 --base-branch main --format json
# Capture session_id; assert config base_branch: main (else ABORT).
# Task text: avoid embedded double-quotes and newlines. Interior colons are SAFE — do NOT strip them.
```

- [ ] **Step 3: Replace each `agenthub:eval --criteria "…"` block** with:

```bash
# JUDGE: LLM judge mode (no --criteria flag). Read each surviving variant's
#   git diff main...hub/{session_id}/agent-{N}/attempt-1
# rank by this task type's rubric (references/task-taxonomy.md); tie-break fewer lines.
```

- [ ] **Step 4: Replace each trailing `agenthub:merge --winner …` block** with the mode-branched ceiling:

```bash
# WRITE CEILING — depends on {{MODE}}:
# interactive: ask "merge variant <X> to main?" then run INTERACTIVE MERGE in
#   references/agenthub-contract.md (git merge --no-ff + archive/delete losers +
#   session_manager.py --cleanup). Do NOT call --state merged. Then atomic commit
#   per this task type's rule below.
# unattended: UNATTENDED STOP — session_manager.py --cleanup {session_id}; leave
#   hub/{session_id}/agent-<winner>/attempt-1 intact; STOP. Never merge/push.
# Both: write _orchestrator-runs/<date>-<slug>.md (Step 6) and notify (Step 7).
```

(Preserve each template's existing per-task-type commit guidance — e.g. fix-bug's "two commits if Variant C produced followups".)

- [ ] **Step 5: Add git-isolation forbidden actions** to each template's `== FORBIDDEN ==` / `== FORBIDDEN ACTIONS ==` block:

```
- Do NOT run git push, git merge, git checkout main, or gh pr merge. You have NO
  authority to integrate. Commit ONLY to your own hub/... branch.
- Do NOT write outside your worktree (no repo-root or absolute-path writes).
```

- [ ] **Step 6: Verify all three templates**

Run: `grep -L "hub_init.py --task" .claude/plugins/orchestrator/skills/orchestrator/templates/*.md`
Expected: NO output (all three contain the real init call).
Run: `grep -lE "agenthub:init.*--name|--criteria \"|--state merged" .claude/plugins/orchestrator/skills/orchestrator/templates/*.md`
Expected: NO output.
Run: `grep -L "Do NOT run git push" .claude/plugins/orchestrator/skills/orchestrator/templates/*.md`
Expected: NO output (all three forbid push/merge).
Run: `grep -L "{{MODE}}" .claude/plugins/orchestrator/skills/orchestrator/templates/*.md`
Expected: NO output.

- [ ] **Step 7: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/templates/
git commit -m "feat(orchestrator): templates use real contract, mode branch, git-isolation forbidden actions"
```

---

### Task 8: End-to-end rehearsals (integration test — unattended AND interactive)

**Goal:** prove the unattended path commits-to-branch-and-stops, the interactive merge sequence completes (catches the state-machine pitfall), and the abort path leaves main clean.

**Files:** No skill edits. Produces real run-log files (kept as first audit records) and `.agenthub/` scratch (ignored).

- [ ] **Step 1: Validate the agenthub install**

Run: `python ~/.claude/plugins/cache/claude-code-skills/agenthub/2.9.0/skills/agenthub/scripts/dry_run.py -v`
Expected: validator passes. If it fails, STOP and fix the install first.

- [ ] **Step 2: Rehearse the unattended happy path** on a trivial, safe task:

Invoke: `orchestrator: mode=unattended — add a one-line JSDoc comment above roundCurrency in apps/web-next/lib/pricing.ts`
Expected: Step 0 MODE=unattended → classify (simple, high confidence) → Depth-1 → `hub_init.py --task … --base-branch main` → base_branch asserted main → 3 worktree agents (push disabled) → `pnpm check` per worktree → LLM judge → adversarial (fail-closed) → **UNATTENDED STOP** (no merge).

- [ ] **Step 3: Assert the unattended write ceiling held**

Run: `git rev-parse main` before and after → Expected: identical (main untouched).
Run: `git branch --list "hub/*/agent-*/attempt-1"` → Expected: the winning branch exists with the committed change.
Run: `git worktree list` → Expected: no `hub/...` worktree remains.
Run: `git check-ignore .agenthub` → Expected: `.agenthub`.

- [ ] **Step 4: Assert run-log + notification**

Run: `ls _orchestrator-runs/` → Expected: a `<today>-add-a-one-line-jsdoc-*.md` file.
Run: `grep -E "terminal state: committed-to-branch|mode: unattended" _orchestrator-runs/*.md` → Expected: matches.
Confirm a `PushNotification` was attempted (or "not sent").

- [ ] **Step 5: Rehearse the INTERACTIVE merge path** (catches the `--state merged` pitfall) on a trivial task:

Invoke: `orchestrator: mode=interactive — add a one-line JSDoc comment above formatPrice (or any safe trivial target)`
At the merge prompt, approve. Expected: the INTERACTIVE MERGE git sequence runs to completion with NO `session_manager.py --state merged` call, no hard error; main gains one `--no-ff` merge commit.
Run: `git log --oneline -1 main` → Expected: the new merge commit is present.

- [ ] **Step 6: Rehearse the abort path**

Invoke: `orchestrator: mode=unattended — make the app better`
Expected: confidence=low → unattended ABORT (no init or clean abort), run-log `terminal state: aborted`.
Run: `git status --porcelain` → Expected: clean except the run-log file.
Run: `grep "terminal state: aborted" _orchestrator-runs/*.md` → Expected: the abort record with a reason.

- [ ] **Step 7: Commit the rehearsal run-logs**

```bash
git add _orchestrator-runs/
git commit -m "test(orchestrator): rehearsal run-logs (unattended stop, interactive merge, abort)"
```

- [ ] **Step 8: Clean up rehearsal hub branches** (portable; Git Bash on Windows)

```bash
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/hub); do git branch -D "$b"; done
```

(Leave the `main` merge commit from Step 5 — or `git reset --hard HEAD~1` on `feat/orchestrator-v2-phase1`'s view of main if you want a pristine rehearsal; decide at execution time.)

---

## Self-Review

**1. Spec coverage** (against the design spec; rev-2 closes the rev-1 gaps):

| Spec requirement | Task |
|---|---|
| R1 explicit mode param, fail-safe default | Task 4 (Step 0) |
| R2 mode flips 3 switches | Task 1 + Task 5 (Step 1 flowchart, Step 2) |
| R3 unattended commit-to-branch, stop | Task 2 (UNATTENDED STOP) + Task 5 |
| R4 unattended never blocks (+ timeouts) | Task 1 + Task 2 (timeouts) + Task 4 (Step 0) |
| R5 append-only, audit-only run log | Task 3 + Task 5 (Step 5–6) |
| R6 dual notify | Task 1 + Task 5 (Step 7) |
| R7/§5 cost backstop (concrete, enforceable) | Task 1 (constants) + Task 5 (G6, boundary checks) |
| R8 hard objective gate (+ timeout) | Task 2 (OBJECTIVE GATE) + Task 5 (G3) |
| §3 routing diamonds (confidence, depth) | Task 4 (Step 3–4) + Task 5 (flowchart) |
| §6 run-log not visible to agents | Task 1 + Task 3 + Task 5 (G7) |
| G1 no push/merge (structural) | Task 2 (push-disable) + Task 7 (forbidden) + Task 5 (G1) |
| G4 adversarial fail-closed (+ rubric) | Task 2 (ADVERSARIAL) + Task 5 (G4) |
| G5 abort clean + verified | Task 1 + Task 2 (CLEANUP) + Task 5 (G5) |
| G8 secrets hygiene | Global Constraints + Task 5 (G8) |
| G9 agents-are-templates | Global Constraints + Task 5 (G9) |
| agenthub contract (incl. state-machine) | Task 2 + Task 7 |
| Eval harness (R9) | OUT OF SCOPE — Phase 2 |

No Phase-1 spec requirement is unmapped.

**2. Placeholder scan:** `<agenthub-scripts>` and `{{MODE}}`/`{{TASK}}` are deliberate, defined tokens. No "TBD / handle edge cases / write tests for the above".

**3. Type/name consistency:** mode keywords, terminal states (incl. `aborted-DIRTY`), branch pattern `hub/{session-id}/agent-{N}/attempt-1`, run-log path, and the cost constants `RUN_AGENT_CEILING`=12 / `RUN_WALLCLOCK_MINUTES`=45 are used identically across Tasks 0–8. No `--state merged` survives anywhere.

## Open risks (carry into review)

1. **Cost backstop ≠ token ceiling.** The spec (§5/§10) phrases it as a *token* ceiling. A prose skill in the main loop cannot live-meter parallel subagent tokens, so this plan realizes it as an enforceable **agent-count (12) + wall-clock (45 min)** backstop, with token cost recorded post-hoc. If the operator wants a true token ceiling, the orchestration must move into a Workflow (which exposes `budget.spent()`) — a Phase-2/3 consideration. **Flagged for the spec.**
2. **Worktree push-disable assumes the harness exposes each worktree path** to `git -C`. Confirm in Task 8 Step 2 that worktrees are real on-disk paths reachable via `git worktree list --porcelain`.
3. **Windows/NTFS worktree removal** can fail under file locks (CLAUDE.md gotcha #9) → that is exactly what the `aborted-DIRTY` path + verification exists to catch.
4. **Interactive merge auto vs approval** — plan assumes human approval (spec default). Unchanged.

## Execution Handoff

(Filled in after user review.)
