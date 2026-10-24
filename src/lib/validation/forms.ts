import { z } from 'zod';

import { isValidGstin, isValidPinCode, normaliseIndianMobile } from '@/lib/india/identifiers';
import { STATES_AND_UNION_TERRITORIES } from '@/lib/india/states';

import { contactRoles, contactTopics, experienceLevels, farmerInterests } from './labels';

export * from './labels';

/*
 * Server-side validation for every form. Messages are written to be shown
 * next to the field, in plain language.
 */

const emptyToUndefined = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? undefined : value);

const requiredText = (message: string, max = 120) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message)
    .max(max, `Please keep this under ${max} characters.`);

const optionalText = (max = 120) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max, `Please keep this under ${max} characters.`).optional());

export const fullName = requiredText('Enter your full name.', 100).refine((value) => value.length >= 2, 'Enter your full name.');

export const mobile = z
  .string({ error: 'Enter your mobile number.' })
  .trim()
  .min(1, 'Enter your mobile number.')
  .refine((value) => normaliseIndianMobile(value) !== null, 'Enter a 10-digit Indian mobile number.')
  .transform((value) => normaliseIndianMobile(value) as string);

export const requiredEmail = z
  .string({ error: 'Enter your email address.' })
  .trim()
  .min(1, 'Enter your email address.')
  .max(254, 'Enter a valid email address.')
  .pipe(z.email('Enter a valid email address, for example name@example.com.'))
  .transform((value) => value.toLowerCase());

export const optionalEmail = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(254, 'Enter a valid email address.')
    .pipe(z.email('Enter a valid email address, for example name@example.com.'))
    .transform((value) => value.toLowerCase())
    .optional(),
);

export const region = z.enum(STATES_AND_UNION_TERRITORIES, { error: 'Choose your state or union territory.' });

export const district = requiredText('Enter your district or city.', 80);

export const pinCode = z
  .string({ error: 'Enter your PIN code.' })
  .trim()
  .min(1, 'Enter your PIN code.')
  .refine(isValidPinCode, 'Enter a 6-digit PIN code.');

export const optionalGstin = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .transform((value) => value.toUpperCase().replace(/\s/g, ''))
    .refine(isValidGstin, 'This GSTIN does not look right. Check it, or leave the field empty.')
    .optional(),
);

export const optionalAcres = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number({ error: 'Enter the area in acres, for example 2.5.' })
    .positive('Enter the area in acres, for example 2.5.')
    .max(100000, 'Enter the area in acres, for example 2.5.')
    .optional(),
);

/** A checked checkbox submits "yes". */
export const requiredConsent = (message = 'Please confirm to continue.') =>
  z.literal('yes', { error: message });

export const optionalConsent = z.preprocess((value) => value === 'yes', z.boolean());

export const contactSchema = z.object({
  fullName,
  phone: mobile,
  email: optionalEmail,
  role: z.enum(contactRoles, { error: 'Tell us who you are.' }),
  state: region,
  district: optionalText(80),
  topic: z.enum(contactTopics, { error: 'Choose what your message is about.' }),
  product: optionalText(80),
  message: z
    .string({ error: 'Write your message.' })
    .trim()
    .min(10, 'Tell us a little more, at least 10 characters.')
    .max(2000, 'Please keep your message under 2000 characters.'),
  consentPrivacy: requiredConsent('Please confirm you have read the privacy policy.'),
});

export const farmCallbackSchema = z.object({
  fullName,
  location: requiredText('Enter your village or town.', 100),
  state: region,
  crop: requiredText('Choose your main crop.', 60),
  area: optionalAcres,
  phone: mobile,
  consentContact: requiredConsent('Please confirm that we may contact you.'),
});

export const productEnquirySchema = z.object({
  product: requiredText('Choose a product.', 80),
  fullName,
  phone: mobile,
  email: optionalEmail,
  state: region,
  district,
  crop: optionalText(60),
  area: optionalAcres,
  message: optionalText(1000),
  consentContact: requiredConsent('Please confirm that we may contact you.'),
});

/** Partnership types are configured in the CMS, so their keys are passed in. */
export function partnerSchema(partnershipKeys: readonly [string, ...string[]]) {
  return z.object({
    fullName,
    businessName: requiredText('Enter your business or organisation name.', 120),
    email: requiredEmail,
    phone: mobile,
    state: region,
    district,
    pinCode,
    partnershipType: z.enum(partnershipKeys, { error: 'Choose the partnership you are interested in.' }),
    experience: z.enum(experienceLevels, { error: 'Tell us how long you have worked with agricultural inputs.' }),
    experienceSummary: optionalText(1000),
    gstin: optionalGstin,
    message: optionalText(2000),
    consentPrivacy: requiredConsent('Please confirm you have read the privacy policy.'),
  });
}

export const farmerSchema = z.object({
  fullName,
  phone: mobile,
  state: region,
  district: requiredText('Enter your district or village.', 80),
  crop: requiredText('Choose your main crop.', 60),
  farmSize: optionalAcres,
  interests: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : []),
    z.array(z.enum(farmerInterests)).max(farmerInterests.length),
  ),
  consentContact: requiredConsent('Please confirm that we may contact you.'),
  consentWhatsapp: optionalConsent,
});

export const newsletterSchema = z.object({
  email: requiredEmail,
  consentNewsletter: requiredConsent('Please confirm you would like to receive the newsletter.'),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FarmCallbackInput = z.infer<typeof farmCallbackSchema>;
export type ProductEnquiryInput = z.infer<typeof productEnquirySchema>;
export type PartnerInput = z.infer<ReturnType<typeof partnerSchema>>;
export type FarmerInput = z.infer<typeof farmerSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Turns FormData into a plain object; repeated keys (checkbox groups) become arrays. */
export function formDataToObject(formData: FormData): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== 'string') continue;
    const existing = result[key];
    if (existing === undefined) result[key] = value;
    else result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  }
  return result;
}

/** The first message for each field, keyed by field name. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
