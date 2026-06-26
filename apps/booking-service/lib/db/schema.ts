import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Booking lifecycle. Generic on purpose: this app is a service-booking engine,
// "beauty/hair" is just the seeded demo vertical (swap the seed → any business).
//
// TABLE-PREFIX DISCIPLINE: all SQL identifiers (tables, enum, indexes) are
// prefixed `booking_` because this app shares a Neon database with web-next
// (users/leads/site_config) for cross-project reads. The prefix keeps the two
// apps' tables isolated and obvious. The Drizzle EXPORT names stay unprefixed
// (services/bookings/…) so app code is unaffected — only the on-DB names change.
export const bookingStatusEnum = pgEnum("booking_service_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

// ── booking_services ────────────────────────────────────────────────────────
// The public catalogue. `category` is free text so the same schema serves any
// vertical (beauty, tutoring, cleaning, photography…). Prices in minor units
// (cents) to avoid float drift; `priceToCents` nullable for "from X" pricing.
export const services = pgTable(
  "booking_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull().default(""),
    category: text("category"),
    durationMin: integer("duration_min").notNull().default(60),
    priceFromCents: integer("price_from_cents").notNull().default(0),
    priceToCents: integer("price_to_cents"),
    imageUrl: text("image_url"),
    // Gallery of additional image URLs. `imageUrl` above is the HERO; this is the
    // extra gallery shown on the public detail page. JSON array of URL strings,
    // NOT NULL with an empty-array default so a row always has a usable value.
    // Drizzle's $type<string[]>() makes Service/NewService carry `images:
    // string[]` (no nullable juggling). URLs are validated by `serviceSchema`
    // (each entry must be a valid URL) before any write — see lib/serviceSchemas.
    images: jsonb("images").$type<string[]>().notNull().default([]),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("booking_services_active_idx").on(t.active),
    index("booking_services_sort_idx").on(t.sortOrder),
  ],
);

// ── booking_bookings ──────────────────────────────────────────────────────
// A customer's request against a service. `serviceId` FK with onDelete:set null
// so deleting a service never destroys booking history.
export const bookings = pgTable(
  "booking_bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    customerEmail: text("customer_email"),
    preferredDate: text("preferred_date").notNull(), // YYYY-MM-DD; required (zod + DB-level)
    preferredTime: text("preferred_time"), // HH:mm
    notes: text("notes"),
    status: bookingStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("booking_bookings_created_at_idx").on(t.createdAt.desc()),
    index("booking_bookings_status_idx").on(t.status),
    index("booking_bookings_service_id_idx").on(t.serviceId),
  ],
);

// ── booking_settings ──────────────────────────────────────────────────────
// Singleton row (id must equal 1) holding business-level config.
export const settings = pgTable(
  "booking_settings",
  {
    id: integer("id").primaryKey(),
    businessName: text("business_name").notNull().default(""),
    instagramUrl: text("instagram_url"),
    whatsappNumber: text("whatsapp_number"),
    address: text("address"),
    brandDescription: text("brand_description"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [check("booking_settings_singleton", sql`${t.id} = 1`)],
);

// ── booking_admin_users ─────────────────────────────────────────────────────
export const adminUsers = pgTable(
  "booking_admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("booking_admin_users_email_uq").on(t.email)],
);

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Settings = typeof settings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
