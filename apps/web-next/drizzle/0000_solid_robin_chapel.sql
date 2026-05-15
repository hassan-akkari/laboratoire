CREATE TYPE "public"."booking_status" AS ENUM('scheduled', 'rescheduled', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('contact_form', 'cal');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "lead_source" NOT NULL,
	"source_detail" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"scheduled_at" timestamp with time zone,
	"cal_booking_id" text,
	"cal_payload" jsonb,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"booking_status" "booking_status",
	"notes" text,
	"last_notified_at" timestamp with time zone,
	"notification_error" text,
	"privacy_accepted_at" timestamp with time zone,
	"privacy_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"id" integer PRIMARY KEY NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"notify_email" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_config_singleton" CHECK ("site_config"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "leads_cal_booking_id_uq" ON "leads" USING btree ("cal_booking_id") WHERE "leads"."cal_booking_id" IS NOT NULL;