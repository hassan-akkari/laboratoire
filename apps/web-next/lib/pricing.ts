import { getExperienceBySlug } from "./data";
import type { QuoteRequest } from "./bookingSchemas";

export type BookingQuote = {
  experience: {
    slug: string;
    title: string;
    location: string;
    durationHours: number;
  };
  guests: number;
  date: string;
  subtotal: number;
  discount: number;
  serviceFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  promoLabel?: string;
  pricingRule: string;
};

type PromoRule = {
  code: string;
  multiplier: number;
  label: string;
  minGuests?: number;
};

const SERVICE_FEE_RATE = 0.08;
const TAX_RATE = 0.12;

const promoRules: PromoRule[] = [
  {
    code: "NETWORK10",
    multiplier: 0.1,
    label: "NETWORK10 (10%)",
  },
  {
    code: "TEAM5",
    multiplier: 0.05,
    minGuests: 5,
    label: "TEAM5 (5%)",
  },
];

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function resolveDiscount(
  subtotal: number,
  guests: number,
  promoCode?: string,
) {
  if (!promoCode) {
    return { value: 0, label: undefined };
  }

  const matchingRule = promoRules.find((rule) => {
    if (rule.code !== promoCode) {
      return false;
    }

    if (rule.minGuests && guests < rule.minGuests) {
      return false;
    }

    return true;
  });

  if (matchingRule) {
    return {
      value: roundCurrency(subtotal * matchingRule.multiplier),
      label: matchingRule.label,
    };
  }

  return { value: 0, label: undefined };
}

export function quoteBooking(input: QuoteRequest): BookingQuote {
  const experience = getExperienceBySlug(input.slug);

  if (!experience) {
    throw new Error(`Experience "${input.slug}" not found`);
  }

  const perPersonSubtotal = experience.basePrice * input.guests;
  const subtotal =
    experience.priceModel === "minimum_group"
      ? Math.max(experience.minimumGroupPrice ?? 0, perPersonSubtotal)
      : perPersonSubtotal;
  const normalizedSubtotal = roundCurrency(subtotal);

  const discountState = resolveDiscount(
    normalizedSubtotal,
    input.guests,
    input.promoCode,
  );

  const serviceFee = roundCurrency(normalizedSubtotal * SERVICE_FEE_RATE);
  const taxableBase = normalizedSubtotal - discountState.value + serviceFee;
  const tax = roundCurrency(taxableBase * TAX_RATE);
  const total = roundCurrency(taxableBase + tax);

  return {
    experience: {
      slug: experience.slug,
      title: experience.title,
      location: experience.location,
      durationHours: experience.durationHours,
    },
    guests: input.guests,
    date: input.date,
    subtotal: normalizedSubtotal,
    discount: discountState.value,
    serviceFee,
    tax,
    total,
    promoCode: input.promoCode,
    promoLabel: discountState.label,
    pricingRule:
      experience.priceModel === "minimum_group"
        ? "Minimum group safeguard"
        : "Per-person pricing",
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}
