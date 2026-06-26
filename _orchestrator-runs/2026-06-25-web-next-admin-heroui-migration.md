# Orchestrator run — web-next admin surface → HeroUI App* wrappers

- **Date:** 2026-06-25 (start 14:41:56Z, run within wall-clock backstop)
- **Mode:** interactive
- **Session id:** `20260625-164205`
- **Base branch (config):** `main` (asserted ✓) — but the WORKING base was the feature
  branch `feat/heroui-universal-ui-system` (f8b9930); variants merged it in STEP ZERO.
- **Terminal state:** **merged** (winner cherry-picked into `feat/heroui-universal-ui-system`)

## Task

Migrate the `apps/web-next` admin surface (9 `.tsx`, ~928 LOC) from plain-CSS classes
to the shared `@laboratoire/ui` HeroUI `App*` wrappers; adopt AppTable for the leads
dashboard and AppChip for status pills (left to variant strategy); preserve server
actions + auth. UI swap only.

## Classification

```yaml
stack:      next
domain:     frontend
action:     refactor
complexity: complex      # 9 files, multi-page, AppTable/AppChip decisions, server-action forms
confidence: high
```

Out-of-scope check: no — genuine multi-file refactor with a real design fork.

## ENTP pre-flight

Gate triggered (complex). Surfaced inline to the operator BEFORE spawning rather than via
the entp skill: flagged that the migration pattern was already locked by the 7 funnel pages,
so the solution space was narrow and a competition was lower-ROI than usual. Operator chose
**Full Depth-2 competition** explicitly. Recorded; proceeded.

## Depth / structure

- **Depth:** operator-selected "Full Depth-2 competition". Realized as **3 strong single-agent
  variants** (one capable agent per distinct strategy) rather than mini-teams with nested
  sub-agents — DEVIATION from Depth-2's literal mini-team structure. Rationale: the task is
  mechanical (9 files, locked pattern); the competition value is in the 3 *distinct strategies*
  (maximal / parity / type-safe), not in per-variant sub-teams. Nested Agent spawns inside
  worktree isolation are also fragile. Logged as a conscious deviation.
- **Agents dispatched:** 3 (within `RUN_AGENT_CEILING`=12; +1 adversarial reviewer = 4 total).

## Variants

| Variant | Lead strategy | Table decision | Status-pill decision | Branch (pre-cleanup) | SHA |
|---|---|---|---|---|---|
| A | maximal adoption | **AppTable** compound | **AppChip** semantic color-map | worktree-agent-a028c1e95af3994eb | 0706358 |
| B | parity / minimal-risk | keep native `<table>` | keep `.tag--*` spans | worktree-agent-a5c7623ee5a1c5f50 | 155eb0a |
| C | type-safety / correctness | keep native `<table>` | keep `.tag--*` spans | worktree-agent-a2f8ba4b4437287ac | 97cae2e |

All three left `(authed)/layout.tsx` (auth gate + shell) and `(authed)/arsenale/page.tsx`
(self-contained static HTML) untouched — correct. 7 of 9 files changed by each.

## Objective gate (G3 — `pnpm check`, per branch)

Worktrees have no `node_modules` (node-linker=hoisted; deps in root only), so the harness
worktrees could not run `pnpm check`. Gate was run in the MAIN checkout on temp branches
`gate-A/B/C` created from each variant SHA, after `pnpm -F @laboratoire/ui build`.

| Variant | `pnpm check` | Result |
|---|---|---|
| A (0706358) | 4/4 tasks pass (incl. AppTable adoption) | **PASS** |
| B (155eb0a) | 4/4 tasks pass | **PASS** |
| C (97cae2e) | 4/4 tasks pass | **PASS** |

All three qualified.

## Judge (refactor rubric: convention 30 / type-safety 25 / diff-minimality 20 / test-retention 15 / reversibility 10; secondary: no scope creep)

