CREATE TYPE "public"."lead_form" AS ENUM('contact', 'farm_callback', 'product_enquiry', 'partner_application', 'farmer_registration');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'closed', 'spam');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed', 'not_configured');--> statement-breakpoint
CREATE TYPE "public"."subscriber_status" AS ENUM('subscribed', 'unsubscribed');--> statement-breakpoint
CREATE TABLE "form_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form" text NOT NULL,
	"ip_hash" text NOT NULL,
	"outcome" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"form" "lead_form" NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"email" text,
	"state" text,
	"district" text,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"consents" jsonb NOT NULL,
	"source_path" text,
	"utm" jsonb,
	"ip_hash" text,
	"user_agent" text,
	"dedupe_key" text NOT NULL,
	"notification_status" "notification_status" DEFAULT 'pending' NOT NULL,
	"notification_error" text,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_reference_unique" UNIQUE("reference"),
	CONSTRAINT "leads_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" "subscriber_status" DEFAULT 'subscribed' NOT NULL,
	"consent_text" text NOT NULL,
	"source_path" text,
	"unsubscribe_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "newsletter_subscribers_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE INDEX "form_attempts_lookup_idx" ON "form_attempts" USING btree ("form","ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "leads_form_created_idx" ON "leads" USING btree ("form","created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE VIEW "public"."partner_applications" AS (select "id", "reference", "status", "full_name", "phone", "email", "state", "district", "details"->>'businessName' as "business_name", "details"->>'partnershipType' as "partnership_type", "details"->>'pinCode' as "pin_code", "details"->>'gstin' as "gstin", "details"->>'experience' as "experience", "created_at" from "leads" where "leads"."form" = 'partner_application');