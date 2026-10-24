/**
 * Loads the content bundled with the code into a Sanity project, once.
 *
 *   npm run sanity:seed               create documents that do not exist yet
 *   npm run sanity:seed -- --force    overwrite existing documents (careful)
 *   npm run sanity:seed -- --dry-run  write reports/sanity-seed.ndjson, no upload
 *
 * Verified content is created as published documents. Content that still
 * needs Oceania's approval (status "pending") is created as drafts, so it only
 * goes live when an editor reviews it and presses Publish.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and a
 * SANITY_API_WRITE_TOKEN with editor rights (never put that token on Vercel).
 */
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

import { aboutPage } from '../src/content/local/about';
import { articles } from '../src/content/local/articles';
import { faqs } from '../src/content/local/faqs';
import { homePage } from '../src/content/local/home';
import { pageIntros } from '../src/content/local/intros';
import { legalPages } from '../src/content/local/legal';
import { partnerProgramme } from '../src/content/local/partner';
import { products } from '../src/content/local/products';
import { siteSettings } from '../src/content/local/settings';
import { applicationMethods, articleCategories, crops, galleryCategories, productCategories } from '../src/content/local/taxonomy';
import type { ImageAsset, PublicationStatus, RichText } from '../src/content/types';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!dryRun && (!projectId || !token)) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN, or run with --dry-run.');
  process.exit(1);
}

const client = dryRun
  ? null
  : createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false });

