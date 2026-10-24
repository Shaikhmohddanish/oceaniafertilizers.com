/* eslint-disable @typescript-eslint/no-explicit-any -- GROQ results are untyped at this boundary; each is mapped to a domain type below. */
import 'server-only';

import { localSource } from '@/content/local';
import type { ContentSource } from '@/content/source';
import { readingMinutes } from '@/content/text';
import type {
  Article,
  Crop,
  DemoPlot,
  Faq,
  GalleryItem,
  ImageAsset,
  PageIntroKey,
  Product,
  PublicationStatus,
  RichText,
  Season,
  Testimonial,
  VideoSource,
} from '@/content/types';

import { imageBuilder } from './client';
import { sanityFetch } from './fetch';

/* ---------- Projections ---------- */

const IMAGE = `{ ..., "asset": asset->{ _id, url, metadata { dimensions { width, height }, lqip } } }`;

const RICH = `[]{
  ...,
  markDefs[]{ ... },
  _type == "figure" => { "image": image${IMAGE} },
  _type == "productReference" => { "slug": product->slug.current, "name": product->name, "purpose": product->purpose }
}`;

const TERM = `{ title, "slug": slug.current, description }`;
const PRODUCT_REF = `{ "slug": slug.current, name }`;
const STATUS = `"id": _id, "originalId": _originalId, "updatedAt": _updatedAt`;

/* ---------- Mapping helpers ---------- */

type SanityImage = {
  asset?: { _id?: string; url?: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
  creditAuthor?: string;
  creditLicense?: string;
  creditUrl?: string;
};

function status(originalId?: string): PublicationStatus {
  return originalId?.startsWith('drafts.') ? 'pending' : 'published';
}

export function mapImage(image: SanityImage | null | undefined, backdrop?: string): ImageAsset | undefined {
  const dimensions = image?.asset?.metadata?.dimensions;
  if (!image?.asset?.url || !dimensions) return undefined;
  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const widthShare = 1 - crop.left - crop.right;
  const heightShare = 1 - crop.top - crop.bottom;
  const focal = image.hotspot
    ? {
        x: Math.min(1, Math.max(0, (image.hotspot.x - crop.left) / widthShare)),
        y: Math.min(1, Math.max(0, (image.hotspot.y - crop.top) / heightShare)),
      }
    : undefined;
  return {
    src: imageBuilder.image(image as never).url(),
    width: Math.round(dimensions.width * widthShare),
    height: Math.round(dimensions.height * heightShare),
    alt: image.alt ?? '',
    caption: image.caption,
    credit: image.creditAuthor
      ? { author: image.creditAuthor, license: image.creditLicense, sourceUrl: image.creditUrl }
      : undefined,
    blurDataURL: image.asset.metadata?.lqip,
    focal,
    backdrop,
  };
}

type RawNode = { _type: string; _key: string; image?: SanityImage; [key: string]: unknown };

function mapRichText(value: RawNode[] | null | undefined): RichText {
  if (!value) return [];
  return value.flatMap((node) => {
    if (node._type === 'figure') {
      const image = mapImage(node.image);
      return image ? [{ _type: 'figure' as const, _key: node._key, image }] : [];
    }
    if (node._type === 'productReference') {
      return node.slug ? [{ _type: 'productReference' as const, _key: node._key, slug: String(node.slug), name: String(node.name ?? ''), purpose: String(node.purpose ?? '') }] : [];
    }
    return [node as unknown as RichText[number]];
  });
}

function optionalRichText(value: RawNode[] | null | undefined): RichText | undefined {
  const mapped = mapRichText(value);
  return mapped.length > 0 ? mapped : undefined;
}

/** Reads a YouTube or Vimeo address into a provider and video id. */
export function parseVideo(url: string, durationSeconds?: number): VideoSource | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return { provider: 'youtube', id: parsed.pathname.slice(1), url, durationSeconds };
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const id = parsed.searchParams.get('v') ?? parsed.pathname.split('/').filter(Boolean).pop();
      return id ? { provider: 'youtube', id, url, durationSeconds } : null;
    }
    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? { provider: 'vimeo', id, url, durationSeconds } : null;
    }
  } catch {
    return null;
  }
  return null;
}

