# Specialist Roster — orchestrator skill

> Tabella di riferimento per scegliere gli specialist giusti nella competition.
> Ogni riga: quando usare, quando NON usare, con chi accoppiare, trigger phrase.

| Specialist | Usa quando | NON usare quando | Accoppia con | Trigger phrase |
|---|---|---|---|---|
| `engineering-skills:senior-frontend` | React component design, Next.js pages, Tailwind, accessibilità, Framer Motion, HeroUI | Task puramente backend senza UI | `ui-ux-pro-max`, `engineering-skills:senior-qa` | "crea componente / pagina / sezione" |
| `engineering-skills:senior-backend` | REST handler, zod validation, auth, session, in-memory store, idempotency | Task UI-only, nessun server code | `engineering-skills:senior-qa`, `engineering-advanced-skills:api-design-reviewer` | "crea / fixa endpoint / route handler / API" |
| `engineering-skills:senior-fullstack` | Task cross-cutting che toccano sia UI che server, scaffolding iniziale, code quality audit | Specializzazione profonda richiesta su uno solo dei lati | `engineering-skills:senior-architect`, `engineering-skills:tdd-guide` | "feature completa end-to-end" |
| `engineering-skills:senior-qa` | Generare test vitest/RTL/Playwright, coverage analysis, trovare edge case non testati | Come lead architect — è un enhancer, non un designer | `engineering-skills:tdd-guide`, qualsiasi lead architect | "scrivi test per / aggiungi copertura a" |
| `engineering-skills:senior-secops` | Threat modeling, hardening infra/CI, secrets management, OWASP scan | Task puramente UI | `engineering-skills:senior-security`, `engineering-skills:senior-backend` | "verifica sicurezza / hardening / secrets" |
| `engineering-skills:senior-security` | Code-level security review, input validation, XSS/CSRF/injection, cookie security | Task puramente infra | `engineering-skills:senior-backend`, `engineering-skills:adversarial-reviewer` | "security review / audit sicurezza" |
| `engineering-skills:senior-architect` | Decisioni architetturali, module boundaries, data flow design, cross-workspace refactor | Task semplici con soluzione ovvia | `engineering-skills:senior-fullstack`, `engineering-skills:tech-stack-evaluator` | "come strutturare / architettare / disegnare" |
| `engineering-skills:tech-stack-evaluator` | Valutare se aggiungere una dependency, confrontare approcci, audit build config | Implementazione diretta | `engineering-skills:senior-architect` | "vale la pena usare X? / confronta A vs B" |
| `engineering-skills:adversarial-reviewer` | Post-competition critical pass, trovare failure mode nella soluzione winner, bug hunting | Come variant lead (è un reviewer, non un builder) | Qualsiasi winner post-competition | "adversarial review / cerca problemi in" |
| `engineering-skills:tdd-guide` | Variant lead TDD-oriented, red-green-refactor rigoroso, test-first design | Task audit-only o pure refactor senza nuovi test | `engineering-skills:senior-frontend`, `engineering-skills:senior-backend` | "test-first / TDD / scrivi test prima" |
| `ui-ux-pro-max` | Design token consistency, component API design, visual hierarchy, HeroUI theming | Decisioni puramente di codice backend | `engineering-skills:senior-frontend`, `apple-hig-expert:apple-hig-expert` | "design system / token / tema / coerenza visiva" |
| `ui-ux-pro-max` | User flow design, usability review, information architecture, form UX | Implementazione low-level | `ui-ux-pro-max`, `engineering-skills:senior-frontend` | "UX / user flow / accessibilità utente" |
| `apple-hig-expert:apple-hig-expert` | Liquid Glass polish, Apple HIG compliance, visionOS/iOS targeting | Qualsiasi task non orientato a piattaforme Apple | `ui-ux-pro-max` | "HIG / Liquid Glass / Apple polish" |
| `engineering-skills:epic-design` | Cinematic 2.5D, scrollytelling, parallax, hero animations con framer-motion | Componenti utilitari senza intento visivo forte | `frontend-design:frontend-design`, `engineering-skills:senior-frontend` | "effetto cinematico / scrollytelling / hero animation" |
| `frontend-design:frontend-design` | Pagine e componenti con forte identità visiva, non-AI-aesthetic | Task backend o infra | `engineering-skills:epic-design`, `ui-ux-pro-max` | "pagina distintiva / non generica / design forte" |
| `engineering-advanced-skills:api-design-reviewer` | Review forma di un'API prima o dopo implementazione, response shape, error codes, versioning | Implementazione diretta | `engineering-skills:senior-backend` | "review API / contract / response shape" |
| `engineering-advanced-skills:rag-architect` | Architettura RAG, retrieval pipeline, embedding + vector store | Qualsiasi task senza componente AI/RAG | `engineering-advanced-skills:agent-designer`, `engineering-skills:senior-ml-engineer` | "RAG / retrieval / embedding / knowledge base" |
| `engineering-advanced-skills:agent-designer` | Progettare agenti AI, tool selection, agentic loops | Qualsiasi task senza componente agentico | `engineering-advanced-skills:rag-architect`, `engineering-skills:senior-prompt-engineer` | "agent / agentic loop / tool use / orchestration" |
| `engineering-skills:senior-data-engineer` | ETL pipeline, data modeling, ingestion, transform | Task puramente UI o backend CRUD semplice | `engineering-skills:senior-data-scientist` | "pipeline dati / ETL / ingestion" |
| `engineering-skills:senior-data-scientist` | Analytics, metric design, statistical modeling | Implementazione engineering | `engineering-skills:senior-data-engineer`, `engineering-skills:senior-ml-engineer` | "analisi dati / metriche / modello statistico" |
| `engineering-skills:senior-ml-engineer` | ML model integration, inference pipeline, training loop | Task senza ML | `engineering-skills:senior-data-scientist`, `engineering-advanced-skills:rag-architect` | "ML / inference / training / modello" |
| `engineering-skills:senior-prompt-engineer` | Ottimizzare prompt LLM, system prompt design, eval harness | Task senza LLM | `engineering-advanced-skills:agent-designer` | "prompt / system prompt / LLM eval" |

---

## Accoppiamenti ottimali per task type nel repo

| Task type nel repo | Variant A lead | Variant B lead | Variant C lead |
|---|---|---|---|
| Crea page in `apps/web-next` | `senior-frontend` | `frontend-design` | `senior-fullstack` |
| Crea endpoint in `apps/web-next` | `senior-backend` | `api-design-reviewer` | `tdd-guide` |
| Fixa bug in `apps/web-next` | `senior-backend` | `tdd-guide` | `adversarial-reviewer` (solo review, non lead) |
| Crea componente in `packages/ui` | `senior-frontend` | `ui-design-system` | `senior-qa` |
| Crea sezione in `apps/docs` | `senior-frontend` | `frontend-design` | `epic-design` |
| Refactor cross-workspace | `senior-architect` | `senior-fullstack` | `tech-stack-evaluator` |
| Audit sicurezza `web-next` | `senior-security` | `senior-secops` | `adversarial-reviewer` |
| Feature FS complessa | `senior-architect` | `senior-fullstack` | `tdd-guide` |

---

## Chi non usare come variant lead

- `adversarial-reviewer` — sempre e solo post-competition, mai come lead di una variante costruttiva.
- `senior-secops` — ottimo sub, ma come lead risulta troppo orientato alla threat analysis rispetto alla produzione di codice.
- `rag-architect` / `agent-designer` — out of scope per questo repo a meno di task esplicitamente AI.
- `apple-hig-expert` — solo se il task target esplicitamente HIG / Liquid Glass / Apple platform.
