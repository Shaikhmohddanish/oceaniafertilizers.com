import type { Metadata } from 'next';

import { EmptyState } from '@/components/content/EmptyState';
import { FilterBar } from '@/components/content/FilterBar';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { VideoStory } from '@/components/proof/VideoStory';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPageIntro, getSiteSettings, getTestimonials } from '@/content/repository';
import { videoJsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('farmerStories');
  return pageMetadata({ ...intro.seo, path: '/farmer-stories' });
}

const unique = <T,>(values: T[]) => Array.from(new Set(values));

export default async function FarmerStoriesPage() {
  const [intro, stories, settings] = await Promise.all([getPageIntro('farmerStories'), getTestimonials(), getSiteSettings()]);
  const [featured, ...rest] = [...stories].sort((a, b) => Number(b.featured) - Number(a.featured));
  const videoData = stories.map(videoJsonLd).filter((item): item is NonNullable<typeof item> => Boolean(item));

  const crops = unique(stories.map((story) => story.crop?.title).filter((value): value is string => Boolean(value)));
  const products = unique(stories.flatMap((story) => story.products.map((product) => product.name)));

  return (
    <>
      {videoData.length > 0 ? <JsonLd data={videoData} /> : null}
      <PageHeader
        variant="split"
        title={intro.title}
        standfirst={intro.standfirst}
        image={intro.image}
        crumbs={[{ label: 'Farmer stories', href: '/farmer-stories' }]}
      />

      <section aria-labelledby="stories-title" className="bg-ivory-50 pb-[var(--section-space)]">
        <div className="container-site">
          <h2 id="stories-title" className="sr-only">
            Farmer stories
          </h2>

          {featured ? (
            <>
              <div className="grid-site gap-y-8 border-t border-[color:var(--line-strong)] pt-12">
                <div className="col-span-12 lg:col-span-8">
                  <VideoStory story={featured} size="feature" />
                </div>
                {featured.summary ? (
                  <p className="col-span-12 text-ink-700 lg:col-span-3 lg:col-start-10 lg:self-end">{featured.summary}</p>
                ) : null}
              </div>

              {rest.length > 0 ? (
                <div className="mt-[var(--section-space)]">
                  {rest.length > 6 ? (
                    <FilterBar
                      listId="story-list"
                      itemLabel={{ one: 'story', many: 'stories' }}
                      className="mb-12"
                      groups={[
                        { key: 'crop', label: 'Crop', options: crops.map((crop) => ({ value: crop, label: crop })) },
                        {
                          key: 'product',
                          label: 'Product',
                          options: products.map((product) => ({ value: product, label: product })),
                        },
                      ]}
                    />
                  ) : null}
                  <ul id="story-list" className="grid gap-x-[var(--column-gap)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((story) => (
                      <li
                        key={story.id}
                        data-filter-item=""
                        data-filter-crop={story.crop?.title ?? ''}
                        data-filter-product={story.products.map((product) => product.name).join('|')}
                      >
                        <VideoStory story={story} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="Farmer stories will appear here."
              body="We publish a story only when the farmer has agreed to share it, in their own words. If you have used Oceania inputs, we would like to hear how it went for you."
              action={{ label: 'Tell us your experience', href: '/contact?topic=experience' }}
              note="Every story is reviewed with the farmer before it is published."
            />
          )}
        </div>
      </section>

      <section aria-labelledby="stay-in-touch-title" className="section-space bg-ivory-100">
        <div className="container-site grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <h2 id="stay-in-touch-title" className="type-h2 max-w-[16ch] text-forest-900">
              New stories and field results, as they are published.
            </h2>
            {settings.whatsappChannelUrl ? (
              <p className="mt-6 text-ink-700">
                Or follow the{' '}
                <a href={settings.whatsappChannelUrl} className="link-inline font-medium text-forest-800" rel="noopener noreferrer" target="_blank">
                  Oceania WhatsApp channel
                </a>
                .
              </p>
            ) : null}
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <NewsletterForm tone="light" id="stories-newsletter" />
          </div>
        </div>
      </section>
    </>
  );
}
