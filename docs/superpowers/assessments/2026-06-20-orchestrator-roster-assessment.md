# Orchestrator Roster Assessment

> Date: 2026-06-20 · Scope: `orchestrator` skill specialist roster + `.claude/AGENTS.md` + `.claude/CAPABILITIES.md`
> Method: 4-lens parallel assessment (reference-validity vs live env, coverage/gaps, routing-pairing coherence, ENTP forward-fit), verified against on-disk plugin cache + live session manifest.

## Verdict

Structurally sound, but: **2 hot-path broken references**, **~35% out-of-scope clutter**, **4 self-contradicting pairings**, and a handful of CAPABILITIES.md doc-rot references. P0 + P1 (below) are **fixed** on branch `fix/orchestrator-roster`. P2 + doc-rot + ENTP remain.

---

## Findings

### 🔴 P0 — broken refs on the routing hot path (FIXED)
`product-skills:ui-design-system` and `product-skills:ux-researcher-designer` were cited as variant **leads/subs** (roster + taxonomy leaves 2, 8, 11). The `product-skills` plugin **does not exist** on this host (verified: not in cache, not in live skill list). A competition routing there would fail to spawn.
**Resolution:** replaced all occurrences (incl. a bare `ui-design-system` in the pairing table and one in the walkthrough example) with **`ui-ux-pro-max`** — the installed skill whose remit (design tokens, component API, visual hierarchy, theming, UX flow/IA/form UX, a11y) is the 1:1 capability match. Zero `product-skills` refs remain.

### 🟠 P1 — self-contradictions + noise (FIXED)
- **`adversarial-reviewer` used as a variant LEAD** in constructive tasks (taxonomy #4 "Fixa bug", pairing table) — violates the roster's own "mai come lead" rule (the row even self-annotated it). → "Fixa bug" Variant C lead = `senior-fullstack`; adversarial-reviewer demoted to the post-competition pass. Kept as lead **only** in audit-only leaves (audit = find-problems = its nature).
- **`senior-secops` as a lead** ("Audit sicurezza") — violates "sub-only" rule. → `senior-security` leads, `senior-secops` becomes a sub.
- **`epic-design` / `frontend-design` visual-lens collapse** on ordinary `docs` sections → `epic-design` gated to scrollytelling/hero intent, else `senior-qa`.
- **Noise — ~35% dead weight** for a frontend + UI-lib + booking-MVP repo: dropped `rag-architect`, `agent-designer`, `senior-ml-engineer`, `senior-data-engineer`, `senior-data-scientist`, `senior-prompt-engineer` (reintroduce only if a real AI/ML/data/prompt task appears). `apple-hig-expert` demoted to opt-in.
- Merged the two duplicate `ui-ux-pro-max` rows P0 created; added overlap notes (architect=design-lead vs fullstack=impl-lead; tech-stack-evaluator = tooling-choice only).

### 🟡 P2 — coverage gaps (NOT yet actioned)
Capabilities the repo genuinely exercises but no **roster-level** specialist owns (today only partly covered by `.claude/AGENTS.md` project agents):
- **i18n tri-locale (en/it/fr) sync** — highest-frequency correctness trap; only `portfolio-content-curator` (AGENTS) covers it.
- **RTK Query / MSW data layer** (`docs`, `web-react`) — no owner for new API slices + MSW handler pairing.
- **Tailwind-v4 cross-app token drift** — no owner for the docs↔web-react↔web-next reconciliation (Gotcha #4).
- **Pricing-domain correctness** (roundCurrency/promo/service-fee/tax/min-group) + **a11y** — live only in AGENTS/judge-focus, not surfaced as roster leads.

### ⚪ Doc-rot — `.claude/CAPABILITIES.md` (NOT yet actioned; lower blast radius)
Fails only if invoked: `pr-review-toolkit:*` (6 refs — plugin gone → use `feature-dev:code-reviewer`), `claude-md-management:*` (2 refs — gone), `firecrawl:firecrawl` (→ `firecrawl:firecrawl-search`), `engineering-skills:tech-debt-tracker` (→ `engineering-advanced-skills:`), `code-review:code-review` (it's a slash command, not an agent type).
The 5 `.claude/AGENTS.md` project agents are correctly prompt-templates and name only valid host subagent types ✅.

### 🟣 ENTP forward-fit (recommendation for the next layer)
**ENTP = standalone pre-flight critic at Step 1.5** — challenges the *task* (framing/scope/"build it at all"), **divergent, advisory, never fail-closed, never sees code.** Gate on `complexity=complex OR confidence≠high`. Mode-aware: interactive surfaces reframings → human decides; unattended advisory-only → run-log, never blocks (G2).
Keep **three skeptic roles distinct**: ENTP (task, pre-code, divergent, advisory) · `adversarial-reviewer` (winning diff, post-code, convergent, fail-closed) · judge (variant set, comparative ranking). **Reject** ENTP-as-judge-panel (wrong epistemic mode) and ENTP-merged-into-adversarial (would weaken G4). Add an `entp-strategist` roster row with anti-triggers vs `senior-architect` ("how to build" ≠ "should we") and `tech-stack-evaluator` ("tech choice" ≠ "task framing").

---

## Actioned vs remaining

| Item | Status |
|---|---|
| P0 broken refs | ✅ fixed (`e57bb9ea`, `fc9e08a1`) |
| P1 contradictions + noise | ✅ fixed (`79bcff22`) |
| P2 coverage gaps | ⏳ open (next roster pass) |
| CAPABILITIES.md doc-rot | ⏳ open (separate small fix) |
| ENTP skill | ⏳ open (next layer — needs design/brainstorm) |
