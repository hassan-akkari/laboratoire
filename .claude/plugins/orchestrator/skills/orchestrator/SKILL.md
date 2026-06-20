---
name: orchestrator
description: Use when the user asks to create, fix, refactor, or audit a feature, page, endpoint, component, or config in this monorepo and wants automatic team assembly with competitive variant selection via agenthub. Accepts a runtime mode (interactive | unattended); defaults to interactive. Do NOT use for single-character fixes, content-only edits, or tasks resolvable with one inline edit.
version: "2.0.0"
author: Hassan Akkari
created: 2026-05-08
updated: 2026-06-20
modes: [interactive, unattended]
requires:
  agenthub: [init, spawn, eval, merge, run, status, board]
  post-competition: engineering-skills:adversarial-reviewer
  planning: superpowers:writing-plans
repo_context: c:/dev/laboratoire — canonical context in .claude/CLAUDE.md
---

# Skill: orchestrator

Dato un task in linguaggio naturale (IT o EN), questo skill:

1. **Classifica** il task sugli assi: stack, dominio, azione, complessità.
2. **Seleziona** depth e team composition per la competition.
3. **Configura e lancia** un agenthub session in worktrees git isolati.
4. **Giudica** il winner con criteri specifici per il task type.
5. Esegue un **adversarial pass** post-competition (raccomandato per task complex).

---

## Flowchart

```
INPUT: task description (IT/EN free text)
   |
   v
[1. CLASSIFY: stack / domain / action / complexity]
   |
   v
[Out-of-scope?] --YES--> handle inline
   |
   NO
   v
[complexity == simple?]
   |              |
   YES            NO
   v              v
[DEPTH-1]    [DEPTH-2]
3 lone        3 mini-team variants
specialists   each spawns 2-3
competing     sub-specialists via Agent
   |              |
   +------+-------+
          v
[agenthub:init]
[agenthub:run (N variants)]
[agenthub:eval (judge)]
          |
          v
[adversarial-reviewer pass on winner diff]
          |
          v
[agenthub:merge winner + atomic commit]
```

---

## Step 0 — Resolve execution mode (do this FIRST)

Inspect the args for a mode keyword (see `references/execution-modes.md`):

- `mode=unattended`, `--unattended`, "unattended", "headless", "non-interactive" → **MODE = unattended**
- `mode=interactive`, `--interactive`, "interactive", "ask me" → **MODE = interactive**
- no keyword → **MODE = interactive** (fail-safe default)

Strip the mode keyword from the args; the remainder is the task description.

MODE governs three switches for the rest of this skill: human gates (interactive
asks/confirms; unattended treats any "ask the human" branch as ABORT), write
ceiling (interactive merges after approval; unattended commits-to-branch and
STOPS), and failure (interactive surfaces & waits; unattended aborts clean +
notifies). Note the run start time for the wall-clock cost backstop. Whatever the
outcome, Step 6 writes a run-log record and Step 7 notifies.

---

## Step 1 — Classification

Read the task and fill this mental YAML:

```yaml
stack:    # next | vite-spa | ui-lib | config | cross
domain:   # frontend | backend | fullstack | devops
action:   # create | refactor | fix | audit
complexity: # simple | complex
```

**Confidence.** Also emit a confidence level for the classification: `high` /
`med` / `low`. If you cannot confidently fix stack/domain/action/complexity →
confidence = low → **unresolved failure**: interactive asks the user; unattended
ABORTS + notifies (Steps 6–7). Record the confidence in the run-log.

### Stack resolution rules

| Trigger phrase / path hint | stack |
|---|---|
| "pagina /…", "route /app/…", "server action", "app router", `apps/web-next` | `next` |
| "componente React", "Redux", "MSW", `apps/web-react`, `apps/docs` | `vite-spa` |
| "componente condiviso", "HeroUI wrapper", "Storybook", `packages/ui` | `ui-lib` |
| "turbo", "eslint config", "tsconfig", `vercel.json`, "pnpm" | `config` |
| task tocca 2+ stack sopra | `cross` |

### Complexity heuristics

**simple** if ALL of:
- File count stimato ≤ 3
- Nessuna nuova dipendenza introdotta
- Nessun cambio cross-workspace
- Nessuna business logic con edge case multipli

**complex** if ANY of:
- File count stimato ≥ 4
- Introduce nuova route + schema + handler + test
- Tocca 2+ workspace (e.g., `packages/ui` + `apps/web-next`)
- Richiede decisioni architetturali (state shape, data fetching strategy)
- Business logic con promo/pricing/auth ramificazioni

---

## Step 2 — Depth selection

| Depth | Quando | Struttura competition |
|---|---|---|
| **1 (lone specialists)** | complexity = simple | 3 varianti, ognuna condotta da un singolo specialist con prospettiva diversa |
| **2 (mini-teams)** | complexity = complex | 3 varianti, ognuna con un lead + 2-3 sub-specialist chiamati via `Agent` tool internamente |

