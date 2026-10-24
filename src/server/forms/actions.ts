'use server';

import { redirect } from 'next/navigation';

import { getPartnerProgramme, getProduct } from '@/content/repository';
import { CONSENT_VERSION, NEWSLETTER_CONSENT_TEXT, type FormState } from '@/lib/forms/state';
import {
  contactRoleLabels,
  contactSchema,
  contactTopicLabels,
  experienceLabels,
  farmCallbackSchema,
  farmerInterestLabels,
  farmerSchema,
  newsletterSchema,
  partnerSchema,
  productEnquirySchema,
} from '@/lib/validation/forms';

import { getDb } from '../db/client';
import { unsubscribeByToken } from '../leads/service';

import { handleLeadSubmission, handleNewsletterSubmission } from './pipeline';

/*
 * One server action per form. Each returns a FormState that the client form
 * renders. All of them work without JavaScript as plain form posts.
 */

const consents = (whatsapp = false) => ({ privacy: true, contact: true, whatsapp, version: CONSENT_VERSION });

export async function submitContact(_previous: FormState, formData: FormData): Promise<FormState> {
  return handleLeadSubmission(
    {
      form: 'contact',
      schema: contactSchema,
      build: (data) => ({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        state: data.state,
        district: data.district,
        details: {
          role: contactRoleLabels[data.role],
          topic: contactTopicLabels[data.topic],
          product: data.product,
          message: data.message,
        },
        consents: consents(),
        dedupeParts: [data.phone, data.topic, data.message],
      }),
      successMessage: 'Thank you. Your message has reached our team and we will get back to you.',
    },
    formData,
  );
}

export async function submitFarmCallback(_previous: FormState, formData: FormData): Promise<FormState> {
  return handleLeadSubmission(
    {
      form: 'farm_callback',
      schema: farmCallbackSchema,
      build: (data) => ({
        fullName: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.location,
        details: { location: data.location, crop: data.crop, area: data.area },
        consents: consents(),
        dedupeParts: [data.phone, data.crop],
      }),
      successMessage: 'Thank you. We have your details and our team will call you about your farm.',
    },
    formData,
  );
}

export async function submitProductEnquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  const slug = formData.get('product');
  const product = typeof slug === 'string' ? await getProduct(slug) : null;
  return handleLeadSubmission(
    {
      form: 'product_enquiry',
      schema: productEnquirySchema,
      build: (data) => ({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        state: data.state,
        district: data.district,
        details: {
          product: data.product,
          productName: product?.name ?? data.product,
          crop: data.crop,
          area: data.area,
          message: data.message,
        },
        consents: consents(),
        dedupeParts: [data.phone, data.product],
      }),
      successMessage: `Thank you. Our team will contact you about ${product?.name ?? 'this product'}.`,
    },
    formData,
  );
}

export async function submitPartnerApplication(_previous: FormState, formData: FormData): Promise<FormState> {
  const programme = await getPartnerProgramme();
  const keys = programme.types.map((type) => type.key);
  const titles = new Map(programme.types.map((type) => [type.key, type.title]));
  const schema = partnerSchema((keys.length > 0 ? keys : ['other']) as [string, ...string[]]);

  return handleLeadSubmission(
    {
      form: 'partner_application',
      schema,
      build: (data) => ({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        state: data.state,
        district: data.district,
        details: {
          businessName: data.businessName,
          partnershipType: data.partnershipType,
          partnershipTitle: titles.get(data.partnershipType) ?? data.partnershipType,
          pinCode: data.pinCode,
          gstin: data.gstin,
          experience: experienceLabels[data.experience],
          experienceSummary: data.experienceSummary,
          message: data.message,
        },
        consents: consents(),
        dedupeParts: [data.phone, data.email, data.partnershipType],
      }),
      successMessage:
        'Thank you. Your application has reached our business team. They review every application and will get in touch with you.',
    },
    formData,
  );
}

export async function submitFarmerRegistration(_previous: FormState, formData: FormData): Promise<FormState> {
  return handleLeadSubmission(
    {
      form: 'farmer_registration',
      schema: farmerSchema,
      build: (data) => ({
        fullName: data.fullName,
        phone: data.phone,
        state: data.state,
        district: data.district,
        details: {
          crop: data.crop,
          farmSize: data.farmSize,
          interests: data.interests.map((interest) => farmerInterestLabels[interest]),
        },
        consents: consents(data.consentWhatsapp),
        dedupeParts: [data.phone],
      }),
      successMessage: 'Thank you for registering. Welcome to the Oceania farmer community.',
    },
    formData,
  );
}

export async function submitNewsletter(_previous: FormState, formData: FormData): Promise<FormState> {
  return handleNewsletterSubmission(newsletterSchema, NEWSLETTER_CONSENT_TEXT, formData);
}

/** The confirm button on /newsletter/unsubscribe. Opening the link alone changes nothing. */
export async function unsubscribeFromNewsletter(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  let outcome: 'done' | 'invalid' | 'failed';
  try {
    outcome = (await unsubscribeByToken(await getDb(), token)) ? 'done' : 'invalid';
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'unsubscribe_failed', error: String(error) }));
    outcome = 'failed';
  }
  redirect(
    outcome === 'failed'
      ? `/newsletter/unsubscribe?token=${encodeURIComponent(token)}&failed=1`
      : `/newsletter/unsubscribe?${outcome}=1`,
  );
}
