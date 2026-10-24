import { ArticleCard } from '@/components/insights/ArticleCard';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { ArticleSummary, HomePage } from '@/content/types';

/** "Small changes. Big impact." as a magazine contents list, then the latest articles. */
export function Practices({ section, articles }: { section: HomePage['practices']; articles: ArticleSummary[] }) {
  return (
    <section aria-labelledby="practices-title" className="section-space render-later bg-ivory-50">
      <div className="container-site">
        <div className="grid-site gap-y-12">
          <div className="col-span-12 lg:col-span-4" data-reveal="rise">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 id="practices-title" className="type-h1 mt-6 max-w-[10ch] text-forest-900">
              <Lines text={section.headline} />
            </h2>
            <p className="mt-6 max-w-[36ch] text-ink-700">{section.intro}</p>
          </div>

          <ol className="col-span-12 lg:col-span-7 lg:col-start-6">
            {section.topics.map((topic, index) => (
              <li
                key={topic.title}
                data-reveal="rise"
                style={{ ['--reveal-index' as string]: index }}
                className="grid gap-x-8 border-t border-[color:var(--line)] py-7 last:border-b sm:grid-cols-2 sm:items-baseline"
              >
                <h3 className="type-h3 text-forest-900">{topic.title}</h3>
                <p className="mt-2 text-ink-700 sm:mt-0">{topic.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {articles.length > 0 ? (
          <div className="mt-[var(--section-space)]">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[color:var(--line)] pb-6">
              <h2 className="type-h2 text-forest-900">From Insights</h2>
              <TextLink href="/insights" className="text-forest-800">
                All articles
              </TextLink>
            </div>
            <div className="mt-10 grid gap-x-[var(--column-gap)] gap-y-12 md:grid-cols-3">
              {articles.slice(0, 3).map((article, index) => (
                <ArticleCard key={article.id} article={article} revealIndex={index} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
