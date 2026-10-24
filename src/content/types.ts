import type { StaticImageData } from 'next/image';

/**
 * Normalised content types. Both content sources (local seed and Sanity)
 * map into these shapes, so components never know where data came from.
 */

/** "pending" means not yet approved by Oceania. Pending items never render in production. */
export type PublicationStatus = 'published' | 'pending';

export type ImageCredit = {
  author: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
};

export type ImageAsset = {
  /** A static import (local files) or an absolute CDN URL (Sanity). */
  src: StaticImageData | string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: ImageCredit;
  blurDataURL?: string;
  /** Focal point, 0 to 1 on each axis, used for object-position when cropping. */
  focal?: { x: number; y: number };
  /** Backdrop colour for pack shots so the frame blends with the image. */
  backdrop?: string;
  /** True for temporary licensed imagery that should be replaced. */
  temporary?: boolean;
};

/* Rich text: a small subset of Portable Text shared by both sources. */

export type RichTextMarkDef = { _key: string; _type: 'link'; href: string };

export type RichTextSpan = { _type: 'span'; _key: string; text: string; marks?: string[] };

export type RichTextBlock = {
  _type: 'block';
  _key: string;
  style?: 'normal' | 'h2' | 'h3' | 'blockquote';
  listItem?: 'bullet' | 'number';
  level?: number;
  children: RichTextSpan[];
  markDefs?: RichTextMarkDef[];
};

export type RichTextImage = { _type: 'figure'; _key: string; image: ImageAsset };

export type RichTextCallout = {
  _type: 'callout';
  _key: string;
  tone: 'note' | 'caution';
  title?: string;
  body: string;
};

export type RichTextProductReference = {
  _type: 'productReference';
  _key: string;
  slug: string;
  name: string;
  purpose: string;
};

export type RichTextNode = RichTextBlock | RichTextImage | RichTextCallout | RichTextProductReference;

export type RichText = RichTextNode[];

export type Seo = {
  title?: string;
  description?: string;
  image?: ImageAsset;
  noindex?: boolean;
};

export type CtaLink = { label: string; href: string };

/* Site settings */

export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'x';

export type SiteSettings = {
  siteName: string;
  shortName: string;
  tagline: string;
  description: string;
  legalName?: string;
  contact: {
    /** E.164, for example +919800000000. Empty until verified by the client. */
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      district?: string;
      state?: string;
      pinCode?: string;
    };
    hours?: string;
  };
  social: { platform: SocialPlatform; url: string }[];
  whatsappChannelUrl?: string;
  logo?: ImageAsset;
};

/* Taxonomy */

export type ProductCategory = { slug: string; title: string; description?: string };
export type ApplicationMethod = { slug: string; title: string; description?: string };
export type Crop = { slug: string; title: string };

/* Products */

export type ProductSummary = {
  id: string;
  status: PublicationStatus;
  slug: string;
  name: string;
  purpose: string;
  /** The line printed on the pack, quoted as the client's own claim. */
  tagline?: string;
  category: ProductCategory;
  applicationMethods: ApplicationMethod[];
  image?: ImageAsset;
  featured: boolean;
  order: number;
};

export type DosageRow = { value: string; basis?: string; method?: string };

export type Product = ProductSummary & {
  intro?: string;
  description: RichText;
  packSizes: string[];
  dosage: DosageRow[];
  applicationNotes?: RichText;
  suitableCrops: Crop[];
  features: string[];
  benefits: string[];
  usageGuidance?: RichText;
  safety?: RichText;
  images: ImageAsset[];
  leafletUrl?: string;
  relatedProductSlugs: string[];
  seo?: Seo;
  updatedAt: string;
};

/* Proof: farmer stories and demo plots */

export type VideoSource = {
  provider: 'youtube' | 'vimeo';
  id: string;
  url: string;
  durationSeconds?: number;
};

export type ProductRef = { slug: string; name: string };

export type Testimonial = {
  id: string;
  status: PublicationStatus;
  farmerName: string;
  district?: string;
  state?: string;
  crop?: Crop;
  products: ProductRef[];
  video: VideoSource;
  poster?: ImageAsset;
  /** Short verbatim quote from the recording. */
  quote: string;
  summary?: string;
  transcript?: RichText;
  transcriptLanguage?: string;
  recordedOn?: string;
  uploadedOn?: string;
  season?: string;
  demoPlotId?: string;
  featured: boolean;
  order: number;
};

