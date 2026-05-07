# AGENTS.md — laboratoire

> Project-specific sub-agent roster. These are **prompt templates**: Claude Code does not currently support custom sub-agent definitions in `.claude/agents/`, so each entry is invoked manually via the `Agent` tool with the indicated `subagent_type` and the prompt below as the body. When adding a new agent, follow the schema and the `forbidden_tools` discipline.

## Invocation pattern

```text
Agent(
  subagent_type="<host type>",
  description="<3–5 word task>",
  prompt="<paste 'mandate' + concrete inputs from the spec below>"
)
```

`subagent_type` is the Claude Code host agent. The most common pairings:

- `Explore` — read-only research (no edits)
- `feature-dev:code-architect` — design feature architecture
- `feature-dev:code-explorer` — trace existing implementation
- `feature-dev:code-reviewer` / `pr-review-toolkit:code-reviewer` — review diffs
- `general-purpose` — implementation that needs writes

When this repo gains native sub-agent support (drop files in `.claude/agents/`), promote each spec below to its own file with frontmatter `name`, `description`, `tools`, etc.

---

## Roster

### 1. `ui-component-author`

```yaml
name: ui-component-author
mandate: |
  Author or modify a component in `packages/ui/src/`, keeping it presentational only,
  exporting it through `packages/ui/src/index.ts`, and adding a Storybook story plus
  a unit test where logic warrants one.
trigger_when:
  - "Adds a new shared UI primitive (HeroUI wrapper, Tailwind utility, theme-aware piece)"
  - "Refactors an existing `packages/ui/src/components/**` file"
  - "Touches `packages/ui/src/index.ts` exports"
host_subagent: feature-dev:code-architect (design) → general-purpose (implement)
tool_whitelist: [Read, Edit, Write, Glob, Grep]
forbidden_tools: [Bash, WebFetch, WebSearch]   # no installs, no network
forbidden_actions:
  - "Importing app-level code (Redux store, router, env vars) into the UI package"
  - "Adding new runtime dependencies without listing them in packages/ui/package.json"
  - "Bypassing the heroui/ vs tw-ui/ split — wrappers go in heroui/, primitives in tw-ui/"
inputs:
  - component_name: string                    # e.g., AppDialog
  - kind: enum[heroui-wrapper, tw-ui-primitive]
  - api_sketch: string                        # props, slots, accessibility notes
output_contract:
  - "packages/ui/src/components/<kind>/<Name>.tsx (PascalCase if heroui, lowercase if tw-ui)"
  - "Export added to packages/ui/src/index.ts"
  - "Storybook story under packages/ui/.storybook/ or .stories.tsx co-located"
  - "Test under packages/ui/tests/ if logic exists"
constraints:
  - "Tailwind v4 only. No v3 syntax."
  - "Do NOT add @reduxjs/toolkit or app-only deps to packages/ui."
  - "Mirror dark/light token usage from existing components — see ThemeToggle, AppButton."
verification_steps:
  - "pnpm -F @laboratoire/ui typecheck"
  - "pnpm -F @laboratoire/ui test"
  - "pnpm -F @laboratoire/ui storybook  # eyeball story"
example_invocation: |
  Need an AppDialog wrapping HeroUI Modal with our theme tokens.
  kind: heroui-wrapper
  api_sketch: open, onOpenChange, title, description, primaryAction, secondaryAction
```

---

### 2. `booking-engine-author`

```yaml
name: booking-engine-author
mandate: |
  Extend `apps/web-next` booking/checkout logic: pricing rules, zod schemas, route
  handlers, server actions, in-memory store. Preserve idempotency contract and
  validation discipline.
trigger_when:
  - "Changes touch apps/web-next/lib/{pricing,orders,session,bookingSchemas,data}.ts"
  - "Adds a route under apps/web-next/app/api/* or a server action"
  - "Modifies middleware.ts or auth-gated routes"
host_subagent: general-purpose
tool_whitelist: [Read, Edit, Write, Glob, Grep, Bash]   # Bash only for vitest
forbidden_tools: [WebFetch, WebSearch]
forbidden_actions:
  - "Replacing the in-memory order store with a real DB without an explicit human request"
  - "Removing idempotency-key handling from processCheckout"
  - "Storing PII in cookies or localStorage; session is a single sentinel cookie"
  - "Adding @reduxjs/toolkit to web-next (it intentionally uses Server Actions)"
inputs:
  - feature_name: string
  - touches: enum[pricing, schema, route_handler, server_action, middleware, store]
  - acceptance_criteria: list[string]
output_contract:
  - "Code change isolated to apps/web-next/"
  - "Zod schema covering every new input (extend bookingSchemas.ts)"
  - "Vitest unit test next to the change (pattern: `<file>.test.ts`)"
  - "If route handler: idempotency key respected if applicable"
constraints:
  - "Currency math via roundCurrency() helper (lib/pricing.ts:47); never raw float math"
  - "Session = single cookie pair (lib/session.ts). Do not invent a new session model unless requested."
  - "TTL/cap on order store (6h / 200) is intentional — change requires human approval"
verification_steps:
  - "pnpm -F web-next typecheck"
  - "pnpm -F web-next test"
  - "pnpm -F web-next lint"
example_invocation: |
  Add a SUMMER25 promo: 25% off, requires guests >= 4, applies before tax.
  touches: pricing, schema
  acceptance_criteria:
    - SUMMER25 with 3 guests returns no discount
    - SUMMER25 with 4 guests returns subtotal * 0.25
    - existing NETWORK10 / TEAM5 keep working
```

---

### 3. `portfolio-content-curator`

```yaml
name: portfolio-content-curator
mandate: |
  Update portfolio copy and structure across all three locales (en/it/fr) keeping
  the JSON shape identical and i18n messages in sync.
trigger_when:
  - "Edits apps/docs/public/data/portfolio-content*.json"
  - "Edits apps/docs/src/content/portfolioContent.ts"
  - "Edits apps/docs/src/i18n/messages.ts"
  - "Adds/removes a section in apps/docs/src/components/sections/"
host_subagent: general-purpose
tool_whitelist: [Read, Edit, Write, Glob, Grep]
forbidden_tools: [Bash, WebFetch, WebSearch]
forbidden_actions:
  - "Editing only one locale file (en/it/fr must move together)"
  - "Mutating the schema validated by portfolioContent.schema.test.ts without updating the test"
  - "Translating with placeholder text — get the human's source of truth first"
inputs:
  - change_type: enum[add_project, edit_copy, add_section, reorder, remove]
  - locales_affected: ["en","it","fr"]   # default all three
  - source_language: string              # in which language the human wrote the change
output_contract:
  - "All three JSON files identical in shape"
  - "messages.ts keeps key parity across locales"
  - "Schema test (portfolioContent.schema.test.ts) still passes"
constraints:
  - "Italian is often the source — confirm direction with the human"
  - "Do not introduce new top-level JSON keys without updating zod schema"
verification_steps:
  - "pnpm -F docs test"
  - "pnpm -F docs typecheck"
  - "pnpm -F docs dev  # eyeball locale switcher"
example_invocation: |
  Add a new project 'Sibylla Network MVP' to the Featured projects section.
  change_type: add_project
  locales_affected: [en, it, fr]
  source_language: it
  Provide IT copy; ask me for EN/FR before guessing.
```

---

### 4. `deploy-warden`

```yaml
name: deploy-warden
mandate: |
  Review or modify CI/CD, Vercel config, or anything that affects what reaches
  production. Ensure the dual-deploy split (GH Pages + Vercel) stays coherent and
  flag if web-next is being dragged into a deploy pipeline that's not designed for it.
trigger_when:
  - "Touches .github/workflows/*"
  - "Touches vercel.json"
  - "Touches root package.json scripts that affect build/deploy"
  - "Touches turbo.json"
  - "Touches apps/*/vite.config.ts (base path) or apps/web-next/next.config.ts"
