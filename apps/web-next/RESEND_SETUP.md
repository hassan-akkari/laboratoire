# Resend email setup — web-next (deferred)

> Status: **NOT wired yet.** Optional feature. Leads are still captured to the DB
> without it — only the email notification + the admin "Send test email" button
> are inactive. Pick this up when lead-email notifications are actually wanted.
> Logged in `.claude/_followup.md` as **F15**.

## What it does

`apps/web-next/lib/email.ts` exposes two functions, both of which **fail
gracefully** (return `{ ok: false, error }`, never throw) when Resend env vars
are missing:

- `sendTestEmail()` — the admin **Site config → Send test email** button.
- `sendLeadNotification()` — fires when a new lead is saved, emails the admin.

Recipient is resolved as `notify_email ?? contact_email` from `site_config`.

## Current state (as of 2026-06-08)

- `apps/web-next/.env.local` already contains:
  ```dotenv
  RESEND_API_KEY=                       # blank — needs the key
  RESEND_FROM=Hassan <onboarding@resend.dev>
  ```
- Admin **Notify email override** is already set to `hassan.akkari@icloud.com`
  and saved, so notifications resolve to iCloud (public contact email stays
  `hassan.akkari01@gmail.com`).
- No API key yet → button reports `Resend not configured (set RESEND_API_KEY and RESEND_FROM)`.

## Key concept: FROM ≠ TO

| Field         | Meaning   | Can it be icloud/gmail?                          |
| ------------- | --------- | ------------------------------------------------ |
| `RESEND_FROM` | sender    | ❌ must be a Resend-verified domain (or the test sender) |
| recipient     | inbox     | ✅ anything, including iCloud                     |

Resend will **not** send `FROM` an `@icloud.com` / `@gmail.com` address — you
can't add DNS records to Apple's or Google's domain. Two valid senders:

1. `onboarding@resend.dev` — Resend's shared test sender. **No setup.** Limit:
   can only send to the email of your own Resend account.
2. `contact@itshassan.it` (or similar) — requires verifying `itshassan.it` in
   Resend + adding DNS records at OVH. Sends to anywhere. Needed for prod.

## Quick path — local test, zero DNS (recommended to start)

1. Sign up at https://resend.com **with `hassan.akkari@icloud.com`** (so the
   account email == the only address the test sender may reach).
2. Resend → **API Keys → Create API Key** (permission: Sending access) → copy
   the `re_...` key (shown once).
3. Paste it after `RESEND_API_KEY=` in `apps/web-next/.env.local`. No quotes,
   no trailing spaces.
4. Admin **Notify email override** must equal `hassan.akkari@icloud.com`
   (already set).
5. **Restart** `pnpm dev:next` — Next.js reads `.env.local` only at boot.
6. Admin → Site config → **Send test email** → arrives at iCloud (check
   spam/promotions).

## Production path — send to any recipient

Needed before real leads notify a non-account address (or to send `FROM` your
own domain).

1. Resend → Add Domain → `itshassan.it`.
2. Resend shows ~3–4 DNS records:
   - DKIM — `resend._domainkey` TXT
   - SPF — TXT on a `send.` subdomain
   - MX — on the same `send.` subdomain (bounce handling)
   - optional DMARC
3. Add them in the **OVH DNS zone** for `itshassan.it`.
   - **Safe:** Resend uses the `send.itshassan.it` subdomain for MX/SPF, so the
     OVH **root MX** that delivers mail to `contact@itshassan.it` is untouched.
     Receiving keeps working.
4. Wait for propagation (OVH: ~30 min – few hrs) → Resend shows **Verified**.
5. Set `RESEND_FROM=Hassan <contact@itshassan.it>` and restart.

## Troubleshooting

In order:

1. `.env.local` is inside `apps/web-next/`, not the repo root.
2. `RESEND_API_KEY` is not blank.
3. `pnpm dev:next` was **restarted** after editing the env.
4. Notify override is exactly `hassan.akkari@icloud.com`.
5. iCloud spam / promotions folder.
6. Next.js terminal for a Resend API error.

A Windows line like `Assertion failed ... uv_handle` after a successful Neon
operation is the known `@neondatabase/serverless` websocket teardown bug on
Windows — **ignore it**, it is not the email problem.

## Never

- Do not paste the `re_...` key into chat or commit it. `.env.local` is
  gitignored (`**/.env.*.local`).
