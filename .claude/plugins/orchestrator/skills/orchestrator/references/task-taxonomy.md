# Task Taxonomy — orchestrator skill

> Tassonomia degli assi di classificazione con team raccomandato per ogni foglia.
> Riferimento primario per Step 1 e Step 2 di SKILL.md.

## Assi di classificazione

```
stack    × domain × action × complexity
  |          |       |          |
  v          v       v          v
next      frontend  create    simple
vite-spa  backend   fix       complex
ui-lib    fullstack refactor
config    devops    audit
cross
```

---

## Foglie ad alta frequenza

### 1. `stack=next / domain=frontend / action=create / complexity=simple`

**Esempio**: "crea pagina /about statica in web-next"

Caratteristiche:
- File: 1 page component (`app/about/page.tsx`), eventualmente 1 CSS block in `globals.css`
- Nessuna business logic, nessun route handler
- Nessun form con validazione complessa

**Team consigliato (Depth-1, 3 varianti)**:
- Variant A — `engineering-skills:senior-frontend` (RSC-first: Server Component puro, metadata, accessibilità)
- Variant B — `frontend-design:frontend-design` (design-system-first: HeroUI/tw-ui tokens, visual hierarchy)
- Variant C — `engineering-skills:senior-fullstack` (pragmatic-full: metadata + error boundary + loading.tsx)

**Judge focus**: TypeScript strictness + accessibilità ARIA + convention adherence Next.js App Router.

---

### 2. `stack=next / domain=frontend / action=create / complexity=complex`

**Esempio**: "crea pagina /dashboard con grafici e dati aggregati dalle experience"

Caratteristiche:
- File: page, loading, error, eventualmente layout locale, 1+ server action, 1+ schema
- Aggregazione dati, charting library, stato locale
- Potenziale impatto su `packages/ui`

**Team consigliato (Depth-2, 3 mini-team)**:
- Variant A — lead: `engineering-skills:senior-architect` + sub: `engineering-skills:senior-frontend` + `engineering-skills:senior-qa`
- Variant B — lead: `engineering-skills:senior-frontend` + sub: `ui-ux-pro-max` + `engineering-skills:senior-fullstack`
- Variant C — lead: `engineering-skills:tdd-guide` + sub: `engineering-skills:senior-frontend` + `engineering-advanced-skills:api-design-reviewer`

**Judge focus**: data fetching strategy correctness, type safety of aggregated data, test coverage, UX/loading states.

---

### 3. `stack=next / domain=backend / action=create / complexity=simple`

**Esempio**: "crea endpoint GET /api/experiences/stats"

Caratteristiche:
- 1 route handler, 1 zod schema (o estensione di `bookingSchemas.ts`), 1 test
- Nessuna auth gate nuova, nessun ordine store modificato

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-backend` (validation-first: zod schema → handler → response shape)
- Variant B — `engineering-advanced-skills:api-design-reviewer` (contract-first: OpenAPI shape → implementation)
- Variant C — `engineering-skills:tdd-guide` (test-first: test file → implementation → schema)

**Judge focus**: zod coverage completa, response shape consistente con `/api/quote`, idempotency se applicabile, errori 4xx espliciti.

---

### 4. `stack=next / domain=backend / action=fix / complexity=simple`

**Esempio**: "fixa endpoint /api/checkout che ritorna 500 su promoCode invalido"

Caratteristiche:
- Root cause probabilmente in `pricing.ts` o `bookingSchemas.ts`
- Fix < 10 righe, 1 test aggiunto

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-backend` (minimal-diff-first: identifica root cause, fix mirato)
- Variant B — `engineering-skills:tdd-guide` (TDD-led: scrivi test failing, poi fix)
- Variant C — `engineering-skills:adversarial-reviewer` (refactor-opportunity: fix + hardening)

**Judge focus**: root cause addressed, nessuna regressione, test aggiunto, diff minimo.

---

### 5. `stack=next / domain=fullstack / action=create / complexity=complex`

**Esempio**: "aggiungi flusso di cancellazione prenotazione con email di conferma"

Caratteristiche:
- Route handler + server action + schema + modifica order store + eventualmente nuova pagina
- Tocca `lib/orders.ts`, `lib/bookingSchemas.ts`, `app/api/*`, `app/confirmation/*`

**Team consigliato (Depth-2)**:
- Variant A — lead: `engineering-skills:senior-fullstack` + sub: `engineering-skills:senior-backend` + `engineering-skills:senior-qa`
- Variant B — lead: `engineering-skills:senior-architect` + sub: `engineering-skills:senior-frontend` + `engineering-skills:senior-backend`
- Variant C — lead: `engineering-skills:tdd-guide` + sub: `engineering-skills:senior-fullstack` + `engineering-skills:senior-security`

**Judge focus**: idempotency preserved, MVP guard rispettata, schema zod completo, test coverage su path critici.

---

### 6. `stack=vite-spa / domain=frontend / action=create / complexity=simple`

**Esempio**: "aggiungi sezione 'Certificazioni' alla home di apps/docs"

