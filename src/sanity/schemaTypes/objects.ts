import { defineArrayMember, defineField, defineType } from 'sanity';

/*
 * Shared building blocks. Descriptions are written for the people who will
 * edit the website, not for developers.
 */

export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Description for screen readers',
      type: 'string',
      description: 'Describe what the photo shows in one sentence, for example "Young turmeric shoots in rows of dark soil."',
      validation: (rule) => rule.required().min(8).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Shown under the photo. Include the place, for example "Turmeric field, Salem district, Tamil Nadu."',
    }),
    defineField({ name: 'creditAuthor', title: 'Photographer', type: 'string' }),
    defineField({
      name: 'creditLicense',
      title: 'Licence',
      type: 'string',
      description: 'Only for photos Oceania does not own, for example "CC BY-SA 4.0".',
    }),
    defineField({ name: 'creditUrl', title: 'Source link', type: 'url' }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Search title',
      type: 'string',
      description: 'Shown in Google results. Aim for 50 to 60 characters.',
      validation: (rule) => rule.max(70).warning('Long titles are cut off in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences, 120 to 160 characters.',
      validation: (rule) => rule.max(180).warning('Long descriptions are cut off in search results.'),
    }),
    defineField({ name: 'noindex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});

const linkAnnotation = {
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      title: 'Address',
      type: 'string',
      description: 'A page on this website, for example /products/halad-special, or a full web address starting with https://',
      validation: (rule) =>
        rule.required().custom((value) =>
          typeof value === 'string' && (value.startsWith('/') || value.startsWith('https://') || value.startsWith('mailto:'))
            ? true
            : 'Start with / for a page on this site, or with https://',
        ),
    }),
  ],
};

const blockStyles = [
  { title: 'Paragraph', value: 'normal' },
  { title: 'Heading', value: 'h2' },
  { title: 'Subheading', value: 'h3' },
  { title: 'Quote', value: 'blockquote' },
];

/** Full text for articles and product pages: headings, lists, images, callouts and product links. */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: blockStyles,
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbers', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      name: 'figure',
      title: 'Image',
      type: 'object',
      fields: [defineField({ name: 'image', type: 'accessibleImage', validation: (rule) => rule.required() })],
      preview: { select: { title: 'image.caption', media: 'image' }, prepare: ({ title, media }) => ({ title: title ?? 'Image', media }) },
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout',
      type: 'object',
      fields: [
        defineField({
          name: 'tone',
          title: 'Kind',
          type: 'string',
          options: { list: [{ title: 'Note', value: 'note' }, { title: 'Caution', value: 'caution' }], layout: 'radio' },
          initialValue: 'note',
        }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'body', title: 'Text', type: 'text', rows: 3, validation: (rule) => rule.required() }),
      ],
      preview: { select: { title: 'title', subtitle: 'body' } },
    }),
    defineArrayMember({
      name: 'productReference',
      title: 'Product link',
      type: 'object',
      fields: [defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }], validation: (rule) => rule.required() })],
      preview: { select: { title: 'product.name' }, prepare: ({ title }) => ({ title: `Product: ${title ?? ''}` }) },
    }),
  ],
});

/** Short text without images, for bios, answers and summaries. */
export const simpleText = defineType({
  name: 'simpleText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragraph', value: 'normal' }],
      lists: [{ title: 'Bullets', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Text', type: 'string', validation: (rule) => rule.required().max(40) }),
    defineField({
      name: 'href',
      title: 'Goes to',
      type: 'string',
      description: 'A page on this website, for example /products',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const titledText = defineType({
  name: 'titledText',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'body', title: 'Text', type: 'text', rows: 3, validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'body' } },
});

export const dosageRow = defineType({
  name: 'dosageRow',
  title: 'Dosage',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Dose',
      type: 'string',
      description: 'Exactly as on the label, for example "5 litres per acre".',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'basis', title: 'Applies to', type: 'string', description: 'Optional, for example "per application".' }),
    defineField({ name: 'method', title: 'Method', type: 'string', description: 'For example "Drenching or drip irrigation".' }),
  ],
  preview: { select: { title: 'value', subtitle: 'method' } },
});

export const sourceReference = defineType({
  name: 'sourceReference',
  title: 'Source',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'publisher', title: 'Publisher', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'url', title: 'Link', type: 'url', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'publisher' } },
});

export const objectTypes = [accessibleImage, seo, richText, simpleText, cta, titledText, dosageRow, sourceReference];
