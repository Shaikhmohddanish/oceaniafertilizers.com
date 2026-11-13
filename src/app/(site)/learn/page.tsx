import type { Metadata } from 'next';
import Link from 'next/link';

import { EmptyState } from '@/components/content/EmptyState';
import { FilterBar } from '@/components/content/FilterBar';
import { ArticleCard } from '@/components/learn/ArticleCard';
import { VideoCard } from '@/components/learn/VideoCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Picture } from '@/components/media/Picture';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import { PendingTag } from '@/components/ui/PendingTag';
import { getActiveArticleCategories, getArticles, getFarmingVideos, getHomePage, getPageIntro } from '@/content/repository';
import type { ArticleCategory } from '@/content/types';
import { formatDate } from '@/lib/format';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('learn');
  return pageMetadata({ ...intro.seo, path: '/learn' });
}

/*
 * "Learn farming together" (the client's line): farmer videos, the practice
 * topics, then the guides. Videos and guides each appear once published.
 */
export default async function LearnPage() {
  const [intro, home, videos, articles, articleCategories] = await Promise.all([
    getPageIntro('learn'),
    getHomePage(),
    getFarmingVideos(),
    getArticles(),
    getActiveArticleCategories(),
  ]);
  const [lead, ...rest] = articles;
  const videoTopics = [...new Map(videos.flatMap((video) => (video.topic ? [[video.topic.slug, video.topic]] : []))).values()] as ArticleCategory[];
  const practices = home.practices;

  return (
    <>
      <PageHeader title={intro.title} standfirst={intro.standfirst} crumbs={[{ label: 'Learn', href: '/learn' }]} />

      <section aria-labelledby="videos-title" className="bg-paper pb-[var(--section-space)]">
        <div className="container-site">
          <div className="border-t border-[color:var(--line-strong)] pt-10">
            <h2 id="videos-title" className="type-h2 text-pine-700">
              Farmer videos
            </h2>
            {videos.length > 0 ? (
              <>
                {videoTopics.length > 1 ? (
                  <FilterBar
                    listId="video-list"
                    itemLabel={{ one: 'video', many: 'videos' }}
                    className="mt-8"
                    groups={[{ key: 'topic', label: 'Topic', options: videoTopics.map((topic) => ({ value: topic.slug, label: topic.title })) }]}
                  />
                ) : null}
                <ul id="video-list" className="mt-10 grid gap-x-[var(--column-gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video, index) => (
                    <li key={video.id} data-filter-item="" data-filter-topic={video.topic?.slug ?? ''}>
                      <VideoCard video={video} revealIndex={index % 3} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-6 max-w-[56ch] text-ink-700">
                Short videos from farmers and our team will appear here. Every farmer who appears has agreed to be shown.
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="practices-title" className="section-space render-later bg-surface">
        <div className="container-site grid-site gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow>{practices.eyebrow}</Eyebrow>
            <h2 id="practices-title" className="type-h2 mt-6 max-w-[12ch] text-pine-700">
              <Lines text={practices.headline} />
            </h2>
            <p className="mt-6 max-w-[36ch] text-ink-700">{practices.intro}</p>
          </div>
          <ul className="col-span-12 lg:col-span-7 lg:col-start-6">
            {practices.topics.map((topic) => (
              <li key={topic.title} className="grid gap-x-8 border-t border-[color:var(--line)] py-7 last:border-b sm:grid-cols-2 sm:items-baseline">
                <h3 className="type-h3 text-pine-700">{topic.title}</h3>
                <p className="mt-2 text-ink-700 sm:mt-0">{topic.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="guides-title" className="section-space render-later bg-paper">
        <div className="container-site">
          <h2 id="guides-title" className="type-h2 text-pine-700">
            Guides
          </h2>
          {lead ? (
            <>
              <article className="group relative grid-site mt-10 items-end gap-y-8 border-t border-[color:var(--line-strong)] pt-10">
                {lead.cover ? (
                  <div className="relative col-span-12 aspect-[3/2] overflow-hidden bg-sand-200 lg:col-span-7">
                    <Picture
                      image={lead.cover}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <div className="flex flex-wrap items-center gap-3">
                    {lead.categories[0] ? <p className="type-label text-clay-700">{lead.categories[0].title}</p> : null}
                    <PendingTag status={lead.status} />
                  </div>
                  <h3 className="type-h2 mt-4 text-pine-700">
                    <Link href={`/learn/${lead.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-ink-700">{lead.excerpt}</p>
                  <p className="type-caption mt-5 text-ink-500">
                    {lead.publishedAt ? formatDate(lead.publishedAt) : 'Draft'} / {lead.readingMinutes} min read
                  </p>
                </div>
                <span aria-hidden="true" className="pointer-events-none absolute -inset-2 hidden outline-2 outline-clay-700 group-has-[a:focus-visible]:block" />
              </article>

              {rest.length > 0 ? (
                <div className="mt-[var(--section-space)]">
                  {articleCategories.length > 1 ? (
                    <FilterBar
                      listId="article-list"
                      itemLabel={{ one: 'guide', many: 'guides' }}
                      className="mb-12"
                      groups={[
                        {
                          key: 'category',
                          label: 'Topic',
                          options: articleCategories.map((category) => ({ value: category.slug, label: category.title })),
                        },
                      ]}
                    />
                  ) : null}
                  <ul id="article-list" className="grid gap-x-[var(--column-gap)] gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article, index) => (
                      <li
                        key={article.id}
                        data-filter-item=""
                        data-filter-category={article.categories.map((category) => category.slug).join('|')}
                      >
                        <ArticleCard article={article} revealIndex={index % 3} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="Guides are on their way."
              body="We publish guides once an agronomist has reviewed them. Subscribe to the newsletter at the foot of this page to hear when new ones appear."
              action={{ label: 'Get crop advice now', href: '/advice' }}
            />
          )}
        </div>
      </section>
    </>
  );
}
