# Orchestrator run — web-react P4 HeroUI App* migration

- **Date:** 2026-06-25
- **Task (verbatim):** P4 web-react HeroUI migration — swap 4 raw `@heroui/react` files (PageHeader, StatusCard, ThemeTokensCard, HeroForm) onto `@laboratoire/ui` App* wrappers + port the v2+v3 CSS coexistence recipe into web-react index.css.
- **Mode:** interactive
- **Terminal state:** **merged** (winner merged `--no-ff` into `feat/heroui-universal-ui-system`)

## Classification
```yaml
stack:      vite-spa     # apps/web-react
domain:     frontend
action:     refactor
complexity: complex      # 5 files (4 components + index.css), CSS-regression surface, v2+v3 coexistence
confidence: high         # files + wrappers verified pre-spawn
```

## ENTP pre-flight (Step 1.5)
Ran (gate: complex + explicit `/entp`). Scope verdict **as-framed**; reframed the work as "port the v2→v3 CSS coexistence recipe, not just swap imports" — the CSS layer is the real risk surface, not the import swap. Flagged: AppSelect-v3 form-submission gotcha (N/A here — controlled React state, not server-action), AppInput event-style onChange trap, status-chip warm-token gap. ENTP did NOT catch the base-branch problem (no git context in pre-flight).

## Base-branch deviation (IMPORTANT)
Orchestrator default is `--base-branch main`. **Overridden to `feat/heroui-universal-ui-system`** because P4 depends on the v3 field-slice (AppInput-v3, AppChip, warmThemeV3.css, @heroui-v3 packages) which live only on feat — 36 commits ahead of main, unmerged. Verified main lacks them (`AppInput` on main = v2, 0 `heroui-v3` matches; no AppChip; no warmThemeV3.css). Human chose "base off feat"; winner merges back to feat. First main-based init (session 20260625-221826) abandoned before spawn (no worktrees), re-init as 20260625-223810.

## Depth & variants
- **Depth-1** (lone specialists) — complex but mechanically bounded (known recipe to mirror from docs/index.css); Depth-2 sub-teams unjustified.
- **A** (a9a7 / `aab591d6`) — recipe-fidelity-first
- **B** (ae1f / `b8ee7f68`) — parity-first / zero-visual-regression  ← **WINNER**
- **C** (ac73 / `ec72a7b9`) — type-safety & test-led

## Agenthub session
`20260625-223810`, base_branch asserted = `feat/heroui-universal-ui-system`. 3 worktree agents.

### Worktree base anomaly (recurring gotcha)
All 3 worktrees forked off `75e13bc1` (an old orchestrator-docs commit), NOT the feat tip `5c7a01f5`, despite config base=feat. Each agent self-detected (task premise "v3 infra exists here" was false — no wrappers/CSS), verified HEAD was a strict ancestor of feat tip, and `git reset --hard feat/heroui-universal-ui-system` on its own throwaway worktree branch + `pnpm install`. Recovery was correct: main repo stayed on feat (NOT polluted), all 3 branches ended exactly feat+1. Matches the memory note "worktree bases off main + agents bare-cd pollute feat" — the isolation-worktree mechanism forks off a stale point on this host. **Mitigation for next run:** verify worktree HEAD == intended base immediately after spawn, before agents work.

## Objective gate (G3) — `pnpm check` per worktree, 20-min timeout
- A: **exit 0** (pass)
- B: **exit 0** (pass)
- C: **exit 0** (pass)
All 3 qualified.

## Judge (rubric: refactor — convention 30 / type-safety 25 / diff-minimality 20 / test-retention 15 / reversibility 10; ENTP-elevated: no silent CSS regression weighted into correctness)

Winner: **B (parity-first)**.

| Axis | A | B | C |
|---|---|---|---|
| CSS completeness (8 v3 wrappers) | ✅ all incl checkbox/switch | ✅ all incl checkbox/switch | ❌ **MISSING checkbox.css + switch.css** |
| onChange event-style fix | ✅ | ✅ | ✅ |
| AppSelect empty-role | `new Set([role])` (1 key always) | `role ? new Set([role]) : new Set()` (no phantom) | same as B, `new Set<string>()` |
| type rigor | good | good (local `Key`) | best (Props evidence, zero casts) |
| parity analysis | structural checklist | **full per-wrapper table + flagged deltas** | type-focused |

**Decisive factor:** C — though the strongest on type-safety — silently dropped `checkbox.css` + `switch.css`. AppCheckbox/AppSwitch are v3-backed; without their CSS the newsletter checkbox + priority switch render **unstyled**. `pnpm check` passes anyway (CSS not typechecked) — exactly the silent-regression trap ENTP flagged. Disqualified on the decisive correctness axis. B beat A on stricter empty-role Set handling + the explicit parity table. (Consistent with P5 admin: parity-first wins.)

## Adversarial pass (G4, fail-closed)
Dispatched via `general-purpose` with adversarial mandate (adversarial-reviewer is a Skill, not a subagent_type — G9). Verdict: **NO CRITICAL.** All 7 correctness facts pass (onChange semantics, checkbox/switch kept v2 surface, empty-safe Set, all 8 wrappers' CSS imported, tw-animate-css ordering, no `@config`, no raw v2 imports). Independently confirmed B's CSS completeness vs C's gap.
- **LOW** (non-blocking → `_followup.md`): StatusCard success/warning/danger chips render with v3-DEFAULT colors (warmThemeV3 defines no warm `--success/--warning/--danger`; falls back to themes/default). Pre-existing foundation gap (AppChip.tsx:32-37), present in docs too, NOT introduced by this diff.

## Post-merge gate
`pnpm check` on feat after merge: **exit 0** (5/5 workspaces, FULL TURBO). Build B: `pnpm -F web-react build` exit 0, 453.41 kB CSS, no `fade-in-0` error.

## Merge
`git merge --no-ff worktree-agent-ae1f9dfc10b443128` → `feat/heroui-universal-ui-system` @ merge commit `6526a91e` (winner commit `b8ee7f68`). 5 files, +121/-60.

## Cleanup (G5)
Branches deleted (3). `git worktree prune` clean; `git worktree list` = main only; `git status` clean. **Disk residue:** 3 worktree dirs could not be `rm`'d — locked native `tailwindcss-oxide.win32-x64-msvc.node` (Windows memory-map lock from the gate's pnpm process). Dirs are gitignored (`.claude/worktrees/`), invisible to git — NOT aborted-DIRTY. Releases on process exit; cleanup deferred → `_followup.md`.

## Cost audit
- Variants: 3 × general-purpose (subagent_tokens ~143k/138k/143k) + 1 adversarial (~92k).
- Agents dispatched: 4 (≤ RUN_AGENT_CEILING 12). Wall-clock: ~41 min (≤ RUN_WALLCLOCK_MINUTES 45; spawn was the long pole).
- Backstops: not exceeded.
