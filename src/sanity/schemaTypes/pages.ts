import { defineArrayMember, defineField, defineType } from 'sanity';

/*
 * Singletons: one document each, opened directly from the Website menu.
 * Headline fields accept line breaks: press Enter where a heading should break.
 */

const text = (name: string, title: string, rows = 3, description?: string) =>
  defineField({ name, title, type: 'text', rows, description, validation: (rule) => rule.required() });
const line = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description, validation: (rule) => rule.required() });
const headline = (name = 'headline', title = 'Headline') =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 2,
    description: 'Press Enter where the heading should break onto a new line.',
    validation: (rule) => rule.required(),
  });
const image = (name: string, title: string, required = true) =>
  defineField({ name, title, type: 'accessibleImage', validation: (rule) => (required ? rule.required() : rule) });

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact details' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', group: 'brand', initialValue: 'Oceania Fertilizers', validation: (rule) => rule.required() }),
    defineField({ name: 'shortName', title: 'Short name', type: 'string', group: 'brand', initialValue: 'Oceania' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'brand', validation: (rule) => rule.required() }),
    defineField({
      name: 'description',
      title: 'Default description',
      type: 'text',
      rows: 3,
      group: 'brand',
      description: 'Used in the footer and as the default search description.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'legalName',
      title: 'Registered company name',
      type: 'string',
      group: 'brand',
      description: 'Shown in the footer copyright line once confirmed.',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'accessibleImage', group: 'brand', description: 'Optional. Used in search results structured data.' }),
    defineField({
      name: 'contact',
      title: 'Contact details',
      type: 'object',
      group: 'contact',
      description: 'Only enter verified details. Empty fields are hidden on the website.',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'With country code, for example +919800000000.',
          validation: (rule) => rule.regex(/^\+91[6-9]\d{9}$/, { name: 'Indian mobile in +91 format' }),
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp number',
          type: 'string',
          description: 'With country code, for example +919800000000.',
          validation: (rule) => rule.regex(/^\+91[6-9]\d{9}$/, { name: 'Indian mobile in +91 format' }),
        }),
        defineField({ name: 'email', title: 'Email', type: 'email' }),
        defineField({ name: 'hours', title: 'Hours', type: 'string', description: 'For example "Monday to Saturday, 9:30 to 6:00".' }),
        defineField({
          name: 'address',
          title: 'Office address',
          type: 'object',
          fields: [
            defineField({ name: 'line1', title: 'Address line 1', type: 'string' }),
            defineField({ name: 'line2', title: 'Address line 2', type: 'string' }),
            defineField({ name: 'city', title: 'City or town', type: 'string' }),
            defineField({ name: 'district', title: 'District', type: 'string' }),
            defineField({ name: 'state', title: 'State', type: 'string' }),
            defineField({ name: 'pinCode', title: 'PIN code', type: 'string', validation: (rule) => rule.regex(/^[1-9]\d{5}$/, { name: 'PIN code' }) }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social profiles',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'X', value: 'x' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'url', title: 'Profile link', type: 'url', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'whatsappChannelUrl', title: 'WhatsApp channel link', type: 'url', group: 'social' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Opening', default: true },
    { name: 'story', title: 'Story' },
    { name: 'sections', title: 'Sections' },
    { name: 'seo', title: 'Search' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Opening',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'eyebrow', title: 'Small line above the headline', type: 'string' }),
        headline(),
        text('standfirst', 'Introduction'),
        image('image', 'Photograph'),
        defineField({
          name: 'backdrop',
          title: 'Sky colour',
          type: 'string',
          description: 'Hex colour matching the top edge of the photograph, so the headline sits in the sky. For example #EEF5F6.',
          validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex colour' }),
        }),
        defineField({ name: 'primaryCta', title: 'Main button', type: 'cta', validation: (rule) => rule.required() }),
        defineField({ name: 'secondaryCta', title: 'Second link', type: 'cta', validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: 'pillars',
      title: 'Three statements',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'chapters',
      title: 'Story chapters',
      type: 'array',
      group: 'story',
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [line('label', 'Label'), headline('title', 'Title'), text('body', 'Text', 4), image('image', 'Photograph')],
          preview: { select: { title: 'label', subtitle: 'title', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'products',
      title: 'Featured products',
      type: 'object',
      group: 'sections',
      fields: [
        line('eyebrow', 'Label'),
        headline(),
        text('intro', 'Introduction', 2),
        defineField({
          name: 'featured',
          title: 'Products to show',
          type: 'array',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
          validation: (rule) => rule.max(4),
        }),
      ],
    }),
    defineField({
      name: 'farmer',
      title: 'The Oceania farmer',
      type: 'object',
      group: 'sections',
      fields: [
        line('eyebrow', 'Label'),
        headline(),
        text('body', 'Text'),
        image('image', 'Photograph'),
        defineField({
          name: 'points',
          title: 'Head to feet',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [line('part', 'Part, for example "Hands"'), line('meaning', 'Meaning, for example "for getting things done"')],
              preview: { select: { title: 'part', subtitle: 'meaning' } },
            }),
          ],
        }),
        defineField({ name: 'cta', title: 'Button', type: 'cta' }),
      ],
    }),
    defineField({ name: 'stories', title: 'Farmer stories heading', type: 'object', group: 'sections', fields: [line('eyebrow', 'Label'), headline()] }),
    defineField({ name: 'results', title: 'Field results heading', type: 'object', group: 'sections', fields: [line('eyebrow', 'Label'), headline(), text('intro', 'Introduction', 2)] }),
    defineField({
      name: 'practices',
      title: 'Good farming practices',
      type: 'object',
      group: 'sections',
      fields: [
        line('eyebrow', 'Label'),
        headline(),
        text('intro', 'Introduction', 2),
        defineField({ name: 'topics', title: 'Practices', type: 'array', of: [defineArrayMember({ type: 'titledText' })] }),
      ],
    }),
    defineField({
      name: 'partner',
      title: 'Partner invitation',
      type: 'object',
      group: 'sections',
      fields: [line('eyebrow', 'Label'), headline(), text('body', 'Text'), image('image', 'Photograph'), defineField({ name: 'cta', title: 'Button', type: 'cta' })],
    }),
    defineField({ name: 'contact', title: 'Contact invitation', type: 'object', group: 'sections', fields: [line('eyebrow', 'Label'), headline(), text('body', 'Text')] }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Opening',
      type: 'object',
      fields: [headline(), text('standfirst', 'Introduction'), image('image', 'Photograph')],
    }),
    defineField({ name: 'purpose', title: 'Purpose', type: 'object', fields: [line('headline', 'Heading'), defineField({ name: 'body', title: 'Text', type: 'simpleText' })] }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'object',
      fields: [line('headline', 'Heading'), line('intro', 'Introduction'), defineField({ name: 'steps', title: 'Steps', type: 'array', of: [defineArrayMember({ type: 'titledText' })] })],
    }),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'object',
      fields: [line('headline', 'Heading'), defineField({ name: 'items', title: 'Principles', type: 'array', of: [defineArrayMember({ type: 'titledText' })] })],
    }),
    defineField({
      name: 'story',
      title: 'Our story',
      type: 'object',
      description: 'Leave empty until the company story is written. The section appears once a heading is added.',
      fields: [
        defineField({ name: 'headline', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Text', type: 'simpleText' }),
        image('image', 'Photograph', false),
      ],
    }),
    defineField({
      name: 'leadership',
      title: 'Leadership',
      type: 'array',
      description: 'The section appears once one person is added.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [line('name', 'Name'), line('role', 'Role'), defineField({ name: 'bio', title: 'Biography', type: 'simpleText' }), image('photo', 'Portrait', false)],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        }),
      ],
    }),
    defineField({ name: 'vision', title: 'Vision', type: 'object', fields: [line('headline', 'Heading'), text('body', 'Text'), image('image', 'Photograph')] }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});

