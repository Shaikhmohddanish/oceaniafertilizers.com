import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RichText } from '@/components/content/RichText';
import { InlineVideo } from '@/components/learn/InlineVideo';
import { VideoCard } from '@/components/learn/VideoCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { PendingTag } from '@/components/ui/PendingTag';
import { getFarmingVideo, getFarmingVideos, getProducts } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { presenterLine } from '@/lib/learn';
import { farmingVideoJsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const videos = await getFarmingVideos();
  return videos.map((video) => ({ slug: video.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const video = await getFarmingVideo(slug);
  if (!video) return {};
  return pageMetadata({
    title: video.title,
    description: video.summary,
    path: `/learn/videos/${video.slug}`,
    noindex: video.status === 'pending',
  });
}

/** One farmer video, on its own page so it can be shared on WhatsApp. */
export default async function FarmingVideoPage({ params }: Params) {
  const { slug } = await params;
  const video = await getFarmingVideo(slug);
  if (!video) notFound();

  const [videos, products] = await Promise.all([getFarmingVideos(), getProducts()]);
  const related = videos
    .filter((item) => item.slug !== video.slug)
    .sort((a, b) => Number(b.topic?.slug === video.topic?.slug) - Number(a.topic?.slug === video.topic?.slug))
    .slice(0, 3);
  const relatedProducts = video.products
    .map((ref) => products.find((product) => product.slug === ref.slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const jsonLd = video.status === 'published' ? farmingVideoJsonLd(video) : null;
  const askHref = relatedProducts[0] ? `/advice?product=${relatedProducts[0].slug}` : '/advice';

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <article className="bg-paper pt-8 pb-[var(--section-space)] lg:pt-12">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: 'Learn', href: '/learn' },
              { label: video.title, href: `/learn/videos/${video.slug}` },
            ]}
          />
          <header className="mt-10 max-w-[52rem] lg:mt-14">
            <div className="flex flex-wrap items-center gap-3">
              {video.topic ? <p className="type-label text-clay-700">{video.topic.title}</p> : null}
              {video.crop ? <p className="type-label text-ink-500">{video.crop.title}</p> : null}
              <PendingTag status={video.status} />
            </div>
            <h1 className="type-h1 mt-5 text-pine-700">{video.title}</h1>
            <p className="type-lead mt-6 text-ink-700">{video.summary}</p>
            <p className="type-small mt-5 text-ink-500">
              {presenterLine(video)} <span aria-hidden="true">/</span> {formatDate(video.publishedAt)}
            </p>
          </header>

          <div className="grid-site mt-12 gap-y-12">
            <div className="col-span-12 lg:col-span-8">
              <InlineVideo video={video} />
              {video.transcript ? (
                <details className="group mt-6 border-y border-[color:var(--line-strong)]">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-bold text-pine-700 [&::-webkit-details-marker]:hidden">
                    Read the transcript in English
                    <span aria-hidden="true" className="text-2xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6">
                    <RichText value={video.transcript} />
                  </div>
                </details>
              ) : null}
            </div>

            <aside className="col-span-12 lg:col-span-4">
              {video.points.length > 0 ? (
                <>
                  <h2 className="type-h3 text-pine-700">What you will learn</h2>
                  <ul className="mt-5 space-y-3">
                    {video.points.map((point) => (
                      <li key={point} className="flex gap-3 text-ink-700">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-clay-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className={video.points.length > 0 ? 'mt-10 border-t border-[color:var(--line-strong)] pt-8' : ''}>
                <h2 className="type-h3 text-pine-700">Questions about your crop?</h2>
                <p className="mt-3 text-ink-700">Tell us what you are seeing in your field. Our team will call you back.</p>
                <ButtonLink href={askHref} className="mt-6">
                  Get crop advice
                </ButtonLink>
              </div>
            </aside>
          </div>

          {relatedProducts.length > 0 ? (
            <section aria-labelledby="video-products-title" className="mt-[var(--section-space)] border-t border-[color:var(--line-strong)] pt-12">
              <h2 id="video-products-title" className="type-h2 text-pine-700">
                Products in this video
              </h2>
              <div className="mt-10 grid gap-x-[var(--column-gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" showOrder />
                ))}
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section aria-labelledby="more-videos-title" className="mt-[var(--section-space)] border-t border-[color:var(--line-strong)] pt-12">
              <h2 id="more-videos-title" className="type-h2 text-pine-700">
                More farmer videos
              </h2>
              <div className="mt-10 grid gap-x-[var(--column-gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <VideoCard key={item.id} video={item} revealIndex={index} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}
