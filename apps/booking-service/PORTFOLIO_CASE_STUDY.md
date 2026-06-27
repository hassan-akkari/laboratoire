# Bookable — Multi-Style Booking Platform

**A full-stack booking platform where the same content renders in three completely distinct design systems — switched live, from one codebase.**

---

## One-liner

Full-stack booking platform for local service businesses — a database-driven public catalogue and a validated booking-request flow, fronted by a secure admin dashboard, with a runtime switcher that renders the whole site in three distinct visual identities.

---

## Overview

Bookable is the kind of site a salon, studio, or independent professional would use to publish their services and take booking requests online. The public side is fully database-driven; the admin side is a real management surface with authentication, service CRUD, and a booking lifecycle. It's built on Next.js 16 (App Router + Server Actions), Drizzle ORM, and Neon PostgreSQL, with end-to-end TypeScript and Zod validation.

I built it as a focused, end-to-end MVP — deliberately deep on the things that separate a product from a demo (validation discipline, auth, safe data access, graceful degradation) rather than wide on half-finished features.

---

## Problem

Local service businesses need a simple way to show their offerings and collect booking requests — but they also want their _own_ look, not another identical template. And when you pitch a build to a client, "here's one design, take it or leave it" is a weak position; being able to show the _same_ content in genuinely different directions, instantly, is far more convincing.

So there were two problems worth solving at once:

1. A clean, real booking flow backed by a database and a proper admin panel.
2. A way to present that flow in multiple visual identities without forking the codebase or duplicating content.

---

## Solution

One content model, three design systems, selected at runtime.

The public pages (home, catalogue, service detail, booking form) are thin server components that fetch data **once** and hand it to whichever design variant is active. The active variant lives in a cookie and is read server-side, so there's no client-side flicker and no duplicated data fetching. Each variant — **Editorial**, **Warm**, **Bold** — is a complete, independent implementation: its own typography, layout, motion, and interaction idiom.

Behind it sits a real backend: Drizzle + Neon Postgres, Server Actions for every mutation, Zod schemas shared between the browser and the server, and iron-session + bcrypt auth for the admin.

---

## Key features

- **Public catalogue** driven by the database — pricing (range supported), duration, category, hero image, and a per-service photo gallery.
- **Service detail pages** with hero + gallery and a clear call to book.
- **Booking request form** — validated on both the client and the server, with a date picker and explicit pending / success / error states.
- **Secure admin dashboard** — booking statistics and a full request table.
- **Booking lifecycle management** — pending → confirmed → completed → cancelled, with optimistic UI.
- **Service CRUD** — create, edit, toggle active/inactive, delete; manage pricing, hero image, and gallery.
- **Graceful demo mode** — runs with no database, serves sample data, and tells the visitor clearly that submissions aren't stored.

---

## Signature feature: three visual identities from one content model

This is the differentiator, so it's worth being precise about what it actually is.

It is **not** a light/dark theme or a colour-swap. Each of the three variants is a separate component tree with its own:

- **Typography** — Editorial uses a high-contrast magazine serif (Playfair); Warm uses a tactile optical serif (Fraunces); Bold uses a geometric display sans (Space Grotesk).
- **Layout** — Editorial is calm, column-led whitespace; Warm is a soft hero card over a drifting aurora gradient; Bold is an asymmetric grid with a violet accent panel.
- **Motion** — each variant ships its own hand-written effect (a word-by-word headline reveal, a slow gradient bloom, a shimmer sweep), and all of them respect `prefers-reduced-motion`.

The mechanism: the active variant is stored in a cookie, read server-side in the layout, and used to branch the rendered component. Switching is a Server Action that writes the cookie and refreshes — the page comes back fully rendered in the new identity. The data layer doesn't know or care which variant is active; all three consume the same typed `Service[]` shape. **One codebase, three theses on what the site could be.**

---

## Architecture

- **App Router + Server Actions.** No bespoke REST layer; mutations are Server Actions co-located with their feature.
- **Repository layer** (`features/*/queries.ts`). Pages and actions never touch Drizzle/SQL directly — data access lives in one place per domain, which keeps pages thin and the data shape consistent.
- **Shared validation contracts** (`lib/*Schemas.ts`). Pure Zod modules imported by both the client form and the server action, so validation can't drift between the two boundaries.
- **Clean server/client boundary.** `server-only` guards the session and DB modules; client islands import only action functions and pure types, never server internals.
- **Build-safe data layer.** The DB client never throws at module load, so the app builds and boots even before a database exists, then transparently switches to live data once `DATABASE_URL` is set.

```
app/                    routes (public + admin) and Server Actions
  services/, book/      public catalogue + booking flow
  admin/(authed)/       protected dashboard + service CRUD
features/               repository layer (services, bookings queries)
lib/                    db schema/client, Zod schemas, auth, style, formatting
components/styles/      the three design variants (Editorial / Warm / Bold)
components/ui/          shadcn primitives
drizzle/                SQL migrations
```

---

## Admin dashboard

