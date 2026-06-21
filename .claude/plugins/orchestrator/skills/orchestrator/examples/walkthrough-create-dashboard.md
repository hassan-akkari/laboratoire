# Walkthrough: "crea pagina /dashboard con grafici per i tuoi 3 apps"

> ⚠️ **v1 command forms — superseded.** This walkthrough still shows the pre-v2 agenthub vocabulary (`--name`, `--criteria`, numeric judge scores, `agenthub:merge --winner`). For the real, current contract see `references/agenthub-contract.md` and `references/execution-modes.md`. A v2 rewrite of this example is deferred to Phase 2.

> Narrazione end-to-end di come l'orchestrator gestisce questo task reale.
> Mostra ogni step: classificazione, decisioni, config agenthub, winner, adversarial pass.

---

## Input ricevuto

```
"crea pagina /dashboard con grafici per i tuoi 3 apps"
```

---

## Step 1 — Classificazione

L'orchestrator analizza la richiesta:

**Stack resolution**:
- "per i tuoi 3 apps" → il task è potenzialmente `cross`
- Ma "grafici" + "dashboard" in un'architettura MVP → meglio circoscrivere
- `apps/web-next` è l'unica con un backend reale (in-memory orders); è la candidata naturale per una dashboard significativa
- `apps/docs` è un portfolio Vite SPA — una dashboard non ha senso lì
- `apps/web-react` è una reference app Redux/MSW — potrebbe ospitare una dashboard Redux, ma il task dice "grafici" il che implica dati aggregati reali

**Decisione stack**: `next` (apps/web-next è il target primario)

