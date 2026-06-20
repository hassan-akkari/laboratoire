# Specialist Roster — orchestrator skill

> Tabella di riferimento per scegliere gli specialist giusti nella competition.
> Ogni riga: quando usare, quando NON usare, con chi accoppiare, trigger phrase.

| Specialist | Usa quando | NON usare quando | Accoppia con | Trigger phrase |
|---|---|---|---|---|
| `engineering-skills:senior-frontend` | React component design, Next.js pages, Tailwind, accessibilità, Framer Motion, HeroUI | Task puramente backend senza UI | `ui-ux-pro-max`, `engineering-skills:senior-qa` | "crea componente / pagina / sezione" |
| `engineering-skills:senior-backend` | REST handler, zod validation, auth, session, in-memory store, idempotency | Task UI-only, nessun server code | `engineering-skills:senior-qa`, `engineering-advanced-skills:api-design-reviewer` | "crea / fixa endpoint / route handler / API" |
| `engineering-skills:senior-fullstack` | Task cross-cutting che toccano sia UI che server, scaffolding iniziale, root-cause investigation, code quality audit | Specializzazione profonda richiesta su uno solo dei lati | `engineering-skills:senior-architect`, `engineering-skills:tdd-guide` | "feature completa end-to-end" |
| `engineering-skills:senior-qa` | Generare test vitest/RTL/Playwright, coverage analysis, trovare edge case non testati, a11y check | Come lead architect — è un enhancer, non un designer | `engineering-skills:tdd-guide`, qualsiasi lead architect | "scrivi test per / aggiungi copertura a" |
| `engineering-skills:senior-security` | Code-level security review, input validation, XSS/CSRF/injection, cookie security | Task puramente infra | `engineering-skills:senior-backend`, `engineering-skills:adversarial-reviewer` | "security review / audit sicurezza" |
| `engineering-skills:senior-secops` | Threat modeling, hardening infra/CI, secrets management, OWASP scan — **solo come sub** | Come variant lead; task puramente UI | `engineering-skills:senior-security`, `engineering-skills:senior-backend` | "verifica sicurezza / hardening / secrets" |
| `engineering-skills:senior-architect` | Decisioni architetturali, module boundaries, data flow design, cross-workspace refactor (lead di *design*) | Task semplici con soluzione ovvia; implementazione diretta (usa senior-fullstack) | `engineering-skills:senior-fullstack`, `engineering-skills:tech-stack-evaluator` | "come strutturare / architettare / disegnare" |
| `engineering-skills:tech-stack-evaluator` | Valutare se aggiungere una dependency, confrontare approcci, audit build config | Implementazione diretta; decisioni *strutturali* in-repo (usa senior-architect) | `engineering-skills:senior-architect` | "vale la pena usare X? / confronta A vs B" |
| `engineering-skills:tdd-guide` | Variant lead TDD-oriented, red-green-refactor rigoroso, test-first design | Task audit-only o pure refactor senza nuovi test | `engineering-skills:senior-frontend`, `engineering-skills:senior-backend` | "test-first / TDD / scrivi test prima" |
| `engineering-skills:adversarial-reviewer` | Post-competition critical pass, trovare failure mode nella soluzione winner, bug hunting | Come variant lead di una variante **costruttiva** (è un reviewer, non un builder) | Qualsiasi winner post-competition | "adversarial review / cerca problemi in" |
| `engineering-advanced-skills:api-design-reviewer` | Review forma di un'API prima o dopo implementazione, response shape, error codes, versioning | Implementazione diretta | `engineering-skills:senior-backend` | "review API / contract / response shape" |
| `ui-ux-pro-max` | **Design system** (token consistency, component API, visual hierarchy, HeroUI theming) **+ UX** (user flow, usability, information architecture, form UX, accessibilità) | Decisioni puramente di codice backend | `engineering-skills:senior-frontend`, `frontend-design:frontend-design` | "design system / token / tema / UX / user flow / accessibilità" |
| `frontend-design:frontend-design` | Pagine e componenti con forte identità visiva, non-AI-aesthetic | Task backend o infra; wrapper/primitive utilitari (usa senior-frontend + ui-ux-pro-max) | `engineering-skills:epic-design`, `ui-ux-pro-max` | "pagina distintiva / non generica / design forte" |
| `engineering-skills:epic-design` | Cinematic 2.5D, scrollytelling, parallax, hero animations con framer-motion — **opt-in, solo intento visivo forte** | Componenti utilitari o sezioni ordinarie senza scrollytelling (collassa su frontend-design) | `frontend-design:frontend-design`, `engineering-skills:senior-frontend` | "effetto cinematico / scrollytelling / hero animation" |
| `apple-hig-expert:apple-hig-expert` | Liquid Glass polish, Apple HIG compliance, visionOS/iOS targeting — **opt-in, solo se target Apple** | Qualsiasi task non orientato a piattaforme Apple (default: sostituire con senior-qa) | `ui-ux-pro-max` | "HIG / Liquid Glass / Apple polish" |

