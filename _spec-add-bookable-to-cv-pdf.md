# Spec — Add "Bookable" to the CV PDF

> Hand this to Claude (or any assistant) in the project/repo where your CV PDF is authored.
> Goal: add **Bookable** as a second entry in the CV's **PROJECTS** section, in EN and IT,
> matching the existing CV voice and layout. Keep everything else unchanged.

---

## Context

The CV (`CV-ENG-06-2026` / `CV-ITA-06-2026`) already has a **PROJECTS** section with one
entry, `laboratoire` (the personal React 19 / TypeScript monorepo: Next.js booking
server-core, Cal.com HMAC webhook, iron-session, Neon/Drizzle, secretless CI).

**Bookable is a different, separate project** and is currently **missing from the PDF**.
It is a *deployed, live* full-stack product — the strongest "I ship real products" signal —
so it belongs in PROJECTS, ideally **above** `laboratoire`.

- **Live:** https://bookable.itshassan.it
- **Stack:** Next.js 16 (App Router + Server Actions), React 19, Drizzle ORM, Neon Postgres,
  iron-session + bcrypt, Zod, shadcn/ui, Tailwind v4, framer-motion
- **Signature feature:** a runtime style-switcher — the *same* content model rendered in
  **three** complete design systems (Editorial / Warm / Bold), selected server-side via a
  cookie, with no client flicker and no content duplication.

---

## What to do

1. In **both** language versions of the CV, add a new bullet/entry to the **PROJECTS**
   section for **Bookable**, placed **first** (before `laboratoire`).
2. Match the existing PROJECTS entry's exact formatting: same bold lead-in style
   (`laboratoire — ...`), same single dense paragraph, same typographic separators (`·` / `/`),
   same length budget (~3–4 lines). Do **not** restructure the section or add sub-headers.
3. Keep the framing **factual and senior**: it's a real deployed product with a real backend,
   auth, validation, and a distinctive design-system mechanism — not a toy.
4. Do not touch any other section (profile, experience, stack, education). Do not change
   `laboratoire`. Do not inflate or invent metrics.

---

## Copy to insert

### English (`CV-ENG-06-2026`) — new first PROJECTS entry

> **Bookable** — live full-stack booking platform for local service businesses
> (bookable.itshassan.it). Next.js 16 App Router + Server Actions over Drizzle / Neon
> Postgres, with a database-driven public catalogue, a Zod-validated booking-request flow
> (client + server), and an iron-session + bcrypt admin dashboard with timing- and
> enumeration-safe login and three-layer route protection. Signature feature: one content
> model rendered in three independent design systems (Editorial / Warm / Bold), switched at
> runtime from a server-read cookie with no flicker and no content duplication; a build-safe
> data layer boots and demos with no database, then goes live the moment a connection string
> is set.

*(If space is tight, the trimmable tail is everything after "three-layer route protection." —
keep at minimum the live URL, the stack, and the three-design-systems differentiator.)*

### Italian (`CV-ITA-06-2026`) — new first PROJECTS entry

> **Bookable** — piattaforma di prenotazione full-stack live per attività di servizi locali
> (bookable.itshassan.it). Next.js 16 App Router + Server Actions su Drizzle / Neon Postgres,
> con catalogo pubblico guidato dal database, un flusso di richiesta prenotazione validato con
> Zod (client + server) e una dashboard admin con iron-session + bcrypt, login timing- ed
> enumeration-safe e protezione delle route a tre livelli. Feature distintiva: un solo modello
> di contenuti reso in tre design system indipendenti (Editorial / Warm / Bold), cambiati a
> runtime da un cookie letto lato server senza flicker e senza duplicare i contenuti; un data
> layer build-safe parte e fa demo senza database, poi va live appena viene impostata la
> connection string.

---

## One-line / Upwork variant (optional, if you keep a short-bullets CV)

- **EN:** Built and deployed **Bookable** (bookable.itshassan.it), a full-stack booking
  platform on Next.js 16 / Drizzle / Neon with iron-session auth — featuring a runtime
  style-switcher that renders one content model in three distinct design systems.
- **IT:** Costruito e messo in produzione **Bookable** (bookable.itshassan.it), piattaforma
  di prenotazione full-stack su Next.js 16 / Drizzle / Neon con auth iron-session — con uno
  style-switcher a runtime che rende un solo modello di contenuti in tre design system distinti.

---

## Optional polish (only if asked)

- If the CV has a **STACK** section, you may add `Drizzle ORM` / `Neon Postgres` to the
  Backend & Data line (they're already implied by the laboratoire entry, so this is optional).
- The CV title is already "Software Engineer · Full-Stack, Frontend-led" — Bookable reinforces
  the *full-stack* half. No title change needed.

## What NOT to do

- Don't merge Bookable into the `laboratoire` entry — they're separate projects.
- Don't claim a scheduling/availability engine — Bookable is a booking-**request** system
  (manual confirmation from the dashboard); no time-slot inventory yet. Keep it honest.
- Don't add screenshots to the PDF unless the CV template already uses images.
