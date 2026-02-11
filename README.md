# laboratoire

Monorepo pnpm/turbo con tre app frontend: `docs`, `web-react`, `web-next`.

## Stato attuale (2026-01-26)
- `apps/docs`: portfolio statico (Tailwind v4 + HeroUI wiring pronto, preflight off)
- `apps/web-react`: Tailwind v4 + HeroUI v2 + Redux Toolkit/RTK Query + MSW (mock `/api/ping`), tema light/dark
- `apps/web-next`: Next.js App Router con MVP booking/checkout (auth gate, pricing engine, API routes)
- Deploy: workflow GitHub Pages pubblica `docs` su `/` e `web-react` su `/react`

## Struttura
- `apps/docs` (sito/portfolio)
- `apps/web-react` (app base con store + mock API)
- `apps/web-next` (booking-checkout engine in Next.js)
- `packages/ui` (libreria componenti + Storybook)

## Requisiti
- Node 24+
- pnpm 10+

## Note Windows (best practice)
- Usa un volume **NTFS**. Su exFAT i symlink non sono supportati e pnpm/workspaces può fallire.
- Se vedi `Debugger attached`, apri un terminale normale (non Debug Terminal) oppure rimuovi `NODE_OPTIONS=--inspect`.

## Installazione
```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm -w install --frozen-lockfile
```

## Avvio rapido
```bash
pnpm dev        # alias di docs
pnpm dev:docs   # solo docs
pnpm dev:react  # solo web-react
pnpm dev:next   # solo web-next
pnpm dev:all    # UI watch + Storybook + docs + web-react + web-next
```
Di default Vite parte su `http://localhost:5173` (se occupata usa la successiva).

## UI (package-first) e Storybook
- `packages/ui` è un pacchetto vero: builda in `dist/` e le app lo importano come dipendenza.
- Storybook vive in `packages/ui`:
  - `pnpm -F @laboratoire/ui storybook`
  - `pnpm -F @laboratoire/ui build-storybook`

### Soft-link in dev (per velocità)
In sviluppo locale, le app possono risolvere `@laboratoire/ui` direttamente da `src` per avere HMR.
Questo è automatico quando si avvia Vite in dev.

Se vuoi forzarlo manualmente:
```bash
VITE_UI_SOURCE=1 pnpm dev:docs
VITE_UI_SOURCE=1 pnpm dev:react
```
In produzione (`pnpm build`) si usa sempre `packages/ui/dist` (package-first).
Se `dist` manca, Vite mostra un errore esplicito con il comando da eseguire.

## Quality gates
```bash
pnpm check      # lint + typecheck + test
pnpm lint
pnpm typecheck
pnpm test
```

## Build / Preview
```bash
pnpm build
pnpm build:docs
pnpm build:react
pnpm build:next

pnpm preview
pnpm preview:docs
pnpm preview:react
pnpm start:next
```

## Deploy GitHub Pages
Workflow: `.github/workflows/deploy-user-site.yml`
- richiede il secret `GH_PAGES_TOKEN`
- esegue `pnpm check` prima della build/deploy
- pubblica su `Dark-lIl-Demon/Dark-lIl-Demon.github.io`