The admin is a single, consistent internal UI (the marketing variants don't apply here). It provides:

- A **bookings overview** with summary counts and a table of all requests, newest first. Bookings whose service was later deleted still appear (the title falls back to "Deleted service") because deletion preserves history rather than destroying it.
- **Inline status changes** with optimistic UI and revert-on-failure.
- A **services catalogue** showing the full list (active and inactive), with active toggles, edit, and delete.
- A **service editor** where prices are entered in euros and stored as integer cents, gallery images are managed as a list of URLs, and everything is validated before it's saved.

---

## Security and validation

- **Auth:** iron-session sealed httpOnly cookies + bcrypt (cost 12). The session carries only a user id; the secret comes from an environment variable and is never hardcoded or sent to the client.
- **No user enumeration:** login returns one generic error for every failure mode and runs a constant-time bcrypt compare (against a dummy hash for unknown emails) to flatten timing.
- **Defence in depth:** three layers gate the admin — an edge proxy presence-check, a server-side session unseal in the layout, and a per-action re-check inside every mutation. Middleware is never trusted alone.
- **Shared Zod validation:** the same schema validates the client form and re-validates inside the server action, so a bypassed client still can't write a bad row. Cross-field rules are enforced (e.g. a booking needs a phone _or_ an email; a service's max price can't be below its starting price; dates can't be in the past).
- **Safe data access:** parameterised Drizzle only — no raw SQL. Slug-collision races are caught at the unique constraint and mapped to a friendly message. Raw errors are logged server-side and never leaked to the client.

---

## Database model

PostgreSQL via Drizzle, all identifiers prefixed `booking_`.

- **`booking_services`** — id, title, slug (unique), description, category, duration (minutes), price-from / price-to (cents), hero image URL, gallery images (JSON array), active flag, sort order, timestamps. Indexed on `active` and `sortOrder`.
- **`booking_bookings`** — id, service FK (`ON DELETE SET NULL`, so history survives), customer name/phone/email, preferred date (required) + time, notes, status enum (pending/confirmed/completed/cancelled), timestamps. Indexed on `createdAt`, `status`, `serviceId`.
- **`booking_settings`** — a singleton row (enforced by a `CHECK (id = 1)` constraint) holding business-level config.
- **`booking_admin_users`** — id, unique email, bcrypt password hash, timestamp.

Prices are stored in **integer cents** end-to-end to avoid floating-point drift. Types are inferred directly from the Drizzle schema, so the database shape is the single source of truth for the app's types.

---

## Challenges solved

- **Three full designs without duplicating content or fetching.** Solved with a server-side style read at the layout, a thin per-page variant branch, and a single repository call whose typed result all three variants consume.
- **Booting before the database exists.** The DB client returns a "not ready" state instead of throwing, the query layer falls back to typed sample data, and the UI shows a clear demo banner — so the app builds, deploys, and demos with zero infrastructure, then goes live the moment a connection string is added.
- **Timing-safe, enumeration-safe login** without over-engineering: a generic error for all failures plus a constant-time dummy-hash compare.
- **Slug uniqueness under races:** a pre-check for a friendly path, backed by catching the Postgres unique-violation so a concurrent insert can never produce a 500.
- **Money without float bugs:** euros at the input boundary, integer cents everywhere else, with the conversion validated by the shared schema.
- **Preserving booking history on service deletion** via an `ON DELETE SET NULL` foreign key and a left join that keeps orphaned bookings visible.

---

## Limitations & roadmap

I'd rather be straight about what this is and isn't.

**Current limitation — it's a booking _request_ system, not a scheduling engine.** Customers submit a preferred date and time; the business confirms it manually from the dashboard. There is **no time-slot inventory, capacity model, or double-booking prevention yet.** That's the honest line between this MVP and a production salon scheduler.

**Roadmap (in priority order):**

1. Availability / time-slot engine — business hours, slot lengths, overlap prevention. _(The big one — it makes this a true scheduling product.)_
2. Customer accounts linked to bookings (repeat-customer history).
3. Email / SMS notifications on new and confirmed bookings.
4. Production hardening — login rate limiting, CSRF tokens, audit logging.
5. Soft-delete + change history for services.
6. Pagination and filtering on the bookings table.

---

## Screenshot checklist

- [ ] Landing hero with the style switcher visible (one variant)
- [ ] The three variants side by side (the money shot)
- [ ] Public service catalogue (grid of cards)
- [ ] Service detail page with hero + gallery
- [ ] Booking form, filled in, date picker open
- [ ] Booking success state (use a seeded DB so it's real)
- [ ] Admin login (no credentials prefilled)
- [ ] Admin dashboard — stat cards + bookings table
- [ ] Admin services list with active toggles
- [ ] Edit service form (euro prices, gallery, active switch)
- [ ] Database schema diagram

> Capture against a seeded database so the demo banner doesn't appear and the booking success state reflects a real write.

---

## CV / Upwork bullet points

- Built a full-stack service-booking platform with **Next.js 16 App Router, Drizzle ORM, and Neon PostgreSQL**, featuring a database-driven public catalogue and a validated booking-request flow.
- Designed a **runtime style-switching system** that renders one content model in three distinct design systems (typography, layout, and motion), selected server-side via cookie — one codebase, no content duplication.
- Implemented **secure admin authentication** with iron-session sealed cookies and bcrypt, including timing- and enumeration-safe login and three-layer route protection (edge proxy + layout guard + per-action re-check).
- Developed an **admin dashboard** to manage services, pricing, hero/gallery images, active status, and the full booking lifecycle (pending / confirmed / completed / cancelled) with optimistic UI.
- Enforced **end-to-end validation** with Zod schemas shared between client forms and server actions, storing prices as integer cents and enforcing cross-field rules (price ranges, required contact method, no past dates).
- Engineered **resilient data access** — parameterised Drizzle queries only, foreign-key-preserved booking history, unique-constraint race handling, and a build-safe demo fallback when no database is configured.
