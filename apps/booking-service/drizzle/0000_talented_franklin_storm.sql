CREATE TYPE "public"."booking_service_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "booking_admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"customer_email" text,
	"preferred_date" text,
	"preferred_time" text,
	"notes" text,
	"status" "booking_service_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" text,
	"duration_min" integer DEFAULT 60 NOT NULL,
	"price_from_cents" integer DEFAULT 0 NOT NULL,
	"price_to_cents" integer,
	"image_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "booking_services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "booking_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"business_name" text DEFAULT '' NOT NULL,
	"instagram_url" text,
	"whatsapp_number" text,
	"address" text,
	"brand_description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "booking_settings_singleton" CHECK ("booking_settings"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "booking_bookings" ADD CONSTRAINT "booking_bookings_service_id_booking_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."booking_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "booking_admin_users_email_uq" ON "booking_admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "booking_bookings_created_at_idx" ON "booking_bookings" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "booking_bookings_status_idx" ON "booking_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "booking_bookings_service_id_idx" ON "booking_bookings" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "booking_services_active_idx" ON "booking_services" USING btree ("active");--> statement-breakpoint
CREATE INDEX "booking_services_sort_idx" ON "booking_services" USING btree ("sort_order");