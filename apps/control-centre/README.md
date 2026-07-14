# control-centre

**Local-only** QoL dashboard for the laboratoire "control centre" system —
the working twin of the public digital garden (see `docs/digital-garden.md`).
The garden shows the world what grows in the vault; this app runs the
day-to-day: job search, inbox triage, vault pipeline, weekly digest.

```bash
pnpm dev:centre        # → http://localhost:3002
```

## Mock but working — the architecture rule

Everything the app does is real: real pages, real state, real logic, real
tests. What is *mocked* is only the boundary with paid/credentialed external
services, and every mock sits behind a typed interface in
`lib/connectors/types.ts`:

| Module | Interface | Today | Swap-in-later |
| --- | --- | --- | --- |
| Job scout | `JobFeedConnector` | `indeed.mock.ts` | real Indeed/LinkedIn feed |
| Inbox | `MailConnector` | `gmail.mock.ts` | Gmail API |
| Briefing calendar | `CalendarConnector` | `calendar.mock.ts` | Google Calendar |

The UI renders each connector's `mode` (`MOCK` amber / `LIVE` green) so the
dashboard is always honest about what is real. Business logic — scout
scoring (`lib/scout/score.ts`), inbox triage rules (`lib/inbox/triage.ts`),
tracker board sorting — is pure, deterministic, and unit-tested; it does not
change when a live adapter lands.

Two modules are **live already** (no mock anywhere):

- **Garden** — reads the actual vault (`VAULT_DIR`, defaults to
  `resources/vault-sample`) and diffs it against the notes the docs site
  ships, so it shows what the next `vault:sync` would publish.
- **Digest** — `git log --since="7 days ago"` on this repo, grouped by area.

## State

The tracker persists to `data/applications.json` (gitignored), seeded from
`seed/applications.seed.json` on first run and zod-validated on every read
and write. Delete the file to re-seed. Same contract-first shape as the
garden pipeline: moving to SQLite/Postgres later only touches
`lib/store/jsonStore.ts`.

## Deliberately NOT here

- No deploy target, no auth, no vercel.json entry — it reads your filesystem
  and your job pipeline; it must never leave localhost.
- No LLM calls yet: triage/scoring are rule-based so they are testable and
  free. An LLM pass can layer on top for the ambiguous middle later.