Caratteristiche:
- 1 nuovo `Section.tsx` in `apps/docs/src/components/sections/`
- Aggiornamento i18n su TUTTE e 3 le locale
- Nessun nuovo store slice

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-frontend` (component-structure-first)
- Variant B — `frontend-design:frontend-design` (visual-design-first, framer-motion aware)
- Variant C — `engineering-skills:epic-design` (cinematic/scrollytelling angle se la sezione lo merita)

**Judge focus**: i18n parity (en/it/fr), TypeScript strict, Tailwind v4 (no v3 syntax), Framer Motion reduced-motion respected.

---

### 7. `stack=vite-spa / domain=frontend / action=fix / complexity=simple`

**Esempio**: "fixa il locale switcher che non persiste su reload"

Caratteristiche:
- Bug in `apps/docs/src/` (locale, Redux, routing)
- Root cause in ≤ 2 file
- Test vitest esistente o da aggiungere

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-frontend` (minimal-diff)
- Variant B — `engineering-skills:tdd-guide` (test-first)
- Variant C — `engineering-skills:senior-fullstack` (root-cause investigation + fix)

---

### 8. `stack=ui-lib / domain=frontend / action=create / complexity=simple`

**Esempio**: "crea AppDialog wrappando HeroUI Modal"

Caratteristiche:
- 1 file in `packages/ui/src/components/heroui/`
- Export in `packages/ui/src/index.ts`
- 1 Storybook story, eventualmente 1 unit test

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-frontend` (API design + a11y)
- Variant B — `ui-ux-pro-max` (design system consistency, token usage)
- Variant C — `apple-hig-expert:apple-hig-expert` (se targeting Apple-like polish — altrimenti sostituire con `engineering-skills:senior-qa`)

**Agent specializzato pre-esistente**: `ui-component-author` da AGENTS.md — usare quello direttamente se il task è esclusivamente un componente UI, senza competition necessaria.

---

### 9. `stack=vite-spa / domain=fullstack / action=refactor / complexity=complex`

**Esempio**: "refactora il Redux store di apps/docs separando portfolio slice da github slice"

Caratteristiche:
- Tocca store, API slice, component consumers
- Rischio regressione alto
- Test da aggiornare

**Team consigliato (Depth-2)**:
- Variant A — lead: `engineering-skills:senior-architect` + sub: `engineering-skills:senior-frontend` + `engineering-skills:senior-qa`
- Variant B — lead: `engineering-skills:senior-fullstack` + sub: `engineering-skills:tdd-guide` + `engineering-skills:adversarial-reviewer`
- Variant C — lead: `engineering-skills:tech-stack-evaluator` + sub: `engineering-skills:senior-frontend` + `engineering-skills:senior-backend`

---

### 10. `stack=config / domain=devops / action=audit / complexity=simple`

**Esempio**: "audit della Turbo pipeline per trovare task ridondanti"

Caratteristiche:
- Solo lettura di `turbo.json`, `package.json` scripts, Vite config
- Output: lista di findings + suggested fixes in `_followup.md`

**Team consigliato (Depth-1)**:
- Variant A — `engineering-skills:senior-architect` (dependency graph analysis)
- Variant B — `engineering-skills:tech-stack-evaluator` (build tool best practices)
- Variant C — `engineering-skills:adversarial-reviewer` (find failure modes nel pipeline)

**Nota**: per audit di deploy config, preferire `deploy-warden` da AGENTS.md.

---

### 11. `stack=cross / domain=fullstack / action=create / complexity=complex`

**Esempio**: "aggiungi un componente AppChart a packages/ui, usarlo in apps/web-next dashboard, testarlo"

Caratteristiche:
- Tocca `packages/ui` + `apps/web-next` (2 workspace)
- Richiede build UI prima del consumer
- Test sia in `packages/ui` che in `apps/web-next`

**Team consigliato (Depth-2)**:
- Variant A — lead: `engineering-skills:senior-architect` + sub: `engineering-skills:senior-frontend` + `ui-ux-pro-max`
- Variant B — lead: `engineering-skills:senior-fullstack` + sub: `engineering-skills:senior-frontend` + `engineering-skills:senior-qa`
- Variant C — lead: `engineering-skills:tdd-guide` + sub: `engineering-skills:senior-frontend` + `engineering-advanced-skills:api-design-reviewer`

**Gotcha critico da includere nei prompt**: `packages/ui` non può importare da `apps/*`. Build UI richiesta prima del consumer prod build.

---

## Matrice rapida depth × specialisti

| Complexity | Max specialists attivi | Worktrees | Token cost (stima) |
|---|---|---|---|
| simple → Depth-1 | 3 (1 per variant) | 3 | ~3× single-agent |
| complex → Depth-2 | 9 (3 per variant) | 3 | ~9× single-agent |

**Regola d'oro**: se il dubbio è simple vs complex, chiedere all'utente oppure partire con Depth-1 + adversarial reviewer. Il costo di Depth-2 su un task simple non è mai giustificato.
