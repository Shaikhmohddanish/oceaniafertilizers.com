import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { STATES_AND_UNION_TERRITORIES } from '../../lib/india/states';

const slugField = (source = 'title') =>
  defineField({
    name: 'slug',
    title: 'Web address',
    type: 'slug',
    description: 'Used in the page address. Generate it from the name, then avoid changing it once published.',
    options: { source, maxLength: 80 },
    validation: (rule) => rule.required(),
  });

function taxonomy(name: string, title: string, withDescription = true) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({ name: 'title', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
      slugField(),
      ...(withDescription ? [defineField({ name: 'description', title: 'Short description', type: 'text', rows: 2 })] : []),
    ],
  });
}

export const productCategory = taxonomy('productCategory', 'Product category');
export const applicationMethod = taxonomy('applicationMethod', 'Application method');
export const crop = taxonomy('crop', 'Crop', false);
export const articleCategory = taxonomy('articleCategory', 'Article topic');
export const galleryCategory = taxonomy('galleryCategory', 'Gallery category', false);

const RESERVED_PRODUCT_SLUGS = new Set(['category', 'categories', 'all']);

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'use', title: 'How to use' },
    { name: 'claims', title: 'Features and benefits' },
    { name: 'media', title: 'Images' },
    { name: 'seo', title: 'Search' },
  ],
  fields: [
    orderRankField({ type: 'product' }),
    defineField({ name: 'name', title: 'Product name', type: 'string', group: 'basics', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'basics',
      options: { source: 'name', maxLength: 80 },
      description: 'Used in the page address, for example halad-special. Avoid changing it once published.',
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current && RESERVED_PRODUCT_SLUGS.has(value.current) ? 'This word is reserved. Choose another.' : true,
        ),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose in one line',
      type: 'string',
      group: 'basics',
      description: 'Shown on product cards. Plain and factual, for example "Bio-stimulant for the root zone, applied by drenching or drip."',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'tagline',
      title: 'Line printed on the pack',
      type: 'string',
      group: 'basics',
      description: 'Quoted exactly as printed on the label.',
    }),
    defineField({ name: 'intro', title: 'Short introduction', type: 'text', rows: 3, group: 'basics' }),
    defineField({ name: 'description', title: 'Full description', type: 'richText', group: 'basics', validation: (rule) => rule.required() }),
    defineField({
      name: 'packSizes',
      title: 'Pack sizes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'basics',
      description: 'For example "5 litre can".',
    }),
    defineField({ name: 'dosage', title: 'Dosage', type: 'array', of: [defineArrayMember({ type: 'dosageRow' })], group: 'use' }),
    defineField({
      name: 'applicationMethods',
      title: 'Application methods',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'applicationMethod' }] })],
      group: 'use',
    }),
    defineField({ name: 'applicationNotes', title: 'Application notes', type: 'richText', group: 'use' }),
    defineField({
      name: 'suitableCrops',
      title: 'Suitable crops',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'crop' }] })],
      group: 'use',
      description: 'Only crops confirmed on the label or in approved documents.',
    }),
    defineField({ name: 'usageGuidance', title: 'Practical guidance', type: 'richText', group: 'use' }),
    defineField({ name: 'safety', title: 'Safety, handling and storage', type: 'richText', group: 'use' }),
    defineField({
      name: 'features',
      title: 'Key features',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'claims',
      description: 'Facts about the product: how it is applied, pack, dose.',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'claims',
      description: 'Only claims that match the approved label and documents.',
    }),
    defineField({
      name: 'claimsApprovedBy',
      title: 'Claims approved by',
      type: 'string',
      group: 'claims',
      description: 'Who checked that these claims match the label and registration.',
    }),
    defineField({ name: 'claimsApprovedOn', title: 'Claims approved on', type: 'date', group: 'claims' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'accessibleImage' })],
      group: 'media',
      description: 'The first image is used on cards. A pack shot on a plain background works best.',
    }),
    defineField({
      name: 'backdrop',
      title: 'Pack shot background colour',
      type: 'string',
      group: 'media',
      description: 'Optional hex colour that matches the background of the pack shot, for example #FFFCEB.',
      validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex colour' }),
    }),
    defineField({ name: 'leaflet', title: 'Product leaflet (PDF)', type: 'file', group: 'media', options: { accept: 'application/pdf' } }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      group: 'basics',
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { select: { title: 'name', subtitle: 'category.title', media: 'images.0' } },
});

