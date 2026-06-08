# Handover: web-next Vercel Preview

Last verified: 2026-06-08

## Objective

Deploy `apps/web-next` to a Vercel preview using an isolated Neon preview
database. Do not connect the preview deployment to the production database.
Production deployment and `admin.itshassan.it` remain out of scope until the
preview is verified.

## Current State

- Branch: `feat/admin-phase-3-plan`
- Worktree was clean before this handover file was added.
- Vercel CLI is authenticated as `itshassan`.
- `apps/web-next` is linked to:
  - Team: `hassans-projects-9cc8617f`
  - Project: `web-next`
  - Project ID: `prj_1jzlN6SQ98QdFwqhK4QRSBeH8EHQ`
- Vercel currently has no environment variables for this project.
- No preview deployment has been created.
- `apps/web-next/.env.prod.local` exists and is gitignored.
- `apps/web-next/.env.preview.local` does not exist yet.
- Never print, commit, or paste secret values into chat or this document.

## Completed Work

- Added `apps/web-next/vercel.json` with the Next.js monorepo build settings.
- Added `apps/web-next/.gitignore` for `.vercel`.
- Linked the local app to the Vercel project.
- Production Neon migrations and seed were previously reported successful.
- Updated `lib/origin.ts` so a Vercel preview may call its own generated
  `VERCEL_URL`. Production still requires explicit origin allowlists.
- Added tests for preview and production origin behavior.

## Latest Verification

Run from the repository root:

```text
pnpm -F web-next test
18 test files passed, 108 tests passed

pnpm -F web-next build
Build passed; 17 routes generated
```

## Next Steps

### 1. Create an isolated Neon preview branch

In Neon, create a branch named `preview` from the current database schema and
copy its pooled connection string. Do not use the production connection string.

### 2. Create the local preview env file

Create `apps/web-next/.env.preview.local`:

```dotenv
DATABASE_URL=<preview Neon pooled URL>
ADMIN_EMAIL=hassan.akkari01@gmail.com
ADMIN_PASSWORD=<preview-only password>
ADMIN_SESSION_SECRET=<random value of at least 32 characters>
```

This filename is already covered by the root `**/.env.*.local` ignore rule.

### 3. Migrate and seed the preview database

Run from `apps/web-next`:

```powershell
pnpm exec tsx --env-file=.env.preview.local ../../node_modules/drizzle-kit/bin.cjs migrate
pnpm exec tsx --env-file=.env.preview.local scripts/seed.ts
```

The Windows Neon process may print a libuv assertion after both seed success
messages. If the admin and site-config success messages appear first, verify the
rows in Neon before treating the assertion as a failure.

### 4. Add Vercel Preview environment variables

Run from `apps/web-next`. Paste values only into the CLI prompts:

```powershell
vercel env add DATABASE_URL preview
vercel env add ADMIN_SESSION_SECRET preview
vercel env add PUBLIC_ALLOWED_ORIGINS preview
vercel env add ADMIN_ALLOWED_ORIGINS preview
```

Use:

```text
PUBLIC_ALLOWED_ORIGINS=https://itshassan.it,http://localhost:5173
ADMIN_ALLOWED_ORIGINS=https://admin.itshassan.it,http://localhost:3001
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are required for seeding, but are not
required by the deployed runtime when database authentication is active.

Optional preview features:

```text
RESEND_API_KEY
RESEND_FROM
CAL_WEBHOOK_SECRET
PRIVACY_VERSION
```

### 5. Deploy and verify

Run from `apps/web-next`:

```powershell
vercel
```

Do not use `--prod`.

Verify:

1. The preview URL loads.
2. `/admin/login` accepts the seeded preview credentials.
3. Admin pages load after login.
4. `/api/site-config` responds correctly from the preview origin.
5. A test lead is written only to the Neon preview branch.
6. Production Neon data remains unchanged.

## Later Production Work

Only after preview verification:

- Decide explicitly whether `apps/web-next` is ready for production.
- Add production-scoped Vercel environment variables.
- Deploy with production scope.
- Configure `admin.itshassan.it` in Vercel and OVH DNS.
- Configure the Cal.com webhook and Resend production sender.
- Add the deployed admin API URL to the `apps/docs` production environment.
- Run an end-to-end lead submission smoke test.