Judged on actual diffs (`git diff f8b9930..<sha>`), not self-reports.

- Diffstat: A +305/-198 · **B +86/-70** · C +98/-95.
- A: bold, well-typed (`tagColor()` map), but the AppTable rewrite drops the hand-tuned
  `.admin-table`/`.lead-row` CSS (first in-app AppTable use, no visual test) and the AppChip
  map collapses `new`(blue)+`cal`(purple) onto `accent` — a real visual regression on the
  internal admin tool. Scope creep: stat-cards→AppCard (justified by its strategy).
- B vs C are near-twins (both keep native table + `.tag`). B wins the tiebreak: import order
  follows CLAUDE.md convention (`react → 3rd-party → @laboratoire/ui → relative`), keeps the
  rationale comments, and has ZERO scope creep. C deviated on import order and made two
  `aria-label` content edits (minor scope creep beyond a pure UI swap).

**Winner: Variant B** — best convention adherence, smallest + most reversible diff, zero
scope creep, zero visual regression. (A's maximal adoption deferred; the wrappers can be
pushed further later if desired — captured as a possible follow-up.)

## Adversarial pass (G4, fail-closed) — reviewer: `feature-dev:code-reviewer`

Reviewed B's full diff against the 6 invariants. Verified: auth gate `requireAdminSession()`
untouched (layout.tsx byte-identical); `saveLead`/`saveConfig`/login-fetch contracts and all
`name=` fields preserved; `<select>` kept native in both forms; `"use client"` boundaries
intact; no `packages/ui`/lockfile/package.json/CI edits; no deps; no secrets.

- **CRITICAL: none.**
- **MEDIUM:** `<Link>` → `AppButton as="a"` swaps Next client-nav (prefetch) for full-page
  anchors on 3 admin links (leads "Clear", lead-detail "Back", admin 404 links). Tolerable for
  a single-operator internal tool. → `_followup.md`.
- **LOW:** redundant `aria-label` on AppInputs already wrapped in `<label className="form-label">`
  (login, site-config). Announced text identical; no functional impact. → `_followup.md`.

**VERDICT: PASS.**

## Write ceiling (interactive)

Operator approved merge of Variant B. Integrated via `git cherry-pick 155eb0a` onto
`feat/heroui-universal-ui-system` → commit **43a1b6a**. Re-verified on the merged branch:
`pnpm check` 4/4 (78 ui + 108 web-next + 16 docs + 2 web-react tests), `pnpm -F web-next build`
compiled + 17 pages generated. Losers A/C archived as tags `hub/archive/20260625-164205/agent-{1,3}`;
winner tagged `agent-2-winner`. All 3 competition worktrees removed; temp branches
`worktree-agent-*` + `gate-A/B/C` deleted; `session_manager.py --cleanup` run.

## Cost audit (post-hoc)

- Variant subagents: A 182k tok / B 154k / C 156k output tokens (≈492k total).
- Adversarial reviewer: 89k tok.
- Agent count: 4 (3 variants + 1 reviewer) — under ceiling 12.
- Wall-clock: within the 45-min backstop (variants ran ~9–12 min each, parallel).

## Notes / deviations from the v2 contract

1. **Working base ≠ main.** The HeroUI program lives on `feat/heroui-universal-ui-system`,
   not yet on `main`. So the contract's `git checkout main; merge --no-ff` ceiling was replaced
   by a cherry-pick onto the feature branch. base_branch=main was still set+asserted per contract
   (harness worktrees branch off main regardless); variants ran STEP ZERO
   `git merge feat/heroui-universal-ui-system` to obtain the wrappers + funnel.
2. **Depth-2 realized as 3 single-agent variants** (see Depth section).
3. **Objective gate run in main checkout** (worktrees lack node_modules) — see G3 section.
4. agent-1's first STEP-ZERO merge briefly targeted the main checkout before it self-corrected
   in-worktree; no lasting effect (verified feature branch HEAD never moved during the run).
