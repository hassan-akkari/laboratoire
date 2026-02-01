# laboratoire

Monorepo pnpm/turbo con due app Vite React (docs e web-react).

## Stato attuale (2026-01-26)
- `apps/docs`: portfolio statico (Tailwind v4 + HeroUI wiring pronto, preflight off)
- `apps/web-react`: Tailwind v4 + HeroUI v2 + Redux Toolkit/RTK Query + MSW (mock `/api/ping`), tema light/dark
- Deploy: workflow GitHub Pages pubblica `docs` su `/` e `web-react` su `/react`

## Struttura
- `apps/docs` (sito/portfolio)
- `apps/web-react` (app base con store + mock API)

## Requisiti
- Node 24+
- pnpm 10+

## Installazione
```bash
pnpm install
```

## Avvio rapido
```bash
pnpm dev        # alias di docs
pnpm dev:docs   # solo docs
pnpm dev:react  # solo web-react
pnpm dev:all    # entrambi
```
Di default Vite parte su `http://localhost:5173` (se occupata usa la successiva).

## Build / Preview
```bash
pnpm build
pnpm build:docs
pnpm build:react

pnpm preview
pnpm preview:docs
pnpm preview:react
```

## Deploy GitHub Pages
Workflow: `.github/workflows/deploy-user-site.yml`
- richiede il secret `GH_PAGES_TOKEN`
- pubblica su `Dark-lIl-Demon/Dark-lIl-Demon.github.io`
