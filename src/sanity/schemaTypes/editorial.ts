import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { defineArrayMember, defineField, defineType } from 'sanity';

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
      validation: (rule) => rule.required(),
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

export const editorialTypes = [author, article, faq];
