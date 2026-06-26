# Orchestrator run — web-next admin-primary restructure (P6 / Job 2)

- **Date:** 2026-06-25 (merged/cleaned 2026-06-26)
- **Task (verbatim):** web-next restructure — redirect apex `/` to `/admin`, host-route `admin.itshassan.it` to `/admin` via proxy.ts, park booking funnel under `app/(booking-demo)` route group (keep `/admin` name, keep URLs).
- **Mode:** interactive
- **Terminal state:** **merged** (winner merged `--no-ff` into `feat/heroui-universal-ui-system`)

## Origin
Started as "Job 2" (host-route admin subdomain) but the human reframed mid-session: web-next began as a booking demo, is "weird rn," wants the noise gone + admin primary, app stays `web-next`. Two `AskUserQuestion` rounds + a second ENTP pre-flight scoped it to: keep `/admin` name (NO rename), apex `/` → redirect to `/admin`, park booking under a route group, ONE competition.

## Classification
```yaml
stack:      next         # apps/web-next (App Router)
domain:     fullstack    # routing + middleware + layout structure
action:     refactor     # restructure, no new feature
complexity: complex      # ~10 files, route group moves, proxy logic, root layout, 108 tests
confidence: high         # files mapped, decisions locked pre-spawn
```

## ENTP pre-flight (Step 1.5, --challenge)
Key catches:
- **Route groups are URL-transparent** — "parking" moves FILES, not URLs; `/cart` stays `/cart`. The noise-removal lever is the apex `/` decision + proxy, NOT the folder move. (Verified, shaped the task.)
- **A rename would be the irreversible/security-sensitive part** (origin allowlist + cookie + 108 test strings) — human chose to KEEP `/admin`, removing that whole risk class. ENTP's biggest worry → moot.
- Relative `../lib` imports break when a route group adds a dir level — flagged as the main mechanical trap.
- Scope verdict: `split` (recommended rename→route→park separately). Human OVERRODE to "one competition" — defensible since no rename = small diff. Advisory respected, human decided.

## Base-branch deviation
`--base-branch feat/heroui-universal-ui-system` (same as P4): booking pages import the v3 App* wrappers that exist only on feat. Asserted base in config.

## Depth & variants
- **Depth-2** (complex). 3 worktree agents, each could sub-dispatch.
- **A** (a2b3 / `28404287`) — routing-first: best proxy (`effectivePath` abstraction, full host×path matrix, 11 new proxy unit tests), rewrites ALL non-admin paths on admin host. Kept the x-pathname/isAdmin layout hack.
- **B** (ae37 / `70d98676`) — minimal-diff: smallest (+147), `/`-only rewrite, `@/` alias, NO new tests, kept the hack.
- **C** (a037 / `0689308f`) — structure-first ← **WINNER**.

### Worktree base anomaly (recurring — now root-caused)
All 3 forked off STALE `75e13bc1` (orchestrator-docs commit), not feat tip. All self-recovered via `git reset --hard feat/...` + install. **Variant A additionally ran its first `git mv` in the SHARED MAIN checkout** (the bare-cd gotcha) — caught it, reverted non-destructively (the harness auto-classifier blocked `--hard`, used `git restore` surgical path), verified main pristine, redid with `git -C <worktree>`. Post-run verification CONFIRMED main untouched + all 3 branches feat+1. **Root cause found during cleanup:** 9 orphaned `worktree-agent-*` branches from this + prior sessions ALL sat at `75e13bc1` — the isolation-worktree mechanism forks off that stale commit. Cleaned all 9.

## Objective gate (G3) — `pnpm check` per worktree
A: exit 0 · B: exit 0 · C: exit 0 → all qualified.

## Judge (rubric: refactor — convention 30 / type-safety 25 / diff-minimality 20 / test-retention 15 / reversibility 10; task INTENT "make it cleaner" elevates structural-convention, the top weight)

Winner: **C (structure-first)**.