export const partnerProgramme = defineType({
  name: 'partnerProgramme',
  title: 'Partner programme',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Opening',
      type: 'object',
      fields: [headline(), text('standfirst', 'Introduction'), image('image', 'Photograph')],
    }),
    defineField({
      name: 'types',
      title: 'Partnership types',
      type: 'array',
      description: 'Shown on the page and as the choices in the application form.',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Code',
              type: 'slug',
              options: { source: (_doc, context) => (context.parent as { title?: string })?.title ?? '' },
              description: 'A short code stored with each application, for example "distributor". Do not change once applications exist.',
              validation: (rule) => rule.required(),
            }),
            line('title', 'Title'),
            text('description', 'Description', 2),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    defineField({
      name: 'lookFor',
      title: 'What we look for',
      type: 'object',
      fields: [line('headline', 'Heading'), defineField({ name: 'items', title: 'Points', type: 'array', of: [defineArrayMember({ type: 'string' })] })],
    }),
    defineField({
      name: 'process',
      title: 'What happens after applying',
      type: 'object',
      fields: [line('headline', 'Heading'), defineField({ name: 'steps', title: 'Steps', type: 'array', of: [defineArrayMember({ type: 'titledText' })] })],
    }),
    text('note', 'Note on terms', 2, 'Keep this: the website does not publish margins, territories or terms.'),
    line('formIntro', 'Introduction above the form'),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Partner programme' }) },
});

export const PAGE_INTRO_KEYS = [
  { title: 'Products', value: 'products' },
  { title: 'Field results', value: 'demoPlots' },
  { title: 'Farmer stories', value: 'farmerStories' },
  { title: 'Gallery', value: 'gallery' },
  { title: 'Insights', value: 'insights' },
  { title: 'Contact', value: 'contact' },
  { title: 'Join Oceania', value: 'join' },
];

export const pageIntro = defineType({
  name: 'pageIntro',
  title: 'Page opening',
  type: 'document',
  fields: [
    defineField({ name: 'key', title: 'Page', type: 'string', options: { list: PAGE_INTRO_KEYS }, readOnly: true, validation: (rule) => rule.required() }),
    headline('title', 'Heading'),
    text('standfirst', 'Introduction'),
    image('image', 'Photograph', false),
    line('seoTitle', 'Search title'),
    text('seoDescription', 'Search description', 2),
  ],
  preview: { select: { title: 'key' }, prepare: ({ title }) => ({ title: PAGE_INTRO_KEYS.find((item) => item.value === title)?.title ?? title }) },
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Page',
      type: 'string',
      options: { list: [{ title: 'Privacy policy', value: 'privacy-policy' }, { title: 'Terms and conditions', value: 'terms' }] },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    line('title', 'Title'),
    text('summary', 'Summary', 2),
    defineField({ name: 'body', title: 'Text', type: 'richText', validation: (rule) => rule.required() }),
    defineField({ name: 'lastUpdated', title: 'Last updated', type: 'date', validation: (rule) => rule.required() }),
    defineField({
      name: 'approved',
      title: 'Approved by legal review',
      type: 'boolean',
      initialValue: false,
      description: 'Until this is ticked the page shows a "draft pending legal review" note.',
    }),
  ],
  preview: { select: { title: 'title' } },
});

export const pageTypes = [siteSettings, homePage, aboutPage, partnerProgramme, pageIntro, legalPage];

export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage', 'aboutPage', 'partnerProgramme']);
