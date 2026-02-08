import { z } from "zod";

export const quoteRequestSchema = z.object({
  slug: z.string().trim().min(1),
  guests: z.coerce.number().int().min(1).max(12),
  date: z.string().date(),
  promoCode: z.string().trim().max(24).optional(),
});

export const checkoutRequestSchema = quoteRequestSchema.extend({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  paymentMethod: z.enum(["card", "wallet"]),
  idempotencyKey: z.string().uuid(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

function extractValue(
  source: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(source)) {
    return source[0];
  }

  return source;
}

export function normalizePromoCode(raw: string | undefined) {
  const value = raw?.trim().toUpperCase();
  return value ? value : undefined;
}

export function parseQuoteSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const parsed = quoteRequestSchema.safeParse({
    slug: extractValue(searchParams.slug),
    guests: extractValue(searchParams.guests),
    date: extractValue(searchParams.date),
    promoCode: normalizePromoCode(extractValue(searchParams.promoCode)),
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
