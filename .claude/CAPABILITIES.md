# CAPABILITIES.md — laboratoire

> Map of agentic superpowers available when working on this repo. Inventoried 2026-05-07 from `~/.claude/settings.json` and the active session's skill manifest. **No project-level MCP servers, hooks, or custom slash commands are configured** in this repo (no `.claude/mcp.json`, no `.claude/commands/`, no `settings.json`).

## Host environment

- **Platform**: Claude Code (VSCode extension), running with `defaultMode: auto` and `effortLevel: max`.
- **Permission gate**: `skipAutoPermissionPrompt: true` — most read-only ops run without prompts. Destructive ops still ask.
- **Project config**: none. Adding `.claude/settings.json`, `.claude/mcp.json`, or `.claude/commands/*.md` here would scope new behaviors to this repo.

## Cost legend

- **Low**: local read/grep/edit, no network, fast (≤2s), no quota.
- **Medium**: spawns a sub-agent or runs a long-form skill (10–60s, sub-agent token cost).
- **High**: long-running multi-agent orchestration, network heavy, or destructive (parallel agents, scheduled jobs, deploys).

---

## Skills (invoke via the `Skill` tool)

Only the entries that earn their keep on this codebase. Full plugin list lives in `~/.claude/settings.json`.

### Core workflow (use these first)

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `superpowers:brainstorming` | **Before any new feature, component, or behavior change.** Skill list says use it for creative work. | Low | Forces requirements/design dialogue before code. |
| `superpowers:writing-plans` | Multi-step task with a spec — produce a plan file. | Low | Pairs with `executing-plans`. |
| `superpowers:executing-plans` | Run a previously written plan. | Medium | Has review checkpoints. |
| `superpowers:test-driven-development` | Implementing features or bugfixes. | Medium | Rigid skill — follow exactly. |
| `superpowers:systematic-debugging` | Any bug / test failure / unexpected behavior. | Medium | Run before proposing a fix. |
| `superpowers:verification-before-completion` | Before claiming a task is done. | Low | Forces evidence-before-assertion. |
| `superpowers:dispatching-parallel-agents` | 2+ independent tasks with no shared state. | Medium | Used during Phase 2 of bootstrap. |
| `superpowers:requesting-code-review` / `receiving-code-review` | Before merge / when feedback arrives. | Medium | |
| `superpowers:finishing-a-development-branch` | Decide merge vs PR vs cleanup at end of branch. | Low | |
| `superpowers:using-git-worktrees` | Isolate feature work or run `executing-plans` cleanly. | Low | |

### Project-aligned (UI / fullstack / quality)

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `frontend-design:frontend-design` | Build distinctive React/HTML pages or components. | Medium | Best fit for `apps/docs` portfolio sections and `apps/web-react`. Avoids generic AI aesthetic. |
| `engineering-skills:epic-design` | Cinematic 2.5D / scrollytelling / parallax / hero animations. | Medium | Pairs with `framer-motion` already in repo. |
| `engineering-skills:senior-frontend` | React 19 / Next.js / Tailwind / accessibility reviews. | Medium | |
| `engineering-skills:senior-fullstack` | Project scaffolding, stack decisions, code quality audit. | Medium | |
| `engineering-skills:senior-backend` | API / auth / DB design — relevant if `web-next` ever gets a real backend. | Medium | |
| `engineering-skills:senior-qa` | Generate Vitest / RTL / Playwright tests. | Medium | The repo currently has zero RTL/E2E tests. |
| `engineering-skills:tdd-guide` | Write/grow Vitest unit tests with red-green-refactor. | Medium | |
| `engineering-skills:senior-security` / `senior-secops` | Threat model / OWASP review — flag for the `web-next` cookie session. | Medium | |
| `engineering-skills:adversarial-reviewer` | Hostile second opinion on a PR. | Medium | Use before merging risky changes. |
| `engineering-skills:code-reviewer` | TS/JS PR analysis. | Medium | |
| `engineering-skills:tech-debt-tracker` | Score and triage tech debt. | Medium | Useful for the `web-react` ↔ `@laboratoire/ui` dead-alias issue. |
| `apple-hig-expert:apple-hig-expert` | iOS / macOS / visionOS HIG questions. | Medium | Only if a future app targets Apple platforms. |

### Repo automation / docs

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `claude-md-management:revise-claude-md` | Update **this CLAUDE.md** with session learnings. | Low | First choice when conventions shift. |
| `claude-md-management:claude-md-improver` | Audit / score / fix CLAUDE.md files in the repo. | Medium | |
| `engineering-advanced-skills:codebase-onboarding` | Generate onboarding docs for new contributors. | Medium | |
| `engineering-advanced-skills:focused-fix` | "Make feature X work end-to-end." | Medium | Heavier than a single bug fix; deep-dive across files. |
| `engineering-advanced-skills:tc-tracker` | Track technical changes across AI sessions. | Low | |
| `engineering-advanced-skills:dependency-auditor` | Vulnerability + version audit (good for the `@headlessui/react` mismatch). | Medium | |
| `engineering-advanced-skills:database-designer` | Schema design — only if `web-next` graduates from in-memory store. | Medium | |
| `engineering-advanced-skills:pr-review-expert` | Review a PR diff. | Medium | Complements `pr-review-toolkit:review-pr`. |

