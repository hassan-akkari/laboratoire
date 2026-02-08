export type PriceModel = "per_person" | "minimum_group";

export type Experience = {
  slug: string;
  title: string;
  location: string;
  durationHours: number;
  summary: string;
  highlights: string[];
  basePrice: number;
  minimumGroupPrice?: number;
  priceModel: PriceModel;
};

export const experiences: Experience[] = [
  {
    slug: "rome-night-food-tour",
    title: "Rome Night Food Tour",
    location: "Rome",
    durationHours: 3,
    summary:
      "A guided evening route across local food spots with live availability and constrained slots.",
    highlights: [
      "Strong candidate for promo and capacity constraints",
      "Shows rich listing and detail page handling",
      "Useful for dynamic SEO metadata in App Router",
    ],
    basePrice: 45,
    priceModel: "per_person",
  },
  {
    slug: "vatican-fast-track",
    title: "Vatican Fast Track Entry",
    location: "Vatican City",
    durationHours: 2,
    summary:
      "Timed-entry product with strict date handling and minimum booking amount.",
    highlights: [
      "Useful for minimum-price vs per-person rules",
      "Good case for checkout protection and retries",
      "Works well with server-validated pricing requests",
    ],
    basePrice: 28,
    minimumGroupPrice: 120,
    priceModel: "minimum_group",
  },
  {
    slug: "tiber-boat-sunset",
    title: "Tiber Boat Sunset Experience",
    location: "Rome",
    durationHours: 2,
    summary:
      "A mixed family and team booking scenario used to validate grouped pricing paths.",
    highlights: [
      "Ideal for team promo conditions",
      "Useful to demo cart breakdown clarity",
      "Supports practical accessibility checks on forms",
    ],
    basePrice: 37,
    priceModel: "per_person",
  },
];

export function getExperienceBySlug(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
