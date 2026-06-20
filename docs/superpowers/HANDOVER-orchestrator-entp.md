# Handover — Orchestrator v2 + ENTP skill (2026-06-20)

> Read this first in a fresh chat. Self-contained resume point. The memory file `project_orchestrator_v2.md` auto-loads and mirrors this.

## The arc (what we've been doing)

Designing + building an evolution of the existing `orchestrator` skill, then a personal `entp` skill. Three workstreams, in order:
1. **Orchestrator v2** — added an `interactive | unattended` mode axis. **DONE, merged to local main.**
2. **Roster assessment + fixes** — audited the specialist roster, fixed P0/P1. **DONE, merged to local main.**
3. **ENTP skill** — a broad personal strategic-adversarial-intelligence skill. **SPEC APPROVED, NOT BUILT YET.** ← resume here.

## Git state

- **`main`** (local) = HEAD after both merged workstreams. **17 commits ahead of `origin/main`, NOT pushed** (pushing triggers a no-op Vercel redeploy of apps/docs — user's call when to push).
- **`feat/entp-skill`** = current branch. Holds the ENTP spec (+ this handover). Branched off main. The ENTP implementation will land here.
- Redundant/cleanup: `docs/orchestrator-v2-spec` is fully contained in main (safe to delete). `feat/orchestrator-v2-phase1` and `fix/orchestrator-roster` already merged + deleted.
- Convention: branch off `main`; commit when done; local merges only (no push without user say-so). Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## IMMEDIATE NEXT STEP

The ENTP spec is **approved** (user approved as-is + one wording tighten already applied). Next action: **invoke `superpowers:writing-plans`** to draft the implementation plan for the ENTP skill.

- Spec: `docs/superpowers/specs/2026-06-20-entp-skill-design.md` (on `feat/entp-skill`).
- The plan spans TWO locations: (a) the global skill `~/.claude/skills/entp/SKILL.md` (+ optional `references/`) — OUTSIDE laboratoire git; (b) orchestrator integration edits in `.claude/plugins/orchestrator/skills/orchestrator/` (SKILL.md Step 1.5, specialist-roster.md ENTP row, run-log-format.md `entp_preflight` field, execution-modes.md advisory note) — in laboratoire git on `feat/entp-skill`.

## ENTP — locked decisions (do NOT re-litigate)

- **ONE broad skill `entp`**, global at `~/.claude/skills/entp/` (like `ui-ux-pro-max`). Cross-project. Orchestrator Step 1.5 calls it via a documented **pre-flight mode** invocation — NOT a second `entp-strategist` artifact.
- **Voice:** ENTP-flavored but disciplined (debater's instinct, structured delivery — not caricature).
- **5 modes:** analyze / challenge / counter / research (just-in-time best-practice lookup) / decide.
- **Output:** structured strategist set (reframings · risky assumptions · scope verdict `as-framed|descope|expand|split|don't-build` · optional better-target), **adaptive by stakes** (+pre-mortem high-stakes; "no meaningful reframing — proceed" on trivial).
- **Prompt format:** explicit XML sections (`<role><context><artifact><modes><instructions><boundaries><output_format>`).
- **Guardrails:** no fake contrarianism · always close with a verdict+next-move · NO authority escalation (can recommend don't-build, cannot block/abort/merge/downgrade gates) · no solution deep-dive unless asked standalone · minimal context.
- **Pre-flight mode (orchestrator Step 1.5):** no code, no diffs, no run logs; advisory only; framing/risk/scope only. Gate: `complexity=complex OR confidence≠high OR --challenge OR strategy/planning/architecture/tradeoff task`. Mode contract: interactive surfaces reframings (human picks proceed/reframe/abort); unattended advisory-only → `entp_preflight` run-log field, NEVER blocks (G2). If ENTP errors in unattended → log + proceed (opposite of adversarial's fail-closed).
- **3-role model (keep distinct):** ENTP (task, pre-code, divergent, advisory) ≠ `adversarial-reviewer` (winning diff, post-code, convergent, fail-closed) ≠ judge (ranks variants).
- Standalone ENTP CAN see code; orchestrator pre-flight does NOT give it code.

## Orchestrator v2 — what shipped (in main)

Mode axis on the classify→compete(agenthub)→judge→adversarial→merge spine. `interactive` = human approves merge; `unattended` = commit-to-branch only, never push/merge, abort-clean+notify on unresolved failure, append-only committed run-log, dual notify (file + PushNotification). Skill is markdown-only at `.claude/plugins/orchestrator/skills/orchestrator/` (v2.0.1). Spec: `docs/superpowers/specs/2026-06-20-orchestrator-v2-design.md`. Plan: `docs/superpowers/plans/2026-06-20-orchestrator-v2-phase1.md`.

## CRITICAL gotchas (verified)

- **agenthub real contract (2.9.0):** `hub_init.py --task` (required, NO `--name`); LLM `--judge` (NO `--criteria` flag); merge via `git merge --no-ff hub/{session}/agent-{N}/attempt-1`; `--base-branch` defaults to CURRENT branch → ALWAYS pass `--base-branch main` + assert; session state machine rejects `--state merged` from `init` (don't call it); eval has hard 120s timeout (run `pnpm check` directly, not through the ranker). Real contract doc: orchestrator `references/agenthub-contract.md`.
- **Windows + agenthub:** the agenthub Python scripts crash under cp1252 → ALWAYS invoke with `PYTHONIOENCODING=utf-8`. `dry_run.py` is additionally broken on Windows (treat its failure as a tool bug).
- **Project "agents"** in `.claude/AGENTS.md` are PROMPT TEMPLATES, not `subagent_type`s — invoke as `Agent(subagent_type=<host type>, prompt=<mandate>)`. `claude-md-management:revise-claude-md` does NOT exist here.
- **Roster:** `product-skills:*` plugin does NOT exist (was a dead ref, fixed → `ui-ux-pro-max`).

## Open / deferred (not blocking ENTP)

- **P2 roster coverage gaps:** no roster owner for i18n tri-locale / RTK-Query+MSW / Tailwind token-drift / pricing+a11y.
- **CAPABILITIES.md doc-rot:** `pr-review-toolkit:*`, `claude-md-management:*`, `firecrawl:firecrawl`, `tech-debt-tracker` (wrong ns), `code-review` (miscategorized). See `docs/superpowers/assessments/2026-06-20-orchestrator-roster-assessment.md`.
- **Push `main`** to origin (17 commits) — user's call.
- **Full live rehearsal** of orchestrator unattended (spawns real competition + a main merge) — user wants to watch it; not yet run.
- Delete redundant `docs/orchestrator-v2-spec` branch.

## Session conventions in play

- **caveman mode** active (terse responses; code/commits/security written normally).
- **jiraiya** skill in use — user likes explanations closed with anime analogies, **Naruto/Itachi** especially.
- **ultracode** on — use the Workflow tool for substantive tasks (parallel research + adversarial review have been the pattern; e.g. recon fan-out, then a critic pass).