const consentFields = [
  defineField({
    name: 'consent',
    title: 'The farmer agreed to publication',
    type: 'boolean',
    description: 'Required. Tick only when the farmer has agreed, in writing or on record, to this being published.',
    initialValue: false,
    validation: (rule) =>
      rule.custom((value) => (value === true ? true : "Record the farmer's agreement before publishing.")),
  }),
  defineField({
    name: 'consentDate',
    title: 'Date of agreement',
    type: 'date',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'consentNote',
    title: 'Where the agreement is kept',
    type: 'string',
    description: 'For the team only, for example "Signed consent form, filed March 2026". Do not enter phone numbers here.',
  }),
  defineField({
    name: 'visible',
    title: 'Show on the website',
    type: 'boolean',
    initialValue: true,
    description: 'Untick to hide without deleting.',
  }),
];

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Farmer story',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'testimonial' }),
    defineField({
      name: 'farmerName',
      title: 'Name to show',
      type: 'string',
      description: 'Exactly as it should appear: a full name, a first name with an initial, or a description such as "A turmeric grower". Only what the farmer agreed to.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'district', title: 'District', type: 'string' }),
    defineField({ name: 'state', title: 'State', type: 'string', options: { list: [...stateList()] } }),
    defineField({ name: 'crop', title: 'Crop', type: 'reference', to: [{ type: 'crop' }] }),
    defineField({
      name: 'products',
      title: 'Products used',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video link',
      type: 'url',
      description: 'A YouTube or Vimeo link. Upload the video there first; do not upload video files here.',
      validation: (rule) =>
        rule.required().custom((value) =>
          typeof value === 'string' && /(youtube\.com|youtu\.be|vimeo\.com)/.test(value) ? true : 'Use a YouTube or Vimeo link.',
        ),
    }),
    defineField({ name: 'durationSeconds', title: 'Length in seconds', type: 'number', validation: (rule) => rule.min(1).integer() }),
    defineField({ name: 'poster', title: 'Poster image', type: 'accessibleImage', description: 'A still from the video. Optional; YouTube thumbnails are used otherwise.' }),
    defineField({
      name: 'quote',
      title: 'Short quote',
      type: 'text',
      rows: 2,
      description: 'Word for word from the video, translated faithfully if needed. Under 200 characters.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, description: 'One or two sentences of context. Also used for search results.' }),
    defineField({ name: 'transcript', title: 'Transcript', type: 'simpleText', description: 'Needed so the video is accessible to everyone.' }),
    defineField({ name: 'transcriptLanguage', title: 'Transcript language', type: 'string', initialValue: 'English' }),
    defineField({ name: 'recordedOn', title: 'Recorded on', type: 'date' }),
    defineField({ name: 'uploadedOn', title: 'Uploaded to YouTube or Vimeo on', type: 'date' }),
    defineField({ name: 'demoPlot', title: 'Related demo plot', type: 'reference', to: [{ type: 'demoPlot' }] }),
    defineField({ name: 'featured', title: 'Feature this story', type: 'boolean', initialValue: false }),
    ...consentFields,
  ],
  preview: { select: { title: 'farmerName', subtitle: 'crop.title', media: 'poster' } },
});

export const demoPlot = defineType({
  name: 'demoPlot',
  title: 'Demo plot',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'demoPlot' }),
    defineField({ name: 'title', title: 'Short title', type: 'string', description: 'For the team, for example "Turmeric, Kharif 2026, Hingoli".' }),
    defineField({ name: 'crop', title: 'Crop', type: 'reference', to: [{ type: 'crop' }], validation: (rule) => rule.required() }),
    defineField({
      name: 'products',
      title: 'Products used',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'state', title: 'State', type: 'string', options: { list: [...stateList()] }, validation: (rule) => rule.required() }),
    defineField({ name: 'district', title: 'District', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'village', title: 'Village', type: 'string', description: 'Only if the farmer agreed to show it.' }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'Kharif', value: 'kharif' },
          { title: 'Rabi', value: 'rabi' },
          { title: 'Zaid', value: 'zaid' },
          { title: 'Perennial or year-round', value: 'perennial' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'year', title: 'Year', type: 'number', validation: (rule) => rule.required().min(2015).max(2100).integer() }),
    defineField({ name: 'sowingDate', title: 'Sowing or planting date', type: 'date' }),
    defineField({ name: 'plotSize', title: 'Plot size', type: 'string', description: 'For example "1 acre".' }),
    defineField({ name: 'treatment', title: 'Treatment', type: 'text', rows: 3, description: 'Products, doses and how they were applied.', validation: (rule) => rule.required() }),
    defineField({
      name: 'comparison',
      title: 'Compared with',
      type: 'text',
      rows: 3,
      description: 'What the comparison plot received, so the result means something.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'observations',
      title: 'What was observed',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Write observations, not promises. For example "More even plant height across the plot."',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before photo',
      type: 'accessibleImage',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'beforeDate', title: 'Before photo taken on', type: 'date' }),
    defineField({ name: 'afterImage', title: 'After photo', type: 'accessibleImage', validation: (rule) => rule.required() }),
    defineField({ name: 'afterDate', title: 'After photo taken on', type: 'date' }),
    defineField({ name: 'farmerName', title: 'Farmer name to show', type: 'string', description: 'Optional, and only as agreed.' }),
    defineField({ name: 'testimonial', title: 'Related farmer story', type: 'reference', to: [{ type: 'testimonial' }] }),
    ...consentFields,
  ],
  preview: {
    select: { title: 'title', crop: 'crop.title', district: 'district', media: 'afterImage' },
    prepare: ({ title, crop: cropTitle, district, media }) => ({ title: title ?? cropTitle ?? 'Demo plot', subtitle: district, media }),
  },
});

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery photo',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'galleryItem' }),
    defineField({ name: 'image', title: 'Photo', type: 'accessibleImage', validation: (rule) => rule.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'galleryCategory' }], validation: (rule) => rule.required() }),
    defineField({ name: 'state', title: 'State', type: 'string', options: { list: [...stateList()] } }),
    defineField({ name: 'district', title: 'District', type: 'string' }),
    defineField({ name: 'date', title: 'Date taken', type: 'date' }),
    defineField({ name: 'visible', title: 'Show on the website', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'title', subtitle: 'category.title', media: 'image' } },
});

function stateList() {
  return STATES_AND_UNION_TERRITORIES.map((state) => ({ title: state, value: state }));
}

export const catalogueTypes = [
  productCategory,
  applicationMethod,
  crop,
  articleCategory,
  galleryCategory,
  product,
  testimonial,
  demoPlot,
  galleryItem,
];
