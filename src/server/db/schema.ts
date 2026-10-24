import { sql } from 'drizzle-orm';
import { index, jsonb, pgEnum, pgTable, pgView, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/*
 * Lead storage. Every write is a single INSERT (or UPDATE), so the schema
 * works with Neon's HTTP driver in production and PGlite locally without
 * needing transactions. Do not import 'server-only' here: drizzle-kit and the
 * tests load this file outside Next.js.
 */

export const leadForms = ['contact', 'farm_callback', 'product_enquiry', 'partner_application', 'farmer_registration'] as const;
export const leadStatuses = ['new', 'contacted', 'qualified', 'closed', 'spam'] as const;
export const notificationStatuses = ['pending', 'sent', 'failed', 'not_configured'] as const;

export type LeadForm = (typeof leadForms)[number];
export type LeadStatus = (typeof leadStatuses)[number];
export type NotificationStatus = (typeof notificationStatuses)[number];

export const leadFormEnum = pgEnum('lead_form', leadForms);
export const leadStatusEnum = pgEnum('lead_status', leadStatuses);
export const notificationStatusEnum = pgEnum('notification_status', notificationStatuses);
export const subscriberStatusEnum = pgEnum('subscriber_status', ['subscribed', 'unsubscribed']);

export type LeadConsents = {
  /** The privacy notice was acknowledged. Required on every form. */
  privacy: boolean;
  /** Agreed to be contacted about this submission. */
  contact: boolean;
  /** Opted in to WhatsApp updates (farmer community only). */
  whatsapp: boolean;
  /** Version of the consent wording shown on the form. */
  version: string;
};

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reference: text('reference').notNull().unique(),
    form: leadFormEnum('form').notNull(),
    status: leadStatusEnum('status').notNull().default('new'),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    email: text('email'),
    state: text('state'),
    district: text('district'),
    /** Form-specific fields, validated by the form's schema before insert. */
    details: jsonb('details').$type<Record<string, unknown>>().notNull().default({}),
    consents: jsonb('consents').$type<LeadConsents>().notNull(),
    sourcePath: text('source_path'),
    utm: jsonb('utm').$type<Record<string, string>>(),
    /** Salted one-way hash. Raw IP addresses are never stored. */
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    /** One submission per form, person and day; repeats are reported as duplicates. */
    dedupeKey: text('dedupe_key').notNull().unique(),
    notificationStatus: notificationStatusEnum('notification_status').notNull().default('pending'),
    notificationError: text('notification_error'),
    internalNotes: text('internal_notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('leads_form_created_idx').on(table.form, table.createdAt),
    index('leads_status_idx').on(table.status),
    index('leads_created_idx').on(table.createdAt),
  ],
);

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  status: subscriberStatusEnum('status').notNull().default('subscribed'),
  consentText: text('consent_text').notNull(),
  sourcePath: text('source_path'),
  unsubscribeToken: text('unsubscribe_token').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Every form attempt, for rate limiting. Rows older than two days are pruned. */
export const formAttempts = pgTable(
  'form_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    form: text('form').notNull(),
    ipHash: text('ip_hash').notNull(),
    outcome: text('outcome').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('form_attempts_lookup_idx').on(table.form, table.ipHash, table.createdAt)],
);

/**
 * Partner applications as columns, for exports and a future dealer portal.
 * The source of truth is the lead row; this view only reshapes it.
 */
export const partnerApplications = pgView('partner_applications').as((qb) =>
  qb
    .select({
      leadId: leads.id,
      reference: leads.reference,
      status: leads.status,
      fullName: leads.fullName,
      phone: leads.phone,
      email: leads.email,
      state: leads.state,
      district: leads.district,
      businessName: sql<string>`${leads.details}->>'businessName'`.as('business_name'),
      partnershipType: sql<string>`${leads.details}->>'partnershipType'`.as('partnership_type'),
      pinCode: sql<string>`${leads.details}->>'pinCode'`.as('pin_code'),
      gstin: sql<string | null>`${leads.details}->>'gstin'`.as('gstin'),
      experience: sql<string>`${leads.details}->>'experience'`.as('experience'),
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(sql`${leads.form} = 'partner_application'`),
);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
