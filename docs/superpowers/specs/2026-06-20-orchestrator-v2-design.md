# Orchestrator v2 — Design Spec

> Date: 2026-06-20 · Author: Hassan Akkari · Status: approved design, pre-implementation
> Evolves: `.claude/plugins/orchestrator/skills/orchestrator` (v1.0.0)

**v2 is v1's orchestration spine plus a mode axis: interactive vs unattended; unattended is quality-first, commit-to-branch only, aborts on unresolved failure, and records every run in an append-only audit log.**

---

## 1. Scope & intent

v2 is an **evolution of v1, not a rewrite**. The v1 spine is kept verbatim:

```
classify (stack × domain × action × complexity)
  → depth-select (1 lone specialists | 2 mini-teams)
  → agenthub competition in isolated git worktrees
  → LLM judge
  → adversarial pass
  → merge
```

v2 adds a single new orthogonal concept — **execution mode** — plus the runtime and audit machinery a mode-aware orchestrator needs. Task source, classification axes, depth heuristics, specialist roster, and judge criteria are **unchanged** from v1's `references/task-taxonomy.md` and `references/specialist-roster.md`.

**Optimization target:** quality of output. Cost is a *backstop ceiling*, not the optimization variable — v2 may spend Depth-2's ~9× token cost when the task warrants it, bounded only by the hard ceiling in §5.

### Non-goals (v2)

- No new specialist agent types.
- No new task source (no queue/tracker/cron catalog). You hand it a task; mode decides whether you watch.
- No cross-run learning memory.
- No judge panel (single judge retained — see §8).

---

## 2. The mode axis

`mode ∈ { interactive, unattended }`. **Default: `interactive`** (fail-safe). Mode is an explicit parameter resolved before classification; it never auto-infers to `unattended`.

Mode flips exactly three switches. Everything else is shared between modes — this is what keeps v2 maintainable.

| Switch | `interactive` | `unattended` |
| --- | --- | --- |
| Human gates | present (ask on ambiguity, approve merge) | **none** — any "ask human" path becomes abort (§4) |
| Write ceiling | merge to `main` **after human approval** | **commit to feature branch, STOP** — never push, never merge |
| On unresolved failure | surface to human, wait | **abort clean + notify** (§4) |
| Task source | you hand it | you hand it (identical) |

---

## 3. Routing model

```
INPUT: task + mode (default interactive)
  │
  ├─[mode resolution] ── unattended? set fail-safe flags (no-block, write-ceiling=branch)
  │
  ├─[out-of-scope guard] ──YES──> route to AGENTS.md handler or inline; do not start competition
  │
  ├─[CLASSIFY] stack × domain × action × complexity → structured output + confidence
  │     └─ low confidence?   interactive → ask · unattended → ABORT + notify
  │
  ├─[DEPTH] simple → Depth-1 (3 lone) · complex → Depth-2 (3 mini-teams)
  │     └─ ambiguous?        interactive → ask · unattended → Depth-1 + adversarial (cost-safe)
  │
  ├─[ASSEMBLE] team from task-taxonomy leaf · inject invariants + forbidden_actions
  │
  ├─[COMPETE] agenthub init / spawn / run  (parallel, budget-capped — §5)
  │
  ├─[OBJECTIVE GATE] pnpm check per variant — fail = disqualified
  │     └─ all variants fail? → ABORT + notify (both modes; nothing mergeable)
  │
  ├─[JUDGE] eval surviving variants by task-type criteria (diffs blind to lead identity)
  │
  ├─[ADVERSARIAL] refute winner → blocker found?  interactive → surface · unattended → ABORT + notify
  │
  └─[WRITE CEILING]
        interactive  → human approves → merge to main
        unattended   → commit to branch, STOP → notify
        always       → write run-log record (§6)
```

Mode changes **only** the diamonds (ask vs abort) and the final write ceiling. The spine is identical in both modes.

---

## 4. Failure & recovery

- **Unattended never blocks.** Every path that would prompt a human in interactive mode — low classification confidence, ambiguous depth that can't be cost-safely defaulted, adversarial blocker, all variants failing the objective gate — resolves in unattended mode to **abort clean + notify**. No fallback ladder, no best-effort commit.
- **Abort is clean.** Worktrees are isolated, so abort = do not merge + clean up worktrees. Repo and `main` are left untouched. No disk leak from orphaned worktrees.
- **Notification fires on every terminal state** (success, abort), via both channels (§7).

---

## 5. Cost backstop

Quality is the optimizer, but unattended runs need a hard ceiling so a runaway competition can't burn unbounded tokens.

- A **generous but finite token ceiling** governs a single orchestrator run (competition + judge + adversarial).
- The ceiling is a **hard backstop, not a budget optimizer** — the orchestrator does not scale depth down to save cost; it scales depth by complexity (§3) and only aborts if the ceiling is breached.
- On breach: **abort + notify**, same as any unresolved failure.
- Default value: documented in the skill as a constant, generous enough that no legitimate Depth-2 run hits it, low enough to catch a loop. Tune from real run-log data.

---

## 6. Run log (audit only)

- **One append-only record per run**, written on every terminal state.
- Captured fields: timestamp, task text, mode, classification (+ confidence), depth, variant leads, objective-gate results per variant, judge winner + rationale, adversarial verdict, token cost, terminal state (merged / committed-to-branch / aborted + reason).
- **Append-only. Never rewritten.** For debugging and audit — **not** an input to routing decisions (no learning in v2).
- Not visible to variant/judge/adversarial agents.

---

## 7. Notification

Dual channel on terminal state:

- **Report file** (source of truth) — structured run record written to the repo (e.g. `_orchestrator-runs/<date>-<slug>.md`). Version-controlled, greppable, no external dependency. Authoritative because it survives headless contexts.
- **Push** (best-effort) — Claude Code `PushNotification` for the live "run finished / aborted, come look" ping. May be unavailable in headless/cron contexts; degrades gracefully — its failure never fails the run, and the file record remains complete.

---

## 8. Guardrails

**v1 repo invariants — all retained, injected into every variant prompt:**

1. `pnpm check` (lint + typecheck + test) must pass.
2. Atomic commit: one task = one commit; scope creep → `_followup.md`.
3. Framework separation: `web-next` no Redux; `docs`/`web-react` no Server Actions.
4. No manual `pnpm-lock.yaml` edits; dep changes → regenerate lock in the same commit.
5. `packages/ui` never imports from `apps/*`.
6. i18n: never edit one locale without the other two.
7. Currency math always via `roundCurrency()` in `lib/pricing.ts`.
8. `orders.ts`/`session.ts` `MVP-ONLY` guards not removed without explicit approval.

**New in v2:**

- **G1 — Unattended never `push`/`merge`/`gh pr merge`.** Enforced at the write-ceiling step, not trusted to prompts.
- **G2 — Mode fail-safe.** Default `interactive` when unspecified; unattended treats every "ask human" as abort.
- **G3 — Objective gate is hard.** `pnpm check` must pass before any merge or winner selection. No override.
- **G4 — Adversarial pass is a gate, not advice.** A blocker stops the run (abort in unattended; surface in interactive). Promotion from v1's advisory pass.
- **G5 — Clean abort.** No partial writes to `main`; worktrees cleaned up.
- **G6 — Cost backstop** (§5) aborts a runaway competition.
- **G7 — Run log append-only** (§6).
- **G8 — Threat model: trusted operator.** Tasks come from the operator (you), so injection risk is low. The real risk is agents touching secrets or writing out of bounds — covered by `forbidden_actions` + the write ceiling. Secrets/env are never placed in prompts.

---

## 9. Context model

| Scope | Lives where | Visible to |
| --- | --- | --- |
| Global / static | `CLAUDE.md` extract (stack, relevant gotchas, conventions, invariants) | Injected into every variant prompt |
| Per-run | task, classification, criteria, mode | Orchestrator; relevant slices into each agent |
| Per-variant | own worktree branch + role/perspective | That variant only — **never cross-variant** |
| Persisted | run-log record (append-only) | Orchestrator + human; **not** agents |
| Ephemeral | variant scratch, agenthub board | Discarded after merge/abort |
| Hidden always | secrets/env, other variants' diffs (pre-judge), orchestrator internal reasoning | Walled off |

The judge receives diffs **blind to which lead produced which** (anti-bias). Token concern: Depth-2 = up to 9 deep agents, governed by the §5 ceiling + agenthub's parallel cap.

---

## 10. Decided defaults (this spec)

| Question | Default chosen | Rationale |
| --- | --- | --- |
| Interactive merge | **Human approves the merge.** | Matches v1; keeps the irreversible step human-owned. |
| Cost ceiling | **Generous but finite, hard backstop** (§5). | Catches runaway loops without throttling legitimate quality. |
| Judge | **Single judge retained for v2.** | No evidence yet of unreliability; panel deferred until run-log data shows a problem. |

---

## 11. Build scope (phased)

- **Phase 1 — minimal runtime hardening (must-ship v2):** mode axis (§2), routing diamonds (§3), unattended write ceiling (§2/G1), fail-safe abort (§4/G2), cost backstop (§5/G6), hard objective gate (G3), adversarial-as-gate (G4), run log (§6), dual notification (§7).
- **Phase 2 — quality protection (NOT part of minimal runtime):** eval harness — 3–5 golden tasks drawn from the taxonomy, snapshotting expected classification + team + judge-rationale shape; extract the routing table and judge criteria into versioned reference blocks so changes are diffable and testable.
- **Phase 3 — deferred (YAGNI until 1+2 prove out):** judge panel, cross-run learning memory, queue/tracker task source.

---

## 12. Open items before/within implementation

1. **Unattended trigger mechanism** — cron / `/loop` / fire-and-forget not yet chosen. Phase 1 designs the hook; the trigger itself is out of scope.
2. **Golden-task seed set** — which 3–5 real tasks become Phase 2 fixtures. Needed before Phase 2 starts; does not block Phase 1.
3. **`PushNotification` availability** in headless context — confirmed best-effort only; file record authoritative (§7).
4. **AGENTS.md / CAPABILITIES.md** — out-of-scope handler names (`deploy-warden`, `ui-component-author`, `portfolio-content-curator`, `claude-md-management`) referenced by v1; verify they still exist before relying on them in routing.

---

## 13. Architecture risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Unattended judge picks a confidently-wrong winner, no human catch | High | Adversarial pass as hard gate (G4) + hard objective gate (G3) |
| Runaway cost in quality-first unattended loop | High | Cost backstop ceiling (§5) + Depth-1 fallback on ambiguity |
| Notification silently fails headless → aborted run invisible | Medium | File record authoritative (§7); push best-effort |
| Mode misresolution (unattended blocks forever, or interactive auto-writes) | Medium | Explicit mode param (§2) + fail-safe abort (G2) |
| Classification error cascades into wrong team / wasted competition | Medium | Structured classification + confidence; low confidence → ask/abort |
| Eval fixtures rot vs. live repo | Low–Medium | Pin and version fixtures (Phase 2) |