> **Rimossi dal roster (2026-06-20, roster assessment):** `rag-architect`, `agent-designer`, `senior-ml-engineer`, `senior-data-engineer`, `senior-data-scientist`, `senior-prompt-engineer` — zero superficie in un monorepo frontend (3 app + UI-lib) + booking MVP. Reintrodurre **solo** se emerge un task reale AI/RAG/ML/data/prompt.

---

## Accoppiamenti ottimali per task type nel repo

| Task type nel repo | Variant A lead | Variant B lead | Variant C lead |
|---|---|---|---|
| Crea page in `apps/web-next` | `senior-frontend` | `frontend-design` | `senior-fullstack` |
| Crea endpoint in `apps/web-next` | `senior-backend` | `api-design-reviewer` | `tdd-guide` |
| Fixa bug in `apps/web-next` | `senior-backend` | `tdd-guide` | `senior-fullstack` (root-cause) |
| Crea componente in `packages/ui` | `senior-frontend` | `ui-ux-pro-max` | `senior-qa` |
| Crea sezione in `apps/docs` | `senior-frontend` | `frontend-design` | `epic-design` *(solo se scrollytelling/hero; altrimenti `senior-qa`)* |
| Refactor cross-workspace | `senior-architect` | `senior-fullstack` | `tech-stack-evaluator` |
| Audit sicurezza `web-next` | `senior-security` | `senior-fullstack` *(+ `senior-secops` sub)* | `adversarial-reviewer` *(audit-context)* |
| Feature FS complessa | `senior-architect` | `senior-fullstack` | `tdd-guide` |

> **Adversarial-reviewer come post-pass:** per "Fixa bug" e ogni task costruttivo, l'adversarial-reviewer NON è un lead — gira come pass post-competition sul winner (vedi SKILL.md Step 4 / G4).

---

## Chi non usare come variant lead

- `adversarial-reviewer` — mai lead di una variante **costruttiva** (build/fix). Eccezione: task **audit-only** (es. "Audit sicurezza", "Audit config") dove *trovare problemi* È il deliverable — lì può guidare.
- `senior-secops` — ottimo sub, mai lead: troppo orientato alla threat-analysis rispetto alla produzione di codice. In "Audit sicurezza" entra come sub sotto `senior-security`.
- `apple-hig-expert` — solo se il task target esplicitamente HIG / Liquid Glass / Apple platform; altrimenti default `senior-qa`.
- `epic-design` — solo se la sezione/pagina ha intento scrollytelling/cinematic; per sezioni ordinarie collassa su `frontend-design` (non usarli entrambi nello stesso triple).

## Note su overlap (evita varianti ridondanti)

- **`senior-architect` vs `senior-fullstack`:** architect = lead di *design/struttura*; fullstack = lead di *implementazione* end-to-end. Non metterli come A/B con lo stesso mandato.
- **`senior-architect` vs `tech-stack-evaluator`:** tech-stack-evaluator solo per decisioni *dipendenza/tooling* (A-vs-B, "vale la pena X"); per scelte strutturali in-repo usa architect.
- **`frontend-design` / `ui-ux-pro-max` / `senior-frontend`** su un *wrapper* `packages/ui`: senior-frontend (API + a11y) primario, ui-ux-pro-max (tokens/design-system); `frontend-design` aggiunge poco a una primitive (il suo valore è a livello di pagina).