type Doc = { _id: string; _type: string; [key: string]: unknown };

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`;
const ref = (id: string, weak = false) => ({ _type: 'reference', _ref: id, ...(weak ? { _weak: true } : {}) });
const slug = (current: string) => ({ _type: 'slug', current });
const withId = (id: string, status: PublicationStatus = 'published') => (status === 'pending' ? `drafts.${id}` : id);

/* Images: upload each file once and reuse the asset. */
const uploads = new Map<string, string>();

async function image(asset: ImageAsset | undefined) {
  if (!asset) return undefined;
  const filePath = typeof asset.src === 'string' ? asset.src : (asset.src as { src: string }).src;
  let assetId = uploads.get(filePath);
  if (!assetId) {
    if (dryRun || !client) {
      assetId = `image-dryrun-${path.basename(filePath)}`;
    } else {
      const uploaded = await client.assets.upload('image', createReadStream(filePath), { filename: path.basename(filePath) });
      assetId = uploaded._id;
    }
    uploads.set(filePath, assetId);
  }
  return {
    _type: 'accessibleImage',
    asset: ref(assetId),
    alt: asset.alt,
    caption: asset.caption,
    creditAuthor: asset.credit?.author,
    creditLicense: asset.credit?.license,
    creditUrl: asset.credit?.sourceUrl,
    ...(asset.focal ? { hotspot: { _type: 'sanity.imageHotspot', x: asset.focal.x, y: asset.focal.y, width: 0.6, height: 0.6 } } : {}),
  };
}

async function richText(value: RichText | undefined) {
  if (!value) return undefined;
  const out: unknown[] = [];
  for (const node of value) {
    if (node._type === 'figure') out.push({ _type: 'figure', _key: node._key, image: await image(node.image) });
    else if (node._type === 'productReference') out.push({ _type: 'productReference', _key: node._key, product: ref(`product.${node.slug}`, true) });
    else out.push(node);
  }
  return out;
}

const keyed = <T extends object>(items: T[], type?: string) => items.map((item) => ({ _key: key(), ...(type ? { _type: type } : {}), ...item }));

function ranks(count: number): string[] {
  const out: string[] = [];
  let rank = LexoRank.middle();
  for (let index = 0; index < count; index += 1) {
    out.push(rank.toString());
    rank = rank.genNext().genNext();
  }
  return out;
}

async function build(): Promise<Doc[]> {
  const docs: Doc[] = [];

  /* Taxonomy */
  for (const item of Object.values(productCategories)) docs.push({ _id: `productCategory.${item.slug}`, _type: 'productCategory', title: item.title, slug: slug(item.slug), description: item.description });
  for (const item of Object.values(applicationMethods)) docs.push({ _id: `applicationMethod.${item.slug}`, _type: 'applicationMethod', title: item.title, slug: slug(item.slug), description: item.description });
  for (const item of crops) docs.push({ _id: `crop.${item.slug}`, _type: 'crop', title: item.title, slug: slug(item.slug) });
  for (const item of Object.values(articleCategories)) docs.push({ _id: `articleCategory.${item.slug}`, _type: 'articleCategory', title: item.title, slug: slug(item.slug) });
  for (const item of Object.values(galleryCategories)) docs.push({ _id: `galleryCategory.${item.slug}`, _type: 'galleryCategory', title: item.title, slug: slug(item.slug) });
  docs.push({ _id: 'author.oceania', _type: 'author', name: 'Oceania Fertilizers' });

  /* Products */
  const productRanks = ranks(products.length);
  for (const [index, product] of products.entries()) {
    docs.push({
      _id: withId(`product.${product.slug}`, product.status),
      _type: 'product',
      orderRank: productRanks[index],
      name: product.name,
      slug: slug(product.slug),
      category: ref(`productCategory.${product.category.slug}`),
      purpose: product.purpose,
      tagline: product.tagline,
      intro: product.intro,
      description: await richText(product.description),
      packSizes: product.packSizes,
      dosage: keyed(product.dosage, 'dosageRow'),
      applicationMethods: product.applicationMethods.map((method) => ({ _key: key(), ...ref(`applicationMethod.${method.slug}`) })),
      applicationNotes: await richText(product.applicationNotes),
      suitableCrops: product.suitableCrops.map((crop) => ({ _key: key(), ...ref(`crop.${crop.slug}`) })),
      usageGuidance: await richText(product.usageGuidance),
      safety: await richText(product.safety),
      features: product.features,
      benefits: product.benefits,
      images: (await Promise.all(product.images.map(image))).filter(Boolean).map((item) => ({ _key: key(), ...item })),
      backdrop: product.images[0]?.backdrop,
      featured: product.featured,
      relatedProducts: product.relatedProductSlugs.map((related) => ({ _key: key(), ...ref(`product.${related}`, true) })),
      seo: product.seo ? { title: product.seo.title, description: product.seo.description } : undefined,
    });
  }

  /* Articles: all pending, so created as drafts for review. */
  for (const article of articles) {
    docs.push({
      _id: withId(`article.${article.slug}`, article.status),
      _type: 'article',
      title: article.title,
      slug: slug(article.slug),
      excerpt: article.excerpt,
      standfirst: article.standfirst,
      cover: await image(article.cover),
      categories: article.categories.map((category) => ({ _key: key(), ...ref(`articleCategory.${category.slug}`) })),
      author: ref('author.oceania'),
      publishedAt: article.publishedAt,
      body: await richText(article.body),
      sources: keyed(article.sources, 'sourceReference'),
      relatedProducts: article.relatedProductSlugs.map((related) => ({ _key: key(), ...ref(`product.${related}`, true) })),
      relatedArticles: article.relatedArticleSlugs.map((related) => ({ _key: key(), ...ref(`article.${related}`, true) })),
      seo: article.seo ? { title: article.seo.title, description: article.seo.description } : undefined,
    });
  }

  /* FAQs */
  const faqRanks = ranks(faqs.length);
  for (const [index, faq] of faqs.entries()) {
    docs.push({ _id: faq.id, _type: 'faq', orderRank: faqRanks[index], question: faq.question, topic: faq.topic, answer: await richText(faq.answer) });
  }

  /* Pages */
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: siteSettings.siteName,
    shortName: siteSettings.shortName,
    tagline: siteSettings.tagline,
    description: siteSettings.description,
  });

  docs.push({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: homePage.hero.eyebrow,
      headline: homePage.hero.headline,
      standfirst: homePage.hero.standfirst,
      image: await image(homePage.hero.image),
      backdrop: homePage.hero.image.backdrop,
      primaryCta: { _type: 'cta', ...homePage.hero.primaryCta },
      secondaryCta: { _type: 'cta', ...homePage.hero.secondaryCta },
    },
    pillars: homePage.pillars,
    chapters: await Promise.all(
      homePage.chapters.map(async (chapter) => ({ _key: key(), label: chapter.label, title: chapter.title, body: chapter.body, image: await image(chapter.image) })),
    ),
    products: {
      eyebrow: homePage.products.eyebrow,
      headline: homePage.products.headline,
      intro: homePage.products.intro,
      featured: homePage.products.featuredSlugs.map((featured) => ({ _key: key(), ...ref(`product.${featured}`, true) })),
    },
    farmer: {
      eyebrow: homePage.farmer.eyebrow,
      headline: homePage.farmer.headline,
      body: homePage.farmer.body,
      image: await image(homePage.farmer.image),
      points: keyed(homePage.farmer.points),
      cta: { _type: 'cta', ...homePage.farmer.cta },
    },
    stories: homePage.stories,
    results: homePage.results,
    practices: { ...homePage.practices, topics: keyed(homePage.practices.topics, 'titledText') },
    partner: {
      eyebrow: homePage.partner.eyebrow,
      headline: homePage.partner.headline,
      body: homePage.partner.body,
      image: await image(homePage.partner.image),
      cta: { _type: 'cta', ...homePage.partner.cta },
    },
    contact: homePage.contact,
    seo: homePage.seo,
  });

  docs.push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: { ...aboutPage.hero, image: await image(aboutPage.hero.image) },
    purpose: { headline: aboutPage.purpose.headline, body: await richText(aboutPage.purpose.body) },
    approach: { headline: aboutPage.approach.headline, intro: aboutPage.approach.intro, steps: keyed(aboutPage.approach.steps, 'titledText') },
    principles: { headline: aboutPage.principles.headline, items: keyed(aboutPage.principles.items, 'titledText') },
    leadership: [],
    vision: { headline: aboutPage.vision.headline, body: aboutPage.vision.body, image: await image(aboutPage.vision.image) },
    seo: aboutPage.seo,
  });

  docs.push({
    _id: 'partnerProgramme',
    _type: 'partnerProgramme',
    hero: { ...partnerProgramme.hero, image: await image(partnerProgramme.hero.image) },
    types: partnerProgramme.types.map((type) => ({ _key: key(), key: slug(type.key), title: type.title, description: type.description })),
    lookFor: partnerProgramme.lookFor,
    process: { headline: partnerProgramme.process.headline, steps: keyed(partnerProgramme.process.steps, 'titledText') },
    note: partnerProgramme.note,
    formIntro: partnerProgramme.formIntro,
    seo: partnerProgramme.seo,
  });

  for (const intro of Object.values(pageIntros)) {
    docs.push({
      _id: `pageIntro.${intro.key}`,
      _type: 'pageIntro',
      key: intro.key,
      title: intro.title,
      standfirst: intro.standfirst,
      image: await image(intro.image),
      seoTitle: intro.seo.title,
      seoDescription: intro.seo.description,
    });
  }

  for (const page of legalPages) {
    docs.push({
      _id: `legal.${page.slug}`,
      _type: 'legalPage',
      key: page.slug,
      title: page.title,
      summary: page.summary,
      body: await richText(page.body),
      lastUpdated: page.lastUpdated,
      approved: page.approved,
    });
  }

  return docs;
}

/** Drops undefined values, which Sanity does not accept. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function main() {
  const docs = (await build()).map(clean);
  const drafts = docs.filter((doc) => doc._id.startsWith('drafts.')).length;

  if (dryRun || !client) {
    await mkdir('reports', { recursive: true });
    await writeFile('reports/sanity-seed.ndjson', docs.map((doc) => JSON.stringify(doc)).join('\n'));
    console.log(`Dry run: ${docs.length} documents (${drafts} drafts), ${uploads.size} images. Written to reports/sanity-seed.ndjson`);
    return;
  }

  for (let start = 0; start < docs.length; start += 50) {
    const transaction = client.transaction();
    for (const doc of docs.slice(start, start + 50)) {
      if (force) transaction.createOrReplace(doc);
      else transaction.createIfNotExists(doc);
    }
    await transaction.commit({ visibility: 'async' });
  }
  console.log(`Seeded ${docs.length} documents (${drafts} as drafts for review) and ${uploads.size} images into "${dataset}".`);
  if (!force) console.log('Existing documents were left unchanged. Use --force to overwrite them.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
