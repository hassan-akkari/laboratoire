import { sql } from "drizzle-orm";
import {
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

export const leadSourceEnum = pgEnum("lead_source", ["contact_form", "cal"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "closed"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "scheduled",
  "rescheduled",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: leadSourceEnum("source").notNull(),
    sourceDetail: text("source_detail"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    calBookingId: text("cal_booking_id"),
    calPayload: jsonb("cal_payload"),
    status: leadStatusEnum("status").notNull().default("new"),
    bookingStatus: bookingStatusEnum("booking_status"),
    notes: text("notes"),
    lastNotifiedAt: timestamp("last_notified_at", { withTimezone: true }),
    notificationError: text("notification_error"),
    privacyAcceptedAt: timestamp("privacy_accepted_at", { withTimezone: true }),
    privacyVersion: text("privacy_version"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt.desc()),
    index("leads_status_idx").on(t.status),
    uniqueIndex("leads_cal_booking_id_uq")
      .on(t.calBookingId)
      .where(sql`${t.calBookingId} IS NOT NULL`),
  ],
);

export const siteConfig = pgTable(
  "site_config",
  {
    id: integer("id").primaryKey(),
    phone: text("phone").notNull().default(""),
    contactEmail: text("contact_email").notNull().default(""),
    notifyEmail: text("notify_email"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("site_config_singleton", sql`${t.id} = 1`)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type SiteConfig = typeof siteConfig.$inferSelect;
