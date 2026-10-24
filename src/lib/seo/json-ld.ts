import type { Article, ImageAsset, Product, SiteSettings, Testimonial } from '@/content/types';
import { toPlainText, truncate } from '@/content/text';
import { absoluteUrl, siteUrl } from '@/lib/site-config';

/*
 * Structured data builders. Each one emits only fields backed by real content:
 * no invented ratings, prices, stock levels or contact points.
 */

const CONTEXT = 'https://schema.org';
export const organizationId = `${siteUrl}/#organization`;

export function imageUrl(image: ImageAsset | undefined): string | undefined {
  if (!image) return undefined;
  return absoluteUrl(typeof image.src === 'string' ? image.src : image.src.src);
}

export function organizationJsonLd(settings: SiteSettings) {
  const data: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': organizationId,
    name: settings.siteName,
    url: siteUrl,
    description: settings.description,
    areaServed: { '@type': 'Country', name: 'India' },
  };
  if (settings.legalName) data.legalName = settings.legalName;
  const logo = imageUrl(settings.logo);
  if (logo) data.logo = logo;

  const sameAs = settings.social.map((item) => item.url);
  if (sameAs.length > 0) data.sameAs = sameAs;

  const { phone, email, address } = settings.contact;
  if (phone || email) {
    data.contactPoint = [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en'],
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
      },
    ];
  }
  if (address && (address.city || address.state)) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: [address.line1, address.line2].filter(Boolean).join(', ') || undefined,
      addressLocality: address.city ?? address.district,
      addressRegion: address.state,
      postalCode: address.pinCode,
      addressCountry: 'IN',
    };
  }
  return data;
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: settings.siteName,
    inLanguage: 'en-IN',
    publisher: { '@id': organizationId },
  };
}

export function breadcrumbJsonLd(trail: { label: string; href: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/**
 * Product markup with identity fields only. Prices, offers and ratings are
 * deliberately absent because the site does not publish them, which means no
 * Product rich result until they exist. That is by design.
 */
export function productJsonLd(product: Product) {
  const images = product.images.map(imageUrl).filter((url): url is string => Boolean(url));
  return {
    '@context': CONTEXT,
    '@type': 'Product',
    '@id': `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: truncate(product.intro ?? toPlainText(product.description), 300),
    category: product.category.title,
    url: absoluteUrl(`/products/${product.slug}`),
    brand: { '@type': 'Brand', name: 'Oceania Fertilizers' },
    manufacturer: { '@id': organizationId },
    ...(images.length > 0 ? { image: images } : {}),
  };
}

export function articleJsonLd(article: Article) {
  const image = imageUrl(article.cover);
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(`/insights/${article.slug}`),
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    inLanguage: 'en-IN',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: article.author.name, url: siteUrl },
    publisher: { '@id': organizationId },
    ...(image ? { image: [image] } : {}),
  };
}

function isoDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `PT${minutes > 0 ? `${minutes}M` : ''}${seconds}S`;
}

export function videoEmbedUrl(video: Testimonial['video']) {
  return video.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}`
    : `https://player.vimeo.com/video/${video.id}`;
}

/** Returns null unless every field Google requires for VideoObject is present. */
export function videoJsonLd(testimonial: Testimonial) {
  const thumbnail =
    imageUrl(testimonial.poster) ??
    (testimonial.video.provider === 'youtube' ? `https://i.ytimg.com/vi/${testimonial.video.id}/hqdefault.jpg` : undefined);
  const description = testimonial.summary ?? testimonial.quote;
  if (!thumbnail || !description || !testimonial.uploadedOn) return null;

  const place = [testimonial.district, testimonial.state].filter(Boolean).join(', ');
  return {
    '@context': CONTEXT,
    '@type': 'VideoObject',
    name: `${testimonial.farmerName}${place ? `, ${place}` : ''}: a farmer's experience`,
    description,
    thumbnailUrl: [thumbnail],
    uploadDate: testimonial.uploadedOn,
    embedUrl: videoEmbedUrl(testimonial.video),
    contentUrl: testimonial.video.url,
    ...(testimonial.video.durationSeconds ? { duration: isoDuration(testimonial.video.durationSeconds) } : {}),
    ...(testimonial.transcript ? { transcript: toPlainText(testimonial.transcript) } : {}),
  };
}