Decisive analysis — all three do the routing correctly (apex redirect + host-route + park + `@/` imports + 108 tests retained). The differentiator is the **x-pathname/isAdmin nav hack**:
- A & B both KEEP it: root layout reads a proxy-injected `x-pathname` header, computes `isAdmin`, conditionally hides booking nav. Works only because the proxy carefully sets the right value across the proxy/render boundary — fragile coupling.
- **C DELETES it**: booking nav moved to a new `(booking-demo)/layout.tsx`, structurally scoped to the route group → nav cannot leak onto `/admin` BY CONSTRUCTION. Root layout reduced to a pure document shell. This is the idiomatic Next pattern and the exact "cleaner" the human asked for.
- C also **caught + fixed a latent bug**: removing the old `headers()` call unmasked a `useSearchParams` prerender bailout on `/admin/login`; C fixed via `dynamic = "force-dynamic"` on root (justified — the app is wholly runtime-dynamic; the old `headers()` provided this implicitly) WITHOUT touching `app/admin/*`.

C's larger diff (+293 vs B's +147) is the SUBSTANCE of the cleanup, not scope creep. A's superior proxy + tests were the runner-up strength; C's structural win + intent-match took it.

## Adversarial pass (G4, fail-closed) — verdict PASS, NO CRITICAL
Dispatched via general-purpose (adversarial mandate). The key security trace got a definitive answer:
- **"Is /admin served unauthenticated on admin.itshassan.it/?" → NO.** The proxy host-block returns `NextResponse.rewrite` BEFORE the proxy's presence-only cookie check, BUT the rewrite target `/admin` resolves through `(authed)/layout.tsx` → `requireAdminSession()` (full iron-session cryptographic unseal — STRONGER than the proxy gate) → `redirect("/admin/login")` when unauthenticated. Defense-in-depth holds, incl. against `x-forwarded-host` spoofing.
- Nav-leak-by-construction: VERIFIED clean. Imports clean. Booking URLs identical (route group transparent). Booking `/checkout` + `/api` 401 gate byte-preserved. x-pathname now vestigial (no consumer) — harmless.
- **MEDIUM** (pre-existing, not introduced → fixed post-merge): `/browse` carried dead `revalidate = 300` (force-dynamic wins; was already dead pre-restructure via the old `headers()`).
- **LOW** (→ `_followup.md`): proxy comment matrix under-documents that `/checkout` also rewrites on the admin host.

## Post-merge gate + cleanup fix
After merge, `pnpm check` initially FAILED (web-next typecheck exit 2): `.next/dev/types/validator.ts` referenced OLD pre-move paths (`app/cart/page.js` …) — **stale Next generated-types cache in the main checkout** (variant gates were green because their worktrees had fresh `.next`). Fix: `rm -rf apps/web-next/.next` → typecheck exit 0 → full `pnpm check` exit 0 (5/5, 108 web-next tests). NOTE for future: route-group moves poison the main checkout's `.next` cache; clear it post-merge.

Full `next build` (placeholder DB env) on the winner: exit 0, all 23 routes, `(booking-demo)` absent from URLs, `/` + `/browse` + booking URLs + `/admin/*` + Proxy all present.

## Merge + cleanup commit
- Merge `--no-ff` C → feat @ `7326e507` (11 files, +293/-184; git tracked the moves as renames 91-96%).
- Post-merge cleanup commit `e2d1c47b` — drop dead `revalidate` on /browse (the MEDIUM finding).

## Cleanup (G5) — fully clean
3 variant worktrees removed; 3 variant branches deleted; PLUS 9 orphaned `75e13bc1` branches from this+prior sessions deleted; PLUS the 3 previously-locked P4 worktree dirs removed (resolves prior-run followup H6). `git worktree list` = main only; `.claude/worktrees/` empty; `git status` clean. No residue.

## Cost audit
- Variants: 3 × general-purpose (subagent_tokens ~108k/94k/133k) + 1 adversarial (~77k).
- Agents dispatched: 4 (≤ ceiling 12). Wall-clock for the spawn→merge phase well under backstop. Backstops not exceeded.

## Outcome
web-next is now admin-primary: apex → /admin, `admin.itshassan.it` serves the console at its root, booking demo parked + dormant-by-structure, the fragile nav hack gone. `/admin` name kept. The DNS/Vercel half (point `admin.itshassan.it` at the deployment) remains human-gated + is moot until web-next has a deploy target (CLAUDE.md gotcha #5) — the proxy logic is in place + unit-tested for when it does.
