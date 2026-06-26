# web-next — Hybrid copy deck (v1)

Framing = **Hybrid**: reads as a believable Rome-experiences booking product, with a tasteful "engineering behind it" strip that signals craft without jargon-dumping. Fills every `framingTodo` from `_design-spec-web-next-funnel.md`. This is a **v1 starting point** — P3 (elevate) variants may refine competitively.

> **BRAND NAME = placeholder.** Using **`Cammino`** ("journey/path", Roman-flavored) as default. Swap freely — copy works with any name. Engineering handle "web-next" stays as the technical name in repo/footer only.

---

## Brand / metadata
- **Nav wordmark:** `Cammino` (drop "web-next" from the user-facing wordmark; keep a tiny "built on web-next" only in the footer/under-the-hood strip).
- **`<title>` (layout.tsx:10):** `Cammino — Curated Rome experiences`
- **meta description:** `Hand-picked Rome experiences — food walks, skip-the-line entries, sunset rivers. Booked in seconds, confirmed instantly, priced with no surprises.`

## Home — hero (product, top of page)
- **Eyebrow (editorial label):** `ROME · CURATED EXPERIENCES`
- **Display headline:** `Book Rome like someone who lives here.`
- **Subhead:** `Hand-picked food walks, skip-the-line entries, and sunset rivers — booked in seconds, confirmed instantly, and priced with no surprises at checkout.`
- **Trust strip (3 slots — truthful MVP benefits, NOT fake metrics):**
  1. `Instant confirmation`
  2. `No surprise fees — tax & service shown upfront`
  3. `Secure checkout` (demo: no real charge)
- **Hero right plate:** FEATURED-EXPERIENCE booking tile (graft from bento) — surface one experience (e.g. *Tiber Boat Sunset*) with image plate + price + "Open detail", as the funnel mouth.

## Home — "under the hood" strip (the Hybrid signature; rehomes the 4 ex-signal-pills)
- **Section label:** `Under the hood` (one monospace accent allowed here)
- Translate jargon → confident plain-language craft:
  | old pill | new (product-craft) |
  |---|---|
  | SSR-ready listing + details | **Fast by default** — server-rendered pages, instant loads, shareable links. |
  | Route handler API boundaries | **Validated everywhere** — every action checked server-side, never trust the client. |
  | Auth gate + redirect to original route | **Pick up where you left off** — sign in at checkout, land back on your exact booking. |
  | Price rules engine with unit tests | **Prices that are always right** — a unit-tested rules engine for promos, group pricing, tax & fees. |

## Home — "How it works" (3-step)
1. `Find your experience`
2. `Build your booking — guests, date, promo`
3. `Confirm & go — instant, `idempotent`* confirmation` (*one mono craft-word accent)

## Listing cards
- **Secondary action label:** `Quick add (sample)` — honest: it's a pre-seeded deep-link, not a real add-to-cart.

## Experience detail
- **"Why this route matters" → rename:** `What makes this special` (guest-value highlights, not implementation notes).
- **Server-validation / pricing-rule narration → collapse into** `<details>`: summary `How pricing works`.

## Cart
- **Proceed / auth-gate headline:** `Almost there — sign in to lock your price and confirm.`
- **Auth explainer →** `<details>`: summary `Why sign in?` — body: `We hold your booking and price while you sign in, then take you straight to checkout.`

## Login (/login)
- **Heading:** `Sign in to continue`
- **Subtitle:** `Your booking and price are held while you sign in.`
- **Demo-cookie notice →** `<details>`: summary `Demo mode` — body: `This is a demo. Signing in sets a secure, http-only session cookie — no password, no real payment.`
- **"Auth behavior" bullets →** moved inside the same `Demo mode` details.

## Checkout
- **Idempotency-key subtitle → keep as opt-in** `<details>`: summary `How confirmation works` — body: `We tag your order with an idempotency key, so a double-click never double-books or double-charges you.` (real engineering feature, framed as a guest guarantee — the Hybrid sweet spot.)
- **Reassurance block (AppAlert status=accent, warm — only truthful slots):**
  - `Secure checkout`
  - `No surprise totals — tax & service shown before you pay`
  - `Demo build — no real charge is made`
- **Promo code:** collapsed behind `Add promo code` ghost toggle.

## Confirmation
- **Tone:** celebratory product receipt (no emoji-as-icon — use a check glyph).
- **Headline:** `You're booked.`
- **Subhead:** `Your Rome experience is confirmed.` + big order id (tabular-nums), warm `.notice.ok`.

## Admin login (/admin/login)
- **Brand lockup above card:** `Cammino · Admin`
- **Subtitle:** keep `Restricted to itshassan.it administrators.`
- (Centered in `.stage-center` per spec — no longer marooned.)

---

### Open name decision
Confirm/replace `Cammino`. Alternatives if wanted: `Cammino` · `Lume` · `Sibylla` (ties to your Sibylla Network) · keep generic. Everything above is name-agnostic.