**Regola dei costi**: Depth-2 ≈ 3-4× il costo di Depth-1. Se il task è
ambiguamente simple/complex:
- **interactive** → chiedi chiarimento all'utente.
- **unattended** → NON abortire: declassa a **Depth-1 + adversarial pass**
  (cost-safe default). Questo è l'unico trigger di failure che in unattended NON
  porta ad abort.

---

## Step 3 — Variant assembly

Per ogni stack+action, il roster di specialisti è definito in `references/task-taxonomy.md`. Regole generali:

- Variant A: **approccio architetturale dominante** (es. schema-first, RSC-first)
- Variant B: **approccio opposto** (es. handler-first, forms-first)
- Variant C: **approccio qualità/test** (TDD-led, type-safety-first)

Ogni variante riceve un **prompt self-contained** che include:
- Il task completo con acceptance criteria
- Il repo context estratto da CLAUDE.md (stack, gotchas rilevanti, conventions)
- Il suo ruolo e prospettiva specifica
- La lista `forbidden_actions` del repo applicabile

---

## Step 4 — agenthub session

```text
# Init
agenthub:init  --name "<task-slug>"  --agents <N>  --base-branch main

# Spawn e configura ogni variante
agenthub:spawn  --variant A  --prompt "<variant-A-prompt>"
agenthub:spawn  --variant B  --prompt "<variant-B-prompt>"
agenthub:spawn  --variant C  --prompt "<variant-C-prompt>"

# Esegui in parallelo
agenthub:run

# Monitora
agenthub:status
agenthub:board

# Valuta con LLM judge
agenthub:eval  --criteria "<judge-criteria-for-this-task-type>"

# Fondi il winner
agenthub:merge  --winner <variant>
```

Template concreti per ogni task type in `templates/`.

---

## Step 5 — Judge criteria (per task type)

| Task type | Criteri primari (peso) | Criteri secondari |
|---|---|---|
| create-page | correctness 30% / TypeScript strictness 25% / UX/accessibility 20% / test coverage 15% / convention adherence 10% | Atomic commit-readiness |
| fix-bug | root cause addressed 35% / no regression 30% / minimal diff 20% / test added 15% | No silent failure swallowing |
| create-endpoint | validation completeness 30% / idempotency handling 25% / error response shape 20% / test coverage 15% / convention 10% | Security: no PII leak |
| refactor | convention adherence 30% / type safety gain 25% / diff minimality 20% / test retention 15% / reversibility 10% | No scope creep |
| audit | finding severity accuracy 35% / actionability 30% / completeness 25% / false positive rate 10% | Followup radar entries |

---

## Out-of-scope (non lanciare agenthub per questi)

- **Typo / one-word content edit** — inline edit diretto.
- **i18n copy update su una singola locale** — usa `portfolio-content-curator` da AGENTS.md (tutte e 3 le locale insieme).
- **Bump di una dipendenza isolata** — isola in un commit separato, nessuna competition utile.
- **Deploy config change** — usa `deploy-warden` da AGENTS.md.
- **Domande su come funziona il codice** — usa `Explore` sub-agent o `feature-dev:code-explorer`.
- **Bootstrap / CLAUDE.md update** — usa `claude-md-management:revise-claude-md`.

---

## Invarianti del repo da rispettare in ogni competition

Queste regole si applicano a **tutte** le varianti. Inserirle in ogni variant prompt.

1. `pnpm check` (lint + typecheck + test) deve passare.
2. Atomic commit: un task = un commit. Scope creep → `_followup.md`.
3. `web-next` non usa Redux; `docs`/`web-react` non usano Server Actions.
4. Nessun edit a mano di `pnpm-lock.yaml`. Se cambi deps/peerDeps/devDeps in qualsiasi `package.json`, esegui `pnpm install --no-frozen-lockfile` e includi il lock rigenerato nello **stesso commit** (`.npmrc` enforce `frozen-lockfile` in CI — separarli rompe la build).
5. `packages/ui` non importa da `apps/*` mai.
6. I18n: mai modificare una sola locale senza aggiornare le altre due.
7. Currency math: sempre via `roundCurrency()` in `lib/pricing.ts`.
8. `orders.ts`/`session.ts` hanno guard `MVP-ONLY` — non rimuovere senza approvazione esplicita.

---

## Riferimenti

- `references/task-taxonomy.md` — tassonomia completa con team raccomandato per leaf
- `references/specialist-roster.md` — tabella specialist con trigger/anti-trigger
- `templates/agenthub-session-create-page.md` — template concreto per "crea pagina"
- `templates/agenthub-session-fix-bug.md` — template concreto per "fixa bug"
- `templates/agenthub-session-create-endpoint.md` — template concreto per "crea endpoint"
- `examples/walkthrough-create-dashboard.md` — narrazione end-to-end di un task reale