**Domain**: `frontend` con sfumatura `fullstack` (la dashboard deve aggregare dati dall'order store)

**Action**: `create`

**Complexity analysis**:
- File stimati: `app/dashboard/page.tsx` + `app/dashboard/loading.tsx` + eventualmente un server action o utility di aggregazione + un test → ≥ 4 file
- Nuova dependency per charting? Probabile (nessuna chart library nel repo)
- Tocca il domain model (orders) → business logic
- Decisione architetturale: SSR vs client-side chart? fetch strategy?

**Conclusione**: `complexity = complex` → **Depth-2 (mini-team variants)**

**Classificazione finale**:
```yaml
stack: next
domain: fullstack
action: create
complexity: complex
target: apps/web-next
page_route: /dashboard
```

---

## Step 2 — Notare i gotcha prima del lancio

Prima di procedere, l'orchestrator identifica i gotcha rilevanti da CLAUDE.md:

1. **Gotcha #6**: orders store è in-memory su globalThis — i dati dashboard vengono da lì, ma muoiono a ogni restart. La dashboard deve mostrare "dati sessione corrente" e dirlo chiaramente nell'UI.
2. **Nessuna chart library installata**. Dipendenza da aggiungere. Candidati: `recharts` (React 19 compat), `chart.js` + `react-chartjs-2`, oppure SVG grezzo. Questo va flaggato nelle varianti.
3. **`apps/web-next` non ha Tailwind**. CSS via `globals.css` con classi `.card`, `.cards-grid`, ecc.
4. **`pnpm onlyBuiltDependencies`** in `package.json:42-46`. Una chart library nativa non si installerebbe senza aggiungerla lì. Da notare.
5. **`app/dashboard/` non è protetta dal middleware** (che protegge solo `/checkout/:path*` e `/api/checkout`). Decidere se la dashboard va protetta o è pubblica.

L'orchestrator può chiedere chiarimento all'utente su:
- Chart library preference (o lasciare alle varianti di proporne una)?
- Dashboard protetta da auth gate?

Assumendo che l'utente voglia procedere autonomamente: le varianti ricevono queste decisioni aperte con istruzione di proporre la loro scelta e giustificarla.

---

## Step 3 — Acceptance criteria derivati

```
1. Pagina /dashboard esiste in apps/web-next e risponde senza errori
2. Mostra almeno 2 metriche aggregate: total orders, total revenue
3. Almeno 1 grafico visivo (tipo a scelta della variante)
4. Loading state presente (loading.tsx)
5. Gestisce il caso zero-orders gracefully
6. TypeScript strict: no errori, no any
7. pnpm check passa
8. Non rompe le route esistenti (/, /cart, /checkout, /confirmation)
9. Aggiunge 1 dependency al massimo e la giustifica
10. Nota nell'UI che i dati sono in-memory (session-only)
```

---

## Step 4 — Init agenthub session

```bash
agenthub:init \
  --name "create-page-dashboard" \
  --agents 3 \
  --base-branch main
```

---

## Step 5 — Variant prompts (Depth-2: ogni variante è un mini-team)

### Variant A — Architecture-first mini-team

**Lead**: `engineering-skills:senior-architect`
**Sub-specialists** (chiamati internamente via Agent tool):
- `engineering-skills:senior-frontend` (implementazione page component)
- `engineering-skills:senior-qa` (test della logica di aggregazione)

**Prompt Variant A** (estratto, self-contained):

```
You are a senior architect leading a mini-team to implement /dashboard in
apps/web-next. You will internally coordinate two sub-specialists (frontend
for the component, QA for the test). Your perspective: clean architecture
first — get the data aggregation layer right before touching the UI.

TASK: Create /dashboard page in apps/web-next showing order metrics and charts.

ACCEPTANCE CRITERIA:
[... i 10 criteri sopra ...]

REPO CONTEXT:
- apps/web-next: Next.js 16 App Router, no Redux, no Tailwind
- Order store: apps/web-next/lib/orders.ts — getOrderById, processCheckout.
  Note: no getAll function exists yet. You may need to add one.
  Store is globalThis.__bookingOrderStore__ with 6h TTL. MVP-ONLY.
- CSS: apps/web-next/app/globals.css — use existing classes
- No chart library installed. Propose ONE addition and justify it.
- pnpm onlyBuiltDependencies restriction — chart library should be pure JS
- Auth: /dashboard is currently unprotected. Decide and state your choice.

FORBIDDEN:
[... forbidden actions standard ...]

ARCHITECTURE MANDATE:
1. Design a getDashboardStats() function in apps/web-next/lib/stats.ts
   that reads from the order store and returns typed aggregated data.
2. Page component is a Server Component that calls getDashboardStats().
3. Charts are Client Components ("use client") receiving typed data as props.
4. loading.tsx handles the async boundary.
5. Coordinate internally: frontend sub-specialist implements the component,
   QA sub-specialist writes stats.test.ts.

DELIVERABLE:
- apps/web-next/lib/stats.ts (getDashboardStats function + types)
- apps/web-next/lib/stats.test.ts
- apps/web-next/app/dashboard/page.tsx (Server Component)
- apps/web-next/app/dashboard/loading.tsx
- apps/web-next/app/dashboard/Charts.tsx (Client Component, "use client")
- Proposed chart dependency with justification
- Atomic commit message
```

---

### Variant B — UX/Design-first mini-team

**Lead**: `engineering-skills:senior-frontend`
**Sub-specialists**:
- `ui-ux-pro-max` (UX layout e information architecture)
- `engineering-skills:senior-fullstack` (data layer)

**Prompt Variant B** (estratto):

```
You are a senior frontend engineer leading a mini-team. Your perspective:
the dashboard should be the most useful and readable page in the app —
get the UX and information hierarchy right, then wire the data.

TASK: [stesso di Variant A]

UX MANDATE:
1. Define the information hierarchy: what metrics matter most for a booking app?
2. Layout should be scannable in <5 seconds.
3. Use existing CSS class patterns from globals.css (.card, .cards-grid, etc.)
4. Graceful empty state is first-class, not an afterthought.
5. In-memory data disclaimer is visible but unobtrusive.

MINI-TEAM COORDINATION:
- UX sub-specialist: define the dashboard layout and component hierarchy first
- Fullstack sub-specialist: implement getDashboardStats() and wire the data
- You (lead): implement the page and Charts components

[... resto del contesto repo e forbidden actions ...]
```

---

### Variant C — TDD-first mini-team

**Lead**: `engineering-skills:tdd-guide`
**Sub-specialists**:
- `engineering-skills:senior-frontend` (implementazione dopo i test)
- `engineering-advanced-skills:api-design-reviewer` (review della stats API shape)

**Prompt Variant C** (estratto):

```
You are a TDD lead for a mini-team. Write tests for the data aggregation
logic BEFORE implementing anything. The frontend implementation follows
from the types that emerge from the tests.

MINI-TEAM COORDINATION:
1. You write stats.test.ts first.
2. API reviewer sub-specialist reviews the getDashboardStats() return type.
3. Frontend sub-specialist implements components from the agreed types.

[... resto del contesto ...]
```

---

## Step 6 — Run e monitoring

```bash
agenthub:run
# 3 worktrees paralleli, ognuno con il suo mini-team
# Stima durata: 8-15 minuti (Depth-2, mini-teams)

agenthub:status  # check progress
agenthub:board   # vedere output parziale
```

---

## Step 7 — Valutazione

```bash
agenthub:eval \
  --criteria "
    correctness: 30
    ts_strictness: 25
    ux_accessibility: 20
    test_coverage: 15
    convention: 10
  "
```

**Scenario ipotetico di output judge**:

| Variant | Correctness | TS | UX | Tests | Conv | Totale |
|---|---|---|---|---|---|---|
| A (arch-first) | 27/30 | 24/25 | 15/20 | 14/15 | 9/10 | **89/100** |
| B (ux-first) | 25/30 | 22/25 | 19/20 | 10/15 | 9/10 | **85/100** |
| C (tdd-first) | 28/30 | 25/25 | 12/20 | 15/15 | 8/10 | **88/100** |

**Winner ipotetico**: Variant A (89/100)

Variant A vince per: architettura pulita stats.ts + piena TypeScript compliance + buon UX. Variant C è vicina ma perde sull'UX. Variant B ha il migliore UX score ma la test coverage è inferiore.

---

## Step 8 — Adversarial pass

```bash
# Lancio adversarial reviewer sul diff di Variant A
engineering-skills:adversarial-reviewer

Prompt:
"Review the /dashboard implementation in apps/web-next (Variant A winner).

Specifically check:
1. Does getDashboardStats() handle the case where globalThis.__bookingOrderStore__
   is undefined (fresh server start)? Is it safe to call getOrderStore() there?
2. Does the Charts Client Component receive only serializable props (no Map, no Date)?
   Next.js cannot serialize these across the server/client boundary.
3. Is the 'in-memory data' disclaimer actually visible in the UI?
4. Does loading.tsx render something meaningful or is it just a spinner with no
   context?
5. Does the chart library dependency satisfy the pnpm onlyBuiltDependencies
   restriction? (pure JS = no native build step required)
6. Are there any TypeScript any escapes in the charts integration?
7. Does the commit message satisfy the atomic commit rule — one logical change?"
```

**Ipotetico finding dell'adversarial reviewer**:

> **CRITICAL**: Charts.tsx passes `Date` objects as props to a Client Component.
> Next.js will throw "Error: Date cannot be passed as props" at runtime.
> Fix: serialize to ISO string in the server component, parse in the client.
>
> **MEDIUM**: getDashboardStats() calls getOrderStore() which modifies globalThis.
> On a cold start with no orders, this is fine, but the function returns `stats`
> without handling the case where the store cleanup runs mid-request.
> Mitigation: snapshot the store.orders Map before iterating.
>
> **LOW**: The in-memory disclaimer is in a `.notice` class element below the fold
> on mobile. Consider moving it to a top banner.

Questi finding vengono applicati prima del merge come un ulteriore commit di fixup, oppure (se minori) come voci in `_followup.md`.

---

## Step 9 — Merge

```bash
# Fix applicati sui finding CRITICAL e MEDIUM
agenthub:merge --winner A

# Commit 1 (atomic): feat(web-next): add /dashboard page with order metrics
# Commit 2 (se followup entries): docs(claude): log dashboard followup observations
```

---

## Riepilogo decisioni prese dall'orchestrator

| Decisione | Scelta | Rationale |
|---|---|---|
| Target app | `apps/web-next` | Unica con domain model reale (orders) |
| Depth | 2 (mini-team) | ≥ 4 file, decisione architetturale, nuova dependency |
| Chart library | proposta alle varianti | Nessuna installata, scelta dipende dal trade-off size vs API |
| Auth gate | lasciato alle varianti di decidere | Non bloccante, reversibile |
| Stats function | `lib/stats.ts` separato | Separation of concerns, testabile in isolamento |
| Adversarial pass | sì (complexity=complex) | Sempre raccomandato per Depth-2 |
