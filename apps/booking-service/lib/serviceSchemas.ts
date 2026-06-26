import { z } from "zod";

// Service (catalogue) validation. Shared by the admin client form (zodResolver)
// and the server actions (safeParse) so the browser and the server enforce the
// SAME rules. Pure module — no `server-only`, no `next/headers`, no DB import —
// so it is safe to pull into the "use client" form island. Mirrors the style of
// `lib/bookingSchemas.ts`.
//
// PRICES ARE IN CENTS (minor units) end-to-end at this boundary: the form shows
// euros and converts to integer cents (Math.round) BEFORE the value reaches the
// schema, and the action validates the cents this schema describes. Keeping the
// schema in the storage unit (cents) means there is exactly one validated
// contract and no float drift sneaks past the action.
//
// TYPING NOTE (RHF + zod): every field's INPUT type equals its OUTPUT type
// (nullable fields stay `string | null`, etc.) — the few `.transform()`s only
// normalise the VALUE ("" → null), never the type. This keeps
// `z.input` === `z.output`, so `useForm<ServiceInput>` + `zodResolver` line up
// without a separate transformed-output generic.

/** Slug shape: lowercase alphanumerics in dash-separated groups (no leading/
 *  trailing/double dashes). Matches the public `/services/[slug]` route shape. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MAX_PRICE_CENTS = 100_000_000; // €1,000,000 — generous sanity ceiling.

export const serviceSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(120, "Title is too long (max 120 characters)."),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required.")
      .max(120, "Slug is too long (max 120 characters).")
      .regex(
        SLUG_RE,
        "Use lowercase letters, numbers and single dashes (e.g. classic-haircut).",
      ),
    // Required string; the column is NOT NULL with a "" default, so a blank
    // description is allowed and stored as "".
    description: z
      .string()
      .trim()
      .max(2000, "Description is too long (max 2000 characters)."),
    // Nullable free text. A blank string is normalised to null (the column is
    // nullable and a blank category should not be persisted as "").
    category: z
      .string()
      .trim()
      .max(80, "Category is too long (max 80 characters).")
      .nullable()
      .transform((value) => (value && value.length > 0 ? value : null)),
    durationMin: z
      .number({ message: "Duration is required." })
      .int("Duration must be a whole number of minutes.")
      .min(1, "Duration must be at least 1 minute.")
      .max(24 * 60, "Duration is too long (max 24 hours)."),
    priceFromCents: z
      .number({ message: "Starting price is required." })
      .int("Price must be a whole number of cents.")
      .min(0, "Price cannot be negative.")
      .max(MAX_PRICE_CENTS, "Price is too large."),
    // Optional upper bound. `null` means "from X" pricing. When present it must
    // be a non-negative integer; the cross-field check below enforces it is also
    // >= priceFromCents.
    priceToCents: z
      .number()
      .int("Price must be a whole number of cents.")
      .min(0, "Price cannot be negative.")
      .max(MAX_PRICE_CENTS, "Price is too large.")
      .nullable(),
    // Nullable URL. A blank string is normalised to null.
    imageUrl: z
      .string()
      .trim()
      .url("Enter a valid URL.")
      .or(z.literal(""))
      .nullable()
      .transform((value) => (value && value.length > 0 ? value : null)),
    // Gallery: the extra images shown below the hero on the public detail page.
    // Each entry must be a valid URL; capped so a paste-bomb can't reach the DB.
    // NO `.default([])` here ON PURPOSE: a default makes the INPUT optional
    // (`string[] | undefined`) while the OUTPUT stays `string[]`, which would
    // break the `z.input === z.output` invariant this module relies on (see the
    // TYPING NOTE above) and desync `useForm<ServiceInput>` + zodResolver. The
    // field is therefore REQUIRED at the type level; the form always supplies an
    // array (defaultValues `images: []`, the Textarea editor maps lines → array),
    // and the server action receives a validated `string[]`.
    images: z
      .array(z.string().trim().url("Each gallery item must be a valid URL."))
      .max(12, "Up to 12 gallery images."),
    active: z.boolean(),
    sortOrder: z
      .number({ message: "Sort order is required." })
      .int("Sort order must be a whole number.")
      .min(0, "Sort order cannot be negative.")
      .max(1_000_000, "Sort order is too large."),
  })
  // Upper bound must not be below the starting price (when an upper bound is
  // given). Attach the issue to `priceToCents` so it renders inline in the form.
  .refine(
    (data) =>
      data.priceToCents == null || data.priceToCents >= data.priceFromCents,
    {
      message:
        "Maximum price must be greater than or equal to the starting price.",
      path: ["priceToCents"],
    },
  );

/** Validated, normalised service input (cents). Shared by form + actions. */
export type ServiceInput = z.infer<typeof serviceSchema>;
