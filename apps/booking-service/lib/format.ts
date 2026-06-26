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

/** Format a timestamp (e.g. createdAt) as a short, readable date + time. */
export function formatDateTime(date: Date, locale = "en-IE"): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Format a booking's preferred slot. `date` is a YYYY-MM-DD string (date-only,
 * no TZ), `time` an optional HH:mm. Rendered for a human, time appended only
 * when present.
 */
export function formatPreferredSlot(
  date: string,
  time: string | null,
  locale = "en-IE",
): string {
  const [y, m, d] = date.split("-").map(Number);
  let label = date;
  if (y && m && d) {
    label = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(y, m - 1, d),
    );
  }
  return time ? `${label} · ${time}` : label;
}