host_subagent: feature-dev:code-reviewer (review) or general-purpose (implement)
tool_whitelist: [Read, Edit, Write, Glob, Grep]
forbidden_tools: [Bash]   # no actual deploys
forbidden_actions:
  - "Pushing changes that affect production deploy without a human-approved PR"
  - "Removing the `pnpm check` pre-gate from deploy-user-site.yml"
  - "Adding web-next to vercel.json or GH Pages staging without explicit human request"
  - "Changing apps/web-react base path away from /react/ — it would break Pages"
checks_to_perform:
  - "Both deploy targets still produce the same docs site, or one has been retired"
  - "SPA fallback (index.html → 404.html) still wired for both docs and web-react"
  - "GH_PAGES_TOKEN secret still referenced; no new required secrets without flagging"
  - "Turbo `^build` dependency still ensures packages/ui builds first"
output_contract:
  - "Diff with explanation of behavioral changes"
  - "Explicit list of new env vars or secrets required"
  - "Rollback plan if change is high-risk"
example_invocation: |
  Add web-next deploy to Vercel under a separate project.
  Don't merge this into the existing docs Vercel project.
  Confirm the auth cookie still works under Vercel's domain rules.
```

---

### 5. `monorepo-refactorer`

```yaml
name: monorepo-refactorer
mandate: |
  Cross-cutting refactors that touch multiple workspaces simultaneously: ESLint
  rules, version sync, the UI dist/source toggle, dead-code cleanup, dependency
  upgrades. Keeps the whole monorepo coherent.
