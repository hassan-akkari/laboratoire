/** Format a price range stored in minor units (cents) for display. */
export function formatPriceRange(
  fromCents: number,
  toCents: number | null,
  currency = "EUR",
  locale = "en-IE",
): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  });
  const from = fmt.format(fromCents / 100);
  if (toCents == null || toCents <= fromCents) return `from ${from}`;
  return `${from} – ${fmt.format(toCents / 100)}`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
