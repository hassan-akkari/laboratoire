# Bootstrap report — laboratoire

> Generated 2026-05-07 from a 5-phase bootstrap pass. Documents what was inspected, what's marked TBD, and what needs the human's eyes.

## What was analyzed

### Phase 1 — Direct inspection

- Topology: `apps/{docs,web-react,web-next}` + `packages/ui`, pnpm workspaces, Turbo
- Manifests: root `package.json`, all four workspace `package.json` files, lockfile (versions cross-checked)
- Configs: `turbo.json`, `pnpm-workspace.yaml`, `.npmrc`, `eslint.config.mjs`, all `tsconfig*.json`, `vite.config.ts` (×2), `next.config.ts`, `tailwind.config.ts`, `vercel.json`, `.github/workflows/deploy-user-site.yml`, `.vscode/{settings,tasks}.json`
- History: `git log --oneline -50` and `git log --stat --since="3 months ago"`
- Tests: every `*.test.ts` enumerated and inspected
- Domain: `apps/web-next/lib/{pricing,orders,bookingSchemas,session,data}.ts`, `apps/docs/src/i18n/messages.ts`, portfolio JSON

### Phase 2 — Five parallel `Explore` scouts

Each scout received an evidence-based output contract (YAML, file:line citations required).

| Scout | Mandate | Status |
|---|---|---|
| `architecture-scout` | Patterns, layering, boundaries, accouplings | Returned 25 findings + 10 gotchas |
| `stack-forensics` | Exact installed versions from lockfile | Returned 27 packages with declared/installed pairs |
| `convention-miner+test-quality` | TS/ESLint/format/naming + test setup | Returned full convention map and 7 testing gaps |
| `build-deploy` | Turbo graph, GH Pages, Vercel, env, secrets | Returned full pipeline doc + 6 gotchas |
| `domain-cartographer+dx-auditor` | Booking/portfolio glossary + DX pain points | Returned 23 glossary entries + 7 DX issues |

### Phase 3-5 — Synthesis

Three artifacts written under `.claude/`:

- `CLAUDE.md` — overview, exact stack, architecture, commands, conventions, glossary, gotchas, workflow
- `CAPABILITIES.md` — host skills/sub-agents/slash-commands inventory (no project MCP/hooks)
- `AGENTS.md` — five project-specific sub-agent specs with `forbidden_tools` discipline

## Idempotency

Re-running the bootstrap on the same repo state should produce equivalent output (modulo the timestamp at the top of each file). Trigger phrases:

- `bootstrap full` — repeat all 5 phases
- `bootstrap refresh capabilities` — only Phase 4 (re-scan host skills)
- `bootstrap audit` — diff each `.claude/*.md` against the live repo and report drift

## TBD / unknowns

| Item | Why TBD | How to resolve |
|---|---|---|
| Canonical production domain for `apps/docs` | Both Vercel and GH Pages deploy it; no doc states which receives traffic | Ask the human; pick one, retire or sub-domain the other |
| Status of `apps/web-next` (prototype, planned prod, deprecated?) | Built in CI, never deployed, in-memory state, MVP-grade auth | Ask the human; roadmap decision |
| Dead `@laboratoire/ui` path alias in `apps/web-react/tsconfig.app.json:11-13` | Alias exists, dep not declared, zero imports | Either wire web-react to consume the UI package, or delete the alias |
| Whether the three apps' design tokens **should** match | Dark theme bg/accent colors drift between docs and web-react | Confirm intent; if yes, consolidate via `packages/ui` theme |
| `@headlessui/react` declared `^2.1.2` vs installed `2.2.9` | Range allows the upgrade; declaration drift | Bump to `^2.2.9` next time `packages/ui/package.json` is edited |
| `apps/web-react` lacks a `tailwind.config.ts` | Tailwind v4 falls back to plugin defaults, but content scanning may miss class usage | Decide: drop Tailwind from web-react, or add an explicit config like docs |
| Commit-message convention | Free-form mixed with conventional prefixes | If the team wants enforcement: add commitlint + conventional-commits |

## Open questions for the human

1. **Is `web-react` the project where Redux + MSW are the message?** It looks like a reference/template app. If so, document its purpose explicitly so `packages/ui` integration isn't expected.
2. **What fails first when Pages deploy fails?** The CI runs `pnpm check` then `pnpm build` then publishes — but the `dist-pages` staging step is bash-only and does no validation. If `apps/web-react/dist/index.html` is missing, the workflow proceeds and pushes a broken site.
3. **Should `pnpm dev` default to docs alone?** The current alias is convenient if docs is the daily driver, but new contributors won't realize the other apps exist unless they read the README.
4. **Are the booking promo codes (`NETWORK10`, `TEAM5`) intentionally hard-coded?** They live in source — if they're feature flags or campaigns, surface them via env or admin route.
5. **Does the project want pre-commit hooks?** None exist now. `husky` + `lint-staged` would catch most of the convention drift the scouts surfaced.

## Hard rules followed during this bootstrap

1. Every version in `CLAUDE.md` was extracted from `pnpm-lock.yaml` (no manifest ranges).
2. Every command in `CLAUDE.md` was verified against an existing `package.json` script.
3. Every cited file:line was inspected (or returned by Grep) before publication.
4. Sections that exceeded 30 lines were split (Conventions, Gotchas) or trimmed.
5. No claim is made without evidence — items above without evidence are listed as TBD.

## File map

```
.claude/
├── CLAUDE.md              # canonical instructions for any contributor
├── AGENTS.md              # five project sub-agent specs
├── CAPABILITIES.md        # host skills/sub-agents/commands inventory
└── _bootstrap-report.md   # this file
```
