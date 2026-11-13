import type { Metadata } from 'next';
import Link from 'next/link';

import { EmptyState } from '@/components/content/EmptyState';
import { FilterBar } from '@/components/content/FilterBar';
import { ArticleCard } from '@/components/insights/ArticleCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Picture } from '@/components/media/Picture';
import { PendingTag } from '@/components/ui/PendingTag';
import { getActiveArticleCategories, getArticles, getPageIntro } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('insights');
  return pageMetadata({ ...intro.seo, path: '/insights' });
}

export default async function InsightsPage() {
  const [intro, articles, categories] = await Promise.all([getPageIntro('insights'), getArticles(), getActiveArticleCategories()]);
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHeader
        title={intro.title}
        standfirst={intro.standfirst}
        crumbs={[{ label: 'Insights', href: '/insights' }]}
      />

      <section aria-labelledby="articles-title" className="bg-ivory-50 pb-[var(--section-space)]">
        <div className="container-site">
          <h2 id="articles-title" className="sr-only">
            Articles
          </h2>
          {lead ? (
            <>
              <article className="group relative grid-site items-end gap-y-8 border-t border-[color:var(--line-strong)] pt-10">
                {lead.cover ? (
                  <div className="relative col-span-12 aspect-[3/2] overflow-hidden bg-sand-200 lg:col-span-7">
                    <Picture
                      image={lead.cover}
                      fill
                      preload
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <div className="flex flex-wrap items-center gap-3">
                    {lead.categories[0] ? <p className="type-label text-gold-700">{lead.categories[0].title}</p> : null}
                    <PendingTag status={lead.status} />
                  </div>
                  <h3 className="type-h2 mt-4 text-forest-900">
                    <Link href={`/insights/${lead.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-ink-700">{lead.excerpt}</p>
                  <p className="type-caption mt-5 text-ink-500">
                    {lead.publishedAt ? formatDate(lead.publishedAt) : 'Draft'} / {lead.readingMinutes} min read
                  </p>
                </div>
                <span aria-hidden="true" className="pointer-events-none absolute -inset-2 hidden outline-2 outline-gold-700 group-has-[a:focus-visible]:block" />
              </article>

              {rest.length > 0 ? (
                <div className="mt-[var(--section-space)]">
                  {categories.length > 1 ? (
                    <FilterBar
                      listId="article-list"
                      itemLabel={{ one: 'article', many: 'articles' }}
                      className="mb-12"
                      groups={[
                        {
                          key: 'category',
                          label: 'Topic',
                          options: categories.map((category) => ({ value: category.slug, label: category.title })),
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
              title="Articles are on their way."
              body="We publish articles once an agronomist has reviewed them. Subscribe to the newsletter at the foot of this page to hear when new ones appear."
              action={{ label: 'See the products', href: '/products' }}
            />
          )}
        </div>
      </section>
    </>
  );
}