const SEASONS: Season[] = ['kharif', 'rabi', 'zaid', 'perennial'];

/* ---------- Source ---------- */

type Raw = Record<string, unknown> & { id: string; originalId?: string; updatedAt: string };

export const sanitySource: ContentSource = {
  async getSiteSettings() {
    const raw = await sanityFetch<(Raw & { logo?: SanityImage }) | null>(`*[_id == "siteSettings"][0]{ ${STATUS}, ..., logo${IMAGE} }`);
    const fallback = await localSource.getSiteSettings();
    if (!raw) return fallback;
    const contact = (raw.contact ?? {}) as Record<string, unknown>;
    return {
      siteName: String(raw.siteName ?? fallback.siteName),
      shortName: String(raw.shortName ?? fallback.shortName),
      tagline: String(raw.tagline ?? fallback.tagline),
      description: String(raw.description ?? fallback.description),
      legalName: (raw.legalName as string) || undefined,
      contact: {
        phone: (contact.phone as string) || undefined,
        whatsapp: (contact.whatsapp as string) || undefined,
        email: (contact.email as string) || undefined,
        hours: (contact.hours as string) || undefined,
        address: (contact.address as Record<string, string>) || undefined,
      },
      social: ((raw.social as { platform: never; url: string }[]) ?? []).filter((item) => item.platform && item.url),
      whatsappChannelUrl: (raw.whatsappChannelUrl as string) || undefined,
      logo: mapImage(raw.logo),
    };
  },

  async getHomePage() {
    const raw = await sanityFetch<Record<string, any> | null>(`*[_id == "homePage"][0]{
      ...,
      hero{ ..., image${IMAGE} },
      chapters[]{ ..., image${IMAGE} },
      products{ ..., "featuredSlugs": featured[]->slug.current },
      farmer{ ..., image${IMAGE} },
      partner{ ..., image${IMAGE} }
    }`);
    const fallback = await localSource.getHomePage();
    if (!raw?.hero) return fallback;
    return {
      hero: {
        eyebrow: raw.hero.eyebrow,
        headline: raw.hero.headline,
        standfirst: raw.hero.standfirst,
        image: mapImage(raw.hero.image, raw.hero.backdrop) ?? fallback.hero.image,
        primaryCta: raw.hero.primaryCta ?? fallback.hero.primaryCta,
        secondaryCta: raw.hero.secondaryCta ?? fallback.hero.secondaryCta,
      },
      pillars: raw.pillars ?? fallback.pillars,
      chapters: (raw.chapters ?? []).map((chapter: any, index: number) => ({
        label: chapter.label,
        title: chapter.title,
        body: chapter.body,
        image: mapImage(chapter.image) ?? fallback.chapters[index]?.image ?? fallback.hero.image,
      })),
      products: {
        eyebrow: raw.products?.eyebrow ?? fallback.products.eyebrow,
        headline: raw.products?.headline ?? fallback.products.headline,
        intro: raw.products?.intro ?? fallback.products.intro,
        featuredSlugs: raw.products?.featuredSlugs ?? [],
      },
      farmer: {
        ...fallback.farmer,
        ...raw.farmer,
        image: mapImage(raw.farmer?.image) ?? fallback.farmer.image,
        points: raw.farmer?.points ?? fallback.farmer.points,
        cta: raw.farmer?.cta ?? fallback.farmer.cta,
      },
      stories: { ...fallback.stories, ...raw.stories },
      results: { ...fallback.results, ...raw.results },
      practices: { ...fallback.practices, ...raw.practices, topics: raw.practices?.topics ?? fallback.practices.topics },
      partner: { ...fallback.partner, ...raw.partner, image: mapImage(raw.partner?.image) ?? fallback.partner.image, cta: raw.partner?.cta ?? fallback.partner.cta },
      contact: { ...fallback.contact, ...raw.contact },
      seo: raw.seo ?? fallback.seo,
    };
  },

  async getAboutPage() {
    const raw = await sanityFetch<Record<string, any> | null>(`*[_id == "aboutPage"][0]{
      ..., hero{ ..., image${IMAGE} }, story{ ..., image${IMAGE} }, leadership[]{ ..., photo${IMAGE} }, vision{ ..., image${IMAGE} }
    }`);
    const fallback = await localSource.getAboutPage();
    if (!raw?.hero) return fallback;
    return {
      hero: { ...raw.hero, image: mapImage(raw.hero.image) ?? fallback.hero.image },
      purpose: { headline: raw.purpose?.headline ?? fallback.purpose.headline, body: mapRichText(raw.purpose?.body) },
      approach: { headline: raw.approach?.headline, intro: raw.approach?.intro, steps: raw.approach?.steps ?? [] },
      principles: { headline: raw.principles?.headline, items: raw.principles?.items ?? [] },
      story: raw.story?.headline
        ? { headline: raw.story.headline, body: mapRichText(raw.story.body), image: mapImage(raw.story.image) }
        : undefined,
      leadership: (raw.leadership ?? []).map((person: any) => ({
        name: person.name,
        role: person.role,
        bio: mapRichText(person.bio),
        photo: mapImage(person.photo),
      })),
      vision: { headline: raw.vision?.headline, body: raw.vision?.body, image: mapImage(raw.vision?.image) ?? fallback.vision.image },
      seo: raw.seo,
    };
  },

  async getPartnerProgramme() {
    const raw = await sanityFetch<Record<string, any> | null>(`*[_id == "partnerProgramme"][0]{ ..., hero{ ..., image${IMAGE} }, "types": types[]{ "key": key.current, title, description } }`);
    const fallback = await localSource.getPartnerProgramme();
    if (!raw?.hero) return fallback;
    return {
      hero: { ...raw.hero, image: mapImage(raw.hero.image) ?? fallback.hero.image },
      types: raw.types?.length ? raw.types : fallback.types,
      lookFor: raw.lookFor ?? fallback.lookFor,
      process: raw.process ?? fallback.process,
      note: raw.note ?? fallback.note,
      formIntro: raw.formIntro ?? fallback.formIntro,
      seo: raw.seo,
    };
  },

  async getProducts() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "product" && defined(slug.current)] | order(orderRank asc) {
      ${STATUS}, name, "slug": slug.current, purpose, tagline, intro, backdrop, featured, seo,
      "category": category->${TERM},
      "applicationMethods": coalesce(applicationMethods[]->${TERM}, []),
      "suitableCrops": coalesce(suitableCrops[]->{ title, "slug": slug.current }, []),
      "description": description${RICH},
      "applicationNotes": applicationNotes${RICH},
      "usageGuidance": usageGuidance${RICH},
      "safety": safety${RICH},
      "packSizes": coalesce(packSizes, []),
      "dosage": coalesce(dosage[]{ value, basis, method }, []),
      "features": coalesce(features, []),
      "benefits": coalesce(benefits, []),
      "images": coalesce(images[]${IMAGE}, []),
      "leafletUrl": leaflet.asset->url,
      "relatedProductSlugs": coalesce(relatedProducts[]->slug.current, [])
    }`);
    return rows.map((row, index): Product => {
      const images = (row.images as SanityImage[]).map((image) => mapImage(image, row.backdrop)).filter((image): image is ImageAsset => Boolean(image));
      return {
        id: row.id,
        status: status(row.originalId),
        slug: row.slug,
        name: row.name,
        purpose: row.purpose ?? '',
        tagline: row.tagline ?? undefined,
        category: row.category ?? { slug: 'uncategorised', title: 'Products' },
        applicationMethods: row.applicationMethods,
        image: images[0],
        featured: Boolean(row.featured),
        order: index,
        intro: row.intro ?? undefined,
        description: mapRichText(row.description),
        packSizes: row.packSizes,
        dosage: row.dosage,
        applicationNotes: optionalRichText(row.applicationNotes),
        suitableCrops: row.suitableCrops,
        features: row.features,
        benefits: row.benefits,
        usageGuidance: optionalRichText(row.usageGuidance),
        safety: optionalRichText(row.safety),
        images,
        leafletUrl: row.leafletUrl ?? undefined,
        relatedProductSlugs: row.relatedProductSlugs.filter(Boolean),
        seo: row.seo ?? undefined,
        updatedAt: row.updatedAt,
      };
    });
  },

  getProductCategories: () => sanityFetch(`*[_type == "productCategory"] | order(title asc) ${TERM}`),

  async getCrops() {
    const crops = await sanityFetch<Crop[]>(`*[_type == "crop"] | order(title asc){ title, "slug": slug.current }`);
    return crops.length > 0 ? crops : localSource.getCrops();
  },

  async getTestimonials() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "testimonial" && consent == true && visible != false] | order(orderRank asc) {
      ${STATUS}, farmerName, district, state, quote, summary, transcriptLanguage, recordedOn, uploadedOn, featured, videoUrl, durationSeconds,
      "crop": crop->{ title, "slug": slug.current },
      "products": coalesce(products[]->${PRODUCT_REF}, []),
      "poster": poster${IMAGE},
      "transcript": transcript${RICH},
      "demoPlotId": demoPlot._ref
    }`);
    return rows.flatMap((row, index): Testimonial[] => {
      const video = parseVideo(row.videoUrl, row.durationSeconds ?? undefined);
      if (!video) return [];
      return [
        {
          id: row.id,
          status: status(row.originalId),
          farmerName: row.farmerName,
          district: row.district ?? undefined,
          state: row.state ?? undefined,
          crop: row.crop ?? undefined,
          products: row.products,
          video,
          poster: mapImage(row.poster),
          quote: row.quote,
          summary: row.summary ?? undefined,
          transcript: optionalRichText(row.transcript),
          transcriptLanguage: row.transcriptLanguage ?? undefined,
          recordedOn: row.recordedOn ?? undefined,
          uploadedOn: row.uploadedOn ?? undefined,
          demoPlotId: row.demoPlotId ?? undefined,
          featured: Boolean(row.featured),
          order: index,
        },
      ];
    });
  },

  async getDemoPlots() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "demoPlot" && consent == true && visible != false] | order(orderRank asc) {
      ${STATUS}, title, state, district, village, season, year, sowingDate, plotSize, treatment, comparison, farmerName, beforeDate, afterDate,
      "observations": coalesce(observations, []),
      "crop": crop->{ title, "slug": slug.current },
      "products": coalesce(products[]->${PRODUCT_REF}, []),
      "beforeImage": beforeImage${IMAGE},
      "afterImage": afterImage${IMAGE},
      "testimonialId": testimonial._ref
    }`);
    return rows.flatMap((row, index): DemoPlot[] => {
      const before = mapImage(row.beforeImage);
      const after = mapImage(row.afterImage);
      if (!before || !after || !row.crop) return [];
      return [
        {
          id: row.id,
          status: status(row.originalId),
          title: row.title ?? row.crop.title,
          crop: row.crop,
          products: row.products,
          state: row.state,
          district: row.district,
          village: row.village ?? undefined,
          season: SEASONS.includes(row.season) ? row.season : 'kharif',
          year: row.year,
          sowingDate: row.sowingDate ?? undefined,
          plotSize: row.plotSize ?? undefined,
          treatment: row.treatment,
          comparison: row.comparison,
          observations: row.observations,
          before: { ...before, capturedOn: row.beforeDate ?? undefined },
          after: { ...after, capturedOn: row.afterDate ?? undefined },
          farmerName: row.farmerName ?? undefined,
          testimonialId: row.testimonialId ?? undefined,
          order: index,
        },
      ];
    });
  },

  async getGalleryItems() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "galleryItem" && visible != false] | order(orderRank asc) {
      ${STATUS}, title, state, district, date, "image": image${IMAGE}, "category": category->{ title, "slug": slug.current }
    }`);
    return rows.flatMap((row, index): GalleryItem[] => {
      const image = mapImage(row.image);
      if (!image || !row.category) return [];
      return [
        {
          id: row.id,
          status: status(row.originalId),
          image,
          title: row.title,
          category: row.category,
          state: row.state ?? undefined,
          district: row.district ?? undefined,
          date: row.date ?? undefined,
          order: index,
        },
      ];
    });
  },

  getGalleryCategories: () => sanityFetch(`*[_type == "galleryCategory"] | order(title asc){ title, "slug": slug.current }`),

  async getArticles() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
      ${STATUS}, title, "slug": slug.current, excerpt, standfirst, publishedAt, reviewedBy, reviewedOn, seo,
      "cover": cover${IMAGE},
      "categories": coalesce(categories[]->${TERM}, []),
      "author": author->{ name, role },
      "body": body${RICH},
      "sources": coalesce(sources[]{ title, publisher, url }, []),
      "relatedProductSlugs": coalesce(relatedProducts[]->slug.current, []),
      "relatedArticleSlugs": coalesce(relatedArticles[]->slug.current, [])
    }`);
    return rows.map((row): Article => {
      const body = mapRichText(row.body);
      return {
        id: row.id,
        status: status(row.originalId),
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt ?? '',
        standfirst: row.standfirst ?? undefined,
        cover: mapImage(row.cover),
        categories: row.categories,
        author: row.author ?? { name: 'Oceania Fertilizers' },
        publishedAt: row.publishedAt ?? undefined,
        readingMinutes: readingMinutes(body),
        body,
        updatedAt: row.updatedAt,
        reviewedBy: row.reviewedBy ?? undefined,
        reviewedOn: row.reviewedOn ?? undefined,
        sources: row.sources,
        relatedProductSlugs: row.relatedProductSlugs.filter(Boolean),
        relatedArticleSlugs: row.relatedArticleSlugs.filter(Boolean),
        seo: row.seo ?? undefined,
      };
    });
  },

  getArticleCategories: () => sanityFetch(`*[_type == "articleCategory"] | order(title asc) ${TERM}`),

  async getLegalPage(slug) {
    const raw = await sanityFetch<Record<string, any> | null>(`*[_id == $id][0]{ title, summary, lastUpdated, approved, "body": body${RICH} }`, {
      id: `legal.${slug}`,
    });
    if (!raw?.title) return localSource.getLegalPage(slug);
    return {
      slug,
      title: raw.title,
      summary: raw.summary ?? '',
      body: mapRichText(raw.body),
      lastUpdated: raw.lastUpdated,
      approved: Boolean(raw.approved),
    };
  },

  async getPageIntro(key: PageIntroKey) {
    const raw = await sanityFetch<Record<string, any> | null>(`*[_id == $id][0]{ title, standfirst, seoTitle, seoDescription, "image": image${IMAGE} }`, {
      id: `pageIntro.${key}`,
    });
    const fallback = await localSource.getPageIntro(key);
    if (!raw?.title) return fallback;
    return {
      key,
      title: raw.title,
      standfirst: raw.standfirst ?? fallback.standfirst,
      image: mapImage(raw.image) ?? fallback.image,
      seo: { title: raw.seoTitle ?? fallback.seo.title, description: raw.seoDescription ?? fallback.seo.description },
    };
  },

  async getFaqs() {
    const rows = await sanityFetch<Record<string, any>[]>(`*[_type == "faq"] | order(orderRank asc){ "id": _id, question, topic, "answer": answer${RICH} }`);
    return rows.map((row, index): Faq => ({ id: row.id, question: row.question, topic: row.topic ?? 'general', answer: mapRichText(row.answer), order: index }));
  },
};