### Research / web

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `firecrawl:firecrawl` | Live web search, scraping, doc fetch. | High | Network + external service. Use only when builtin search/fetch is insufficient. |
| `firecrawl:skill-gen` | Generate a Skill from a documentation URL. | High | |

### Memory / self-improvement

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `si:remember` | Save a non-obvious finding to long-term memory now. | Low | |
| `si:review` / `si:status` | Audit memory health. | Low | |
| `si:promote` | Graduate a memory rule into `CLAUDE.md` or `.claude/rules/`. | Low | |
| `si:extract` | Turn a recurring solution into a reusable Skill. | Medium | |

### Heavy orchestration

| Skill | When to use | Cost | Notes |
|---|---|---|---|
| `agenthub:agenthub` | Spawn N parallel sub-agents in worktrees, evaluate, merge winner. | **High** | Use when a problem benefits from competing solutions (UI variants, optimization). Requires git repo. |
| `autoresearch-agent:autoresearch-agent` | Autonomous optimization loop on a single file by a metric. | **High** | Good for "shrink this bundle", "improve LCP", "tune this prompt". |

---

## Sub-agent types (invoke via the `Agent` tool)

Used during Phase 2 of bootstrap and re-usable for any research / review pass.

| Sub-agent | Best for | Cost |
|---|---|---|
| `Explore` | Read-only codebase research, locating files, mapping symbols. **Cannot write or edit.** | Low–Medium |
| `general-purpose` | Multi-step tasks where exact tool needs aren't known up front. | Medium |
| `Plan` | Pre-implementation planning step. | Medium |
| `feature-dev:code-explorer` | Trace execution paths, map architecture for a feature. | Medium |
| `feature-dev:code-architect` | Design feature architecture / blueprint. | Medium |
| `feature-dev:code-reviewer` | Confidence-gated code review. | Medium |
| `pr-review-toolkit:code-reviewer` | Diff vs. CLAUDE.md conventions. | Medium |
| `pr-review-toolkit:silent-failure-hunter` | Find swallowed errors / bad fallbacks. | Medium |
| `pr-review-toolkit:type-design-analyzer` | Evaluate new types for invariants and encapsulation. | Medium |
| `pr-review-toolkit:comment-analyzer` | Validate added comments against the code. | Medium |
| `pr-review-toolkit:pr-test-analyzer` | Test coverage for a PR. | Medium |
| `pr-review-toolkit:code-simplifier` | Strip cruft from recently written code. | Medium |
| `code-review:code-review` | Standalone PR review skill. | Medium |
| `claude-code-guide` | Questions about Claude Code itself (hooks, slash commands, MCP, SDK). | Low |
| `statusline-setup` | Configure the Claude Code statusline. | Low |

---

## Slash commands

Only the most relevant for this repo:

| Command | Purpose | Cost |
|---|---|---|
| `/loop` | Run a prompt or skill on a recurring interval. | Variable |
| `/schedule` | Cron-style remote agents (routines). | Variable |
| `/init` | Initialize a CLAUDE.md (already done — kept for re-runs). | Low |
| `/review` | Review a pull request. | Medium |
| `/security-review` | Security review of pending changes on the current branch. | Medium |
| `/simplify` | Review changed code for reuse, quality, efficiency. | Medium |
| `/fewer-permission-prompts` | Scan transcripts and tighten the project allowlist. | Low |
| `/update-config` | Modify `.claude/settings.json` / hooks / permissions. | Low |
| `/keybindings-help` | Customize `~/.claude/keybindings.json`. | Low |

`/ultrareview` is **user-triggered and billed externally**; cannot be invoked from within the agent. Mention it to the user when a thorough cloud review is wanted.

---

## MCP servers

**None configured.** The deferred OAuth-style MCP authenticators visible in this session (`Asana`, `Atlassian`, `Box`, `Canva`, `HubSpot`, `Intercom`, `Linear`, `Notion`, `monday.com`) are **available to authenticate but not wired up**. To enable one for this repo, drop a `.claude/mcp.json` and follow the `*__authenticate` flow.

---

## Hooks

**None configured.** No `~/.claude/hooks/`, no `.claude/settings.json` in this repo defining `PreToolUse` / `PostToolUse` / `SessionStart` / `Stop` hooks. The only host-level hook indicator is the `<user-prompt-submit-hook>` injection seen at session start (system-managed).

---

## Decision rules

When the dispatcher (you) is choosing between options:

1. **Local edit work** → use the built-in tools (`Read`, `Edit`, `Grep`, `Glob`). No skill needed.
2. **Creative or design-led** → `superpowers:brainstorming` first, then `frontend-design` or `epic-design`.
3. **Bug or test failure** → `superpowers:systematic-debugging` first.
4. **Multi-step or risky** → `superpowers:writing-plans` → `executing-plans`.
5. **External research** → `firecrawl` only when built-in fetch/search is insufficient.
6. **Parallel exploration** → `Agent` with `Explore` (research) or `agenthub` (competing implementations).
7. **Memory / convention drift** → `claude-md-management:revise-claude-md` or `si:promote`.
8. **Before claiming "done"** → `superpowers:verification-before-completion`.

When in doubt, **prefer cheaper tools first**, escalate only when needed.
