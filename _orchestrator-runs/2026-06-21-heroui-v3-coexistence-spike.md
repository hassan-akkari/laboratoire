# Orchestrator run — heroui-v3-coexistence-spike

> Run 2026-06-21 16:04 · mode: interactive · base: feat/heroui-universal-ui-system (NOT main — live-site invariant: docs deploys only from main; migration work stays off main until P7) · terminal state: merged

## Task
HeroUI v3 incremental coexistence spike in packages/ui: add @heroui-v3 pnpm aliases (Strategy A), migrate AppButton and AppCard wrappers to v3 internals while preserving their public App* API so docs and web-react pnpm check stays green. First slice of the larger v2→v3 migration (see _handover-heroui-v3-vite8-migration.md).

## Classification
- stack / domain / action / complexity: ui-lib (cross-touching docs via API contract) / frontend / refactor-migrate / complex (confidence: high — premises fact-checked against npm + HeroUI migration docs before spawning)
- depth: 2 (mini-team-led variants — user-selected over the recommended Depth-1 spike)
- variant leads: A "minimal-footprint", B "foundation-first", C "type-safe/test-first"

## ENTP pre-flight (Step 1.5 — advisory)
- entp_preflight: ran
- verdict: SPLIT + DESCOPE-the-vehicle — Full Migration (handover's locked choice) is incompatible with the orchestrator's non-overridable pnpm-check gate (G3); migrate Incrementally; run the orchestrator only on genuine-design-freedom tasks; split into 3 independent trains (v3-lib / Vite-8 / web-next); start with an AppButton+AppCard spike.
- reframings surfaced: 3 (Incremental-over-Full; surgical-over-uniform orchestration; 3-trains-over-coupled) + better-target (the spike). Human chose: PROCEED with all four reframes (Incremental / Surgical / 3 trains / AppButton+AppCard spike).
- Fact corrections made during pre-flight: handover version facts CORRECT (v3 3.2.1 is stable latest, @heroui/styles real, @heroui/theme dropped, vite 8.0.16); the connected heroui MCP's "v3 BETA / migration unsupported" banner is STALE (its own get_docs enum serves a full migration tree); HeroUI officially supports BOTH Full and Incremental ("cannot coexist WITHOUT special setup") — handover had truncated this to "cannot coexist".

## Objective gate (pnpm check per variant)
| variant | pnpm check | note |
|---|---|---|
| A (agent-1) | DISQUALIFIED | Agent worktree based off `main` (75e13bc1), not `feat`. main lacks the 22-wrapper inventory → branch had 6/42 wrapper files, 0/17 AppNavbar barrel exports. pnpm check passed IN-WORKTREE but against the wrong (near-empty) baseline; merging would regress the barrel. |
| B (agent-2) | PASS (forced 12/12) | Correctly based on `feat` @ 7cc000bb (recovered onto it after a mid-run git accident). Independently re-verified: `turbo run lint typecheck test --force` = 12/12 tasks, 0 cached, exit 0; 48 UI tests + 16 docs + (full suite incl. web-next 108) green. Full barrel intact (17/17 AppNavbar). tokens.ts untouched (CSS byte-equivalence guards pass). |
| C (agent-3) | DISQUALIFIED | Same root cause as A: worktree based off `main`. 6/42 wrapper files, 0/17 AppNavbar exports. Strong work, wrong baseline. |

Root cause of A/C disqualification: the generic Agent `isolation:"worktree"` tool created worktrees off the repo's default branch `main`, NOT the checked-out `feat`. Only B landed on the correct base, and only because it self-corrected after a git mishap. → fewer than 2 VALID competitors = an unresolved-failure condition (no real competition). Surfaced to the human (interactive); human chose to salvage the one verified-valid variant (B) rather than re-run (re-running 2 Depth-2 variants ≈20 min each would have breached the 45-min wall-clock backstop, then at ~29/45 elapsed).

## Judge
- winner: B (agent-2) — the only validly-based, gate-passing variant; selection was integrity-forced, not a 3-way quality comparison.
- rationale: vs the refactor rubric — convention adherence (PASS: preserved App* public API + Object.assign/TS2742 compound pattern, zero app-file edits), type-safety gain (hand-written anti-corruption interfaces + typed v2→v3 variant map), diff minimality (11 files, scoped to packages/ui + lockfile), test retention (full UI+docs suites green, incl. CSS-sync guards), reversibility (atomic single commit, additive lockfile, v2 coexistence intact). B additionally paid down future cost with a reusable oklch v3 token foundation (warmThemeV3.{css,ts}) + a documented 20-wrapper extension pattern.

## Adversarial verdict
MEDIUM/LOW-only — no CRITICAL. Independent adversarial-reviewer agent verified all 8 repo invariants + every spike-contract bullet PASS via fresh non-cached runs. Findings → _followup.md: F1 (MEDIUM, PRE-DEPLOY GATE: v3 styles not yet imported in apps/docs/src/index.css → ~60 live buttons would render unstyled if docs deploys off this branch; pnpm check cannot catch it; documented out-of-slice punt, feat is not a deploy target), F2 (MEDIUM: pin v3 off @latest → 3.2.1), F3/F4/F5 (LOW: anchor-branch disabled/loading hardening; narrowed public prop types; onClick PressEvent cast). No pricing/auth/session/middleware MEDIUM (no unattended escalation; this is interactive regardless).

## Cost (post-hoc audit; NOT the backstop trigger)
- agents dispatched: ~7 / 12 (3 variant leads + ~3 lead-spawned sub-specialists + 1 adversarial reviewer) · wall-clock: ~40 min / 45 (competition phases finished ~29 min; finalization after the post-adversarial boundary) · output tokens (approx, subagents): A 145k + B 195k + C 156k + adversarial 110k ≈ 606k + main-loop overhead.

## Terminal state
merged @ 6885a7a9 (into feat/heroui-universal-ui-system via --no-ff of hub/20260621-160400/agent-2/attempt-1). main untouched. Loser branches A/C deleted; all three attempts tagged hub/archive/20260621-160400/agent-{1,2,3} for forensics. Worktrees removed (git worktree list clean; one transient Windows/NTFS lock on 2 dirs — gotcha #9 — cleared on retry). Final canonical `pnpm check` on merged feat = exit 0. frozen-lockfile install = exit 0.

## Process deviations from the orchestrator contract (for audit)
1. base-branch = feat (not the contract's hardcoded `main`) — deliberate, per the live-site invariant; asserted as feat after INIT.
2. Structural push-disable (G1) could not be injected between worktree-creation and agent-action with the generic Agent tool (agenthub does not manage these worktrees); relied on explicit prompt-level push/merge prohibition + post-hoc verification (no branch reached a remote). 
3. Worktree base bug (above) is the key finding to fix before the next phase: force each variant to `git checkout -B <hub-branch> feat/heroui-universal-ui-system` (or reset --hard onto feat) as its first action, since the Agent worktree tool defaults to `main`.
