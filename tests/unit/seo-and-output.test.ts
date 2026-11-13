import { afterEach, describe, expect, it, vi } from 'vitest';

import { products } from '@/content/local/products';
import { siteSettings } from '@/content/local/settings';
import type { FarmingVideo, Testimonial } from '@/content/types';
import { contactActions } from '@/lib/contact';
import { canOrder } from '@/lib/ordering';
import { csvCell } from '@/server/admin/leads';
import { leadForms } from '@/server/db/schema';
import { formLabels, leadEmailHtml, leadEmailSubject, leadEmailText, type LeadEmailInput } from '@/server/notify/lead-email';
import { languageAlternates, locales } from '@/lib/i18n';
import { farmingVideoJsonLd, organizationJsonLd, productJsonLd, videoJsonLd } from '@/lib/seo/json-ld';

describe('structured data', () => {
  it('never invents offers, prices or ratings for products', () => {
    for (const product of products) {
      const data = productJsonLd(product);
      expect(data).not.toHaveProperty('offers');
      expect(data).not.toHaveProperty('aggregateRating');
      expect(data).not.toHaveProperty('review');
      expect(data.brand).toEqual({ '@type': 'Brand', name: 'Oceania Fertilizers' });
    }
  });

  it('only lists contact points that exist', () => {
    const data = organizationJsonLd(siteSettings);
    expect(data).not.toHaveProperty('contactPoint');
    expect(data).not.toHaveProperty('address');
    expect(data).not.toHaveProperty('sameAs');
    const withPhone = organizationJsonLd({ ...siteSettings, contact: { phone: '+919800000000' } });
    expect(withPhone.contactPoint).toEqual([expect.objectContaining({ telephone: '+919800000000' })]);
  });

  it('omits VideoObject unless the required fields are present', () => {
    const story: Testimonial = {
      id: 't1',
      status: 'published',
      farmerName: 'A farmer',
      products: [],
      video: { provider: 'youtube', id: 'abc123', url: 'https://youtu.be/abc123' },
      quote: 'Short quote.',
      featured: false,
      order: 0,
    };
    expect(videoJsonLd(story)).toBeNull();
    const complete = videoJsonLd({ ...story, uploadedOn: '2026-09-01', video: { ...story.video, durationSeconds: 95 } });
    expect(complete).toMatchObject({ '@type': 'VideoObject', uploadDate: '2026-09-01', duration: 'PT1M35S' });
    expect(complete?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/abc123');
  });
});

describe('language alternates', () => {
  it('adds no hreflang tags while English is the only live language', () => {
    expect(languageAlternates('/products')).toBeUndefined();
  });

  it('maps every live language once a second one is enabled', () => {
    const withMarathi = locales.map((locale) => (locale.code === 'mr' ? { ...locale, enabled: true } : locale));
    expect(languageAlternates('/products', withMarathi)).toEqual({
      'en-IN': '/products',
      'mr-IN': '/mr/products',
      'x-default': '/products',
    });
    expect(languageAlternates('/', withMarathi)).toEqual({ 'en-IN': '/', 'mr-IN': '/mr', 'x-default': '/' });
  });
});

describe('CSV export', () => {
  it('quotes cells and neutralises spreadsheet formulas', () => {
    expect(csvCell('Rao "Agri"')).toBe('"Rao ""Agri"""');
    expect(csvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell('+919876543210')).toBe('"\'+919876543210"');
    expect(csvCell(null)).toBe('""');
    expect(csvCell({ crop: 'Cotton' })).toBe('"{""crop"":""Cotton""}"');
  });
});

describe('farmer video structured data', () => {
  const video: FarmingVideo = {
    id: 'video-1',
    status: 'published',
    title: 'Reading a soil test',
    slug: 'reading-a-soil-test',
    video: { provider: 'youtube', id: 'abc123', url: 'https://www.youtube.com/watch?v=abc123', durationSeconds: 95 },
    presenter: 'A turmeric grower',
    role: 'farmer',
    language: 'Marathi',
    summary: 'How to read the main numbers on a soil test report.',
    points: [],
    products: [],
    publishedAt: '2026-11-01',
    featured: false,
    order: 0,
  };

  it('describes a complete video', () => {
    expect(farmingVideoJsonLd(video)).toMatchObject({
      '@type': 'VideoObject',
      name: 'Reading a soil test',
      uploadDate: '2026-11-01',
      embedUrl: 'https://www.youtube-nocookie.com/embed/abc123',
      duration: 'PT1M35S',
    });
  });

  it('is omitted when there is no thumbnail', () => {
    expect(farmingVideoJsonLd({ ...video, video: { provider: 'vimeo', id: '123', url: 'https://vimeo.com/123' } })).toBeNull();
  });
});

describe('contact actions', () => {
  it('offers only the advice form until numbers are entered', () => {
    expect(contactActions({}).map((action) => action.channel)).toEqual(['advice']);
  });

  it('adds WhatsApp and call once their numbers exist', () => {
    const actions = contactActions({ whatsapp: '+919800000001', phone: '+919800000002' }, 'Hello');
    expect(actions.map((action) => action.channel)).toEqual(['whatsapp', 'call', 'advice']);
    expect(actions[0]?.href).toBe('https://wa.me/919800000001?text=Hello');
    expect(actions[1]?.href).toBe('tel:+919800000002');
  });
});

describe('ordering', () => {
  it('allows an order only for a published product with a pack size', () => {
    expect(canOrder({ status: 'published', packSizes: ['5 litre can'] })).toBe(true);
    expect(canOrder({ status: 'pending', packSizes: ['5 litre can'] })).toBe(false);
    expect(canOrder({ status: 'published', packSizes: [] })).toBe(false);
  });
});

describe('lead form labels', () => {
  it('name every kind of lead, including orders and field visits', () => {
    for (const form of leadForms) expect(formLabels[form]).toBeTruthy();
    expect(formLabels.order_request).toBe('Order request');
    expect(formLabels.field_visit).toBe('Field visit request');
  });
});

describe('lead notification email', () => {
  const input: LeadEmailInput = {
    id: '00000000-0000-0000-0000-000000000000',
    reference: 'OF-7K2Q9C',
    form: 'partner_application',
    fullName: 'Suresh <Rao>',
    phone: '+919900990099',
    email: 'suresh@example.com',
    state: 'Karnataka',
    district: 'Raichur',
    details: { businessName: 'Rao Agri', partnershipType: 'dealer', partnershipTitle: 'Dealer', interests: [] },
    consents: { contact: true, whatsapp: false },
    sourcePath: '/become-a-partner',
    adminUrl: 'https://oceaniafertilizers.com/admin/leads/00000000-0000-0000-0000-000000000000',
  };

  it('has a scannable subject', () => {
    expect(leadEmailSubject(input)).toBe('[Partner application] Suresh <Rao>, Raichur, Karnataka (Dealer)');
  });

  it('lists the details in plain text with the admin link', () => {
    const text = leadEmailText(input);
    expect(text).toContain('OF-7K2Q9C');
    expect(text).toContain('Partnership interest');
    expect(text).not.toContain('partnershipType');
    expect(text).toContain(input.adminUrl);
    expect(/[^\x00-\x7f]/.test(text)).toBe(false);
  });

  it('escapes HTML', () => {
    expect(leadEmailHtml(input)).toContain('Suresh &lt;Rao&gt;');
  });
});

describe('Turnstile verification', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('is skipped when no secret is configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    const { verifyTurnstile } = await import('@/server/security/turnstile');
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe('not_configured');
  });

  it('fails without a token and passes when Cloudflare confirms', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret');
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal('fetch', fetchMock);
    const { verifyTurnstile } = await import('@/server/security/turnstile');
    expect(await verifyTurnstile(null, null)).toBe('failed');
    expect(await verifyTurnstile('good-token', '1.2.3.4')).toBe('passed');
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