export type Season = 'kharif' | 'rabi' | 'zaid' | 'perennial';

export type DemoPlotImage = ImageAsset & { capturedOn?: string };

export type DemoPlot = {
  id: string;
  status: PublicationStatus;
  title: string;
  crop: Crop;
  products: ProductRef[];
  state: string;
  district: string;
  village?: string;
  season: Season;
  year: number;
  sowingDate?: string;
  plotSize?: string;
  treatment: string;
  comparison: string;
  observations: string[];
  before: DemoPlotImage;
  after: DemoPlotImage;
  farmerName?: string;
  testimonialId?: string;
  order: number;
};

/* Media */

export type GalleryCategory = { slug: string; title: string };

export type GalleryItem = {
  id: string;
  status: PublicationStatus;
  image: ImageAsset;
  title: string;
  category: GalleryCategory;
  state?: string;
  district?: string;
  date?: string;
  order: number;
};

/* Insights */

export type ArticleCategory = { slug: string; title: string; description?: string };

export type Author = { name: string; role?: string };

export type SourceReference = { title: string; publisher: string; url: string };

export type ArticleSummary = {
  id: string;
  status: PublicationStatus;
  slug: string;
  title: string;
  excerpt: string;
  cover?: ImageAsset;
  categories: ArticleCategory[];
  author: Author;
  publishedAt?: string;
  readingMinutes: number;
};

export type Article = ArticleSummary & {
  standfirst?: string;
  body: RichText;
  updatedAt: string;
  reviewedBy?: string;
  reviewedOn?: string;
  sources: SourceReference[];
  relatedProductSlugs: string[];
  relatedArticleSlugs: string[];
  seo?: Seo;
};

/* Pages */

export type HomePage = {
  hero: {
    eyebrow?: string;
    headline: string;
    standfirst: string;
    image: ImageAsset;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  pillars: string[];
  chapters: { label: string; title: string; body: string; image: ImageAsset }[];
  products: { eyebrow: string; headline: string; intro: string; featuredSlugs: string[] };
  farmer: {
    eyebrow: string;
    headline: string;
    body: string;
    image: ImageAsset;
    points: { part: string; meaning: string }[];
    cta: CtaLink;
  };
  stories: { eyebrow: string; headline: string };
  results: { eyebrow: string; headline: string; intro: string };
  practices: {
    eyebrow: string;
    headline: string;
    intro: string;
    topics: { title: string; body: string }[];
  };
  partner: { eyebrow: string; headline: string; body: string; image: ImageAsset; cta: CtaLink };
  contact: { eyebrow: string; headline: string; body: string };
  seo?: Seo;
};

export type LeadershipMember = { name: string; role: string; bio: RichText; photo?: ImageAsset };

export type AboutPage = {
  hero: { headline: string; standfirst: string; image: ImageAsset };
  purpose: { headline: string; body: RichText };
  approach: { headline: string; intro: string; steps: { title: string; body: string }[] };
  principles: { headline: string; items: { title: string; body: string }[] };
  story?: { headline: string; body: RichText; image?: ImageAsset };
  leadership: LeadershipMember[];
  vision: { headline: string; body: string; image: ImageAsset };
  seo?: Seo;
};

export type PartnershipType = { key: string; title: string; description: string };

export type PartnerProgramme = {
  hero: { headline: string; standfirst: string; image: ImageAsset };
  types: PartnershipType[];
  lookFor: { headline: string; items: string[] };
  process: { headline: string; steps: { title: string; body: string }[] };
  note: string;
  formIntro: string;
  seo?: Seo;
};

/** The editable opening of each listing page. */
export type PageIntroKey = 'products' | 'demoPlots' | 'farmerStories' | 'gallery' | 'insights' | 'contact' | 'join';

export type PageIntro = {
  key: PageIntroKey;
  title: string;
  standfirst: string;
  image?: ImageAsset;
  seo: { title: string; description: string };
};

export type LegalPage = {
  slug: 'privacy-policy' | 'terms';
  title: string;
  summary: string;
  body: RichText;
  lastUpdated: string;
  approved: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: RichText;
  topic: 'partner' | 'product' | 'farmer' | 'general';
  order: number;
};