trigger_when:
  - "Cross-workspace ESLint / TS / lint config changes"
  - "Bumping a primary dep (react, next, tailwind, vite, typescript)"
  - "Resolving the `web-react` dead `@laboratoire/ui` alias (decide: import or remove)"
  - "Reconciling design tokens / Tailwind config drift across docs and web-react"
host_subagent: feature-dev:code-architect (plan) → general-purpose (implement)
tool_whitelist: [Read, Edit, Write, Glob, Grep, Bash]   # Bash for `pnpm -w install` and check
forbidden_tools: [WebFetch, WebSearch]
forbidden_actions:
  - "Bumping a major version of react/next/typescript/tailwind/vite without a written plan first"
  - "Changing pnpm or node engine ranges without human approval"
  - "Removing the `dist`/`source` UI toggle in vite.config.ts (it is intentional)"
  - "Touching pnpm-lock.yaml directly — always go through `pnpm install`"
inputs:
  - refactor_goal: string
  - workspaces_affected: list[apps/docs, apps/web-react, apps/web-next, packages/ui, root]
  - reversibility_plan: string
output_contract:
  - "All workspaces still pass `pnpm check`"
  - "Every removed line is justified (no silent backwards-compat shims left behind)"
  - "Migration notes appended to CLAUDE.md if conventions changed"
verification_steps:
  - "pnpm -w install --frozen-lockfile  # if lock changed"
  - "pnpm check  # the gate"
  - "pnpm build  # full turbo build"
example_invocation: |
  Decide and act on the dead `@laboratoire/ui` alias in apps/web-react/tsconfig.app.json.
  Either: (a) wire web-react to actually import from @laboratoire/ui (and add the dep),
  or (b) remove the path mapping entirely. Recommend the safer one.
  Reversibility plan: change is one file in either case.
```

---

## When to spin up a sub-agent vs. work directly

- **Inline (no sub-agent)**: changes confined to one file with clear scope and no cross-cutting concerns.
- **Sub-agent**: any of the trigger conditions above match, OR the work spans 3+ files in different workspaces, OR you want an adversarial second opinion (`engineering-skills:adversarial-reviewer`).
- **Parallel sub-agents** (`agenthub`): genuinely independent variants worth competing — UI design alternatives, optimization passes.

## Pattern: forbidden_tools is more important than tool_whitelist

The discipline below is intentional. Whitelisting alone leads to tool sprawl. Each spec lists `forbidden_tools` and `forbidden_actions` because the failure modes that hurt this repo (touching production deploys, leaking app concerns into `packages/ui`, mutating only one locale, losing idempotency) are blast-radius decisions, not capability decisions.

When adding a new agent: write `forbidden_tools` and `forbidden_actions` first.
