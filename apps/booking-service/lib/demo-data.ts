import type { NewService } from "./db/schema";

// Single source of demo services. Used by:
//  - scripts/seed.ts  (inserts these into Neon)
//  - features/services/queries.ts  (mock fallback when no DB is connected yet,
//    so /services renders real cards before Neon is provisioned)
// Prices in cents. priceTo = null → "from X" pricing.
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
  },
];
