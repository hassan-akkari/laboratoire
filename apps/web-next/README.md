# web-next

Next.js MVP focused on a booking and checkout scenario that proves concrete engineering capabilities.

## Features

- App Router with listing, detail, cart, checkout, login, and confirmation pages.
- Protected checkout route with middleware and redirect-to-original-path behavior.
- Server-side pricing engine with:
  - per-person pricing
  - minimum-group safeguard
  - promo codes (`NETWORK10`, `TEAM5`)
- Route Handlers:
  - `POST /api/quote`
  - `POST /api/checkout`
- Idempotent checkout processing via `idempotencyKey`.
- Unit tests on core pricing logic.

## Run

```bash
pnpm -F web-next dev
```

Open `http://localhost:3001`.

## Test & Build

```bash
pnpm -F web-next typecheck
pnpm -F web-next lint
pnpm -F web-next test
pnpm -F web-next build
```
