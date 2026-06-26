import type { NewService } from "./db/schema";

// Single source of demo services. Used by:
//  - scripts/seed.ts  (inserts these into Neon)
//  - features/services/queries.ts  (mock fallback when no DB is connected yet,
//    so /services renders real cards before Neon is provisioned)
// Prices in cents. priceTo = null → "from X" pricing.
//
// `images` = the per-service GALLERY (the extra photos shown below the hero on
// the public detail page). Stable Unsplash direct-image URLs (beauty/hair/salon)
// at a fixed width+quality so the demo gallery renders the same every time, with
// no DB. `imageUrl` (the HERO) is intentionally left unset here so the detail
// page derives its hero from `images[0]` — exercising the `imageUrl ?? images[0]`
// fallback path in demo mode.
export const DEMO_SERVICES: NewService[] = [
  {
    title: "Classic Haircut",
    slug: "classic-haircut",
    category: "Hair",
    description:
      "A precision cut tailored to your face shape, finished with a wash and style.",
    durationMin: 45,
    priceFromCents: 3500,
    priceToCents: null,
    sortOrder: 1,
    images: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Cornrows",
    slug: "cornrows",
    category: "Braids",
    description:
      "Neat, long-lasting cornrows in your choice of pattern. Priced by complexity.",
    durationMin: 120,
    priceFromCents: 4500,
    priceToCents: 9000,
    sortOrder: 2,
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Knotless Braids",
    slug: "knotless-braids",
    category: "Braids",
    description:
      "Lightweight, tension-free knotless braids. Length and size affect duration and price.",
    durationMin: 240,
    priceFromCents: 9000,
    priceToCents: 18000,
    sortOrder: 3,
    images: [
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Hair Treatment",
    slug: "hair-treatment",
    category: "Treatment",
    description:
      "Deep-conditioning treatment to restore moisture and strength. Great as an add-on.",
    durationMin: 30,
    priceFromCents: 2500,
    priceToCents: null,
    sortOrder: 4,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];
