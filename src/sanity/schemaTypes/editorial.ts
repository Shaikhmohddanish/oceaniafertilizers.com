import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { consentFields, stateList } from './catalogue';

// /learn/videos is the farmer video library, so no article may use "videos" as its address.
const RESERVED_ARTICLE_SLUGS = new Set(['videos']);

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
  ],
});

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'review', title: 'Review' },
    { name: 'links', title: 'Related' },
    { name: 'seo', title: 'Search' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (rule) => rule.required().max(110) }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current && RESERVED_ARTICLE_SLUGS.has(value.current) ? 'This word is reserved. Choose another.' : true,
        ),
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary for cards',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({ name: 'standfirst', title: 'Opening line', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'cover', title: 'Cover image', type: 'accessibleImage', group: 'content' }),
    defineField({
      name: 'categories',
      title: 'Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'articleCategory' }] })],
      group: 'content',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }], group: 'content' }),
    defineField({ name: 'publishedAt', title: 'Publication date', type: 'datetime', group: 'content', validation: (rule) => rule.required() }),
    defineField({ name: 'body', title: 'Text', type: 'richText', group: 'content', validation: (rule) => rule.required() }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [defineArrayMember({ type: 'sourceReference' })],
      group: 'content',
      description: 'Where the facts in the article come from.',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed by',
      type: 'string',
      group: 'review',
      description: 'The agronomist or expert who checked the article. Shown on the page.',
    }),
    defineField({ name: 'reviewedOn', title: 'Reviewed on', type: 'date', group: 'review' }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      group: 'links',
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Further reading',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }] })],
      group: 'links',
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'cover' } },
});

export const faq = defineType({
  name: 'faq',
  title: 'Question',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'faq' }),
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'simpleText', validation: (rule) => rule.required() }),
    defineField({
      name: 'topic',
      title: 'Shown on',
      type: 'string',
      options: {
        list: [
          { title: 'Become a partner page', value: 'partner' },
          { title: 'Product pages', value: 'product' },
          { title: 'Join Oceania page', value: 'farmer' },
          { title: 'Contact page', value: 'general' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'topic' } },
});

/** A short video about a farming practice: "Learn farming together". */
export const farmingVideo = defineType({
  name: 'farmingVideo',
  title: 'Farmer video',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'video', title: 'Video', default: true },
    { name: 'people', title: 'People and consent' },
    { name: 'links', title: 'Related' },
  ],
  fields: [
    orderRankField({ type: 'farmingVideo' }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'video', validation: (rule) => rule.required().max(110) }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'video',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video link',
      type: 'url',
      group: 'video',
      description: 'A YouTube or Vimeo link. Upload the video there first; do not upload video files here.',
      validation: (rule) =>
        rule.required().custom((value) =>
          typeof value === 'string' && /(youtube\.com|youtu\.be|vimeo\.com)/.test(value) ? true : 'Use a YouTube or Vimeo link.',
        ),
    }),
    defineField({ name: 'durationSeconds', title: 'Length in seconds', type: 'number', group: 'video', validation: (rule) => rule.min(1).integer() }),
    defineField({ name: 'poster', title: 'Cover image', type: 'accessibleImage', group: 'video', description: 'Optional; the YouTube thumbnail is used otherwise.' }),
    defineField({ name: 'topic', title: 'Topic', type: 'reference', group: 'video', to: [{ type: 'articleCategory' }] }),
    defineField({ name: 'crop', title: 'Crop', type: 'reference', group: 'video', to: [{ type: 'crop' }] }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'video',
      description: 'One or two sentences on what the video shows. Also used for search results.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'points',
      title: 'What you will learn',
      type: 'array',
      group: 'video',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.max(5),
    }),
    defineField({ name: 'language', title: 'Language spoken', type: 'string', group: 'video', initialValue: 'Marathi', validation: (rule) => rule.required() }),
    defineField({ name: 'transcript', title: 'Transcript in English', type: 'simpleText', group: 'video', description: 'Needed so the video is accessible to everyone.' }),
    defineField({ name: 'publishedAt', title: 'Publication date', type: 'date', group: 'video', validation: (rule) => rule.required() }),
    defineField({ name: 'featured', title: 'Feature on the homepage', type: 'boolean', group: 'video', initialValue: false }),
    defineField({
      name: 'presenter',
      title: 'Name to show',
      type: 'string',
      group: 'people',
      description: 'Exactly as the person agreed to be named: a full name, a first name with an initial, or a description such as "A turmeric grower".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Who is speaking',
      type: 'string',
      group: 'people',
      options: {
        list: [
          { title: 'A farmer', value: 'farmer' },
          { title: 'An agronomist', value: 'agronomist' },
          { title: 'The Oceania team', value: 'team' },
        ],
        layout: 'radio',
      },
      initialValue: 'farmer',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'district', title: 'District', type: 'string', group: 'people' }),
    defineField({ name: 'state', title: 'State', type: 'string', group: 'people', options: { list: [...stateList()] } }),
    ...consentFields.map((field) => ({ ...field, group: 'people' })),
    defineField({
      name: 'products',
      title: 'Related products',
      type: 'array',
      group: 'links',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'presenter', media: 'poster' } },
});

export const editorialTypes = [author, article, farmingVideo, faq];
