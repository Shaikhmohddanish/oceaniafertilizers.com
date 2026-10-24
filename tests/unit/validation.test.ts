import { describe, expect, it } from 'vitest';

import { gstinCheckCharacter } from '@/lib/india/identifiers';
import {
  contactSchema,
  farmCallbackSchema,
  farmerSchema,
  fieldErrors,
  formDataToObject,
  newsletterSchema,
  partnerSchema,
} from '@/lib/validation/forms';

const validContact = {
  fullName: 'Asha Kumari',
  phone: '98765 43210',
  email: '',
  role: 'farmer',
  state: 'Bihar',
  district: '',
  topic: 'product',
  product: '',
  message: 'Which input suits paddy in my area?',
  consentPrivacy: 'yes',
};

describe('contact form', () => {
  it('accepts a valid message and normalises values', () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe('+919876543210');
      expect(result.data.email).toBeUndefined();
      expect(result.data.district).toBeUndefined();
    }
  });

  it('explains each problem in plain words', () => {
    const result = contactSchema.safeParse({ ...validContact, phone: '12345', message: 'Hi', consentPrivacy: undefined, state: 'Atlantis' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors.phone).toMatch(/10-digit Indian mobile/);
      expect(errors.message).toMatch(/at least 10 characters/);
      expect(errors.consentPrivacy).toMatch(/privacy policy/);
      expect(errors.state).toMatch(/state or union territory/);
    }
  });

  it('lower-cases a provided email', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'Asha@Example.COM' });
    expect(result.success && result.data.email).toBe('asha@example.com');
  });
});

describe('farm callback form', () => {
  it('coerces an optional area in acres', () => {
    const base = { fullName: 'R K', location: 'Sonkhed', state: 'Maharashtra', crop: 'Turmeric', phone: '9876543210', consentContact: 'yes' };
    const withArea = farmCallbackSchema.safeParse({ ...base, area: '2.5' });
    expect(withArea.success && withArea.data.area).toBe(2.5);
    const withoutArea = farmCallbackSchema.safeParse({ ...base, area: '' });
    expect(withoutArea.success && withoutArea.data.area).toBeUndefined();
    const negative = farmCallbackSchema.safeParse({ ...base, area: '-3' });
    expect(negative.success).toBe(false);
  });
});

describe('partner application', () => {
  const schema = partnerSchema(['distributor', 'dealer']);
  const first14 = '29ABCDE1234F1Z';
  const base = {
    fullName: 'Suresh Rao',
    businessName: 'Rao Agri Inputs',
    email: 'suresh@example.com',
    phone: '9900990099',
    state: 'Karnataka',
    district: 'Raichur',
    pinCode: '584101',
    partnershipType: 'dealer',
    experience: '5-10',
    gstin: '',
    consentPrivacy: 'yes',
  };

  it('accepts a complete application without GSTIN', () => {
    expect(schema.safeParse(base).success).toBe(true);
  });

  it('accepts a valid GSTIN and rejects an invalid one', () => {
    expect(schema.safeParse({ ...base, gstin: `${first14}${gstinCheckCharacter(first14)}` }).success).toBe(true);
    const invalid = schema.safeParse({ ...base, gstin: '29ABCDE1234F1Z0' === `${first14}${gstinCheckCharacter(first14)}` ? '29ABCDE1234F1Z1' : '29ABCDE1234F1Z0' });
    expect(invalid.success).toBe(false);
  });

  it('only accepts configured partnership types', () => {
    expect(schema.safeParse({ ...base, partnershipType: 'franchise' }).success).toBe(false);
  });
});

describe('farmer registration', () => {
  const base = { fullName: 'Lakshmi', phone: '9876501234', state: 'Andhra Pradesh', district: 'Eluru', crop: 'Paddy (rice)', consentContact: 'yes' };

  it('treats WhatsApp updates as opt-in', () => {
    const result = farmerSchema.safeParse(base);
    expect(result.success && result.data.consentWhatsapp).toBe(false);
    const optedIn = farmerSchema.safeParse({ ...base, consentWhatsapp: 'yes' });
    expect(optedIn.success && optedIn.data.consentWhatsapp).toBe(true);
  });

  it('reads one or many interests and rejects unknown ones', () => {
    const one = farmerSchema.safeParse({ ...base, interests: 'demo-plot' });
    expect(one.success && one.data.interests).toEqual(['demo-plot']);
    const many = farmerSchema.safeParse({ ...base, interests: ['demo-plot', 'field-days'] });
    expect(many.success && many.data.interests).toEqual(['demo-plot', 'field-days']);
    expect(farmerSchema.safeParse({ ...base, interests: ['free-fertiliser'] }).success).toBe(false);
  });

  it('requires consent to be contacted', () => {
    expect(farmerSchema.safeParse({ ...base, consentContact: undefined }).success).toBe(false);
  });
});

describe('newsletter', () => {
  it('needs an email and consent', () => {
    expect(newsletterSchema.safeParse({ email: 'a@b.in', consentNewsletter: 'yes' }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: 'not-an-email', consentNewsletter: 'yes' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: 'a@b.in' }).success).toBe(false);
  });
});

describe('formDataToObject', () => {
  it('turns repeated keys into arrays', () => {
    const data = new FormData();
    data.append('name', 'Asha');
    data.append('interests', 'demo-plot');
    data.append('interests', 'field-days');
    expect(formDataToObject(data)).toEqual({ name: 'Asha', interests: ['demo-plot', 'field-days'] });
  });
});
