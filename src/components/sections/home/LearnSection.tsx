import { ArticleCard } from '@/components/learn/ArticleCard';
import { VideoCard } from '@/components/learn/VideoCard';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { ArticleSummary, FarmingVideo, HomePage } from '@/content/types';

/**
 * "Learn farming together": farmer videos first, then the client's practice
 * topics, then the latest guides. Each block appears only when it has content.
 */
export function LearnSection({
  learn,
  practices,
  videos,
  articles,
}: {
  learn: HomePage['learn'];
  practices: HomePage['practices'];
  videos: FarmingVideo[];
  articles: ArticleSummary[];
}) {
  return (
    <section aria-labelledby="learn-title" className="section-space render-later bg-surface">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal="rise">
          <div>
            <h2 id="learn-title" className="type-h1 max-w-[14ch] text-pine-700">
              <Lines text={learn.headline} />
            </h2>
            <p className="type-lead mt-6 max-w-[40ch] text-ink-700">{learn.intro}</p>
          </div>
          <TextLink href="/learn" className="text-pine-700">
            Everything in Learn
          </TextLink>
        </div>

        {videos.length > 0 ? (
          <div className="mt-14 grid gap-x-[var(--column-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(0, 3).map((video, index) => (
              <VideoCard key={video.id} video={video} revealIndex={index} />
            ))}
          </div>
        ) : null}

        <div className="grid-site mt-[var(--section-space)] gap-y-12">
          <div className="col-span-12 lg:col-span-4" data-reveal="rise">
            <Eyebrow>{practices.eyebrow}</Eyebrow>
            <h3 className="type-h2 mt-6 max-w-[12ch] text-pine-700">
              <Lines text={practices.headline} />
            </h3>
            <p className="mt-6 max-w-[36ch] text-ink-700">{practices.intro}</p>
          </div>
          <ul className="col-span-12 lg:col-span-7 lg:col-start-6">
            {practices.topics.map((topic, index) => (
              <li
                key={topic.title}
                data-reveal="rise"
                style={{ ['--reveal-index' as string]: index }}
                className="grid gap-x-8 border-t border-[color:var(--line)] py-7 last:border-b sm:grid-cols-2 sm:items-baseline"
              >
                <h4 className="type-h3 text-pine-700">{topic.title}</h4>
                <p className="mt-2 text-ink-700 sm:mt-0">{topic.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {articles.length > 0 ? (
          <div className="mt-[var(--section-space)]">
            <h3 className="type-h2 border-b border-[color:var(--line)] pb-6 text-pine-700">Latest guides</h3>
            <div className="mt-10 grid gap-x-[var(--column-gap)] gap-y-12 md:grid-cols-3">
              {articles.slice(0, 3).map((article, index) => (
                <ArticleCard key={article.id} article={article} revealIndex={index} headingLevel="h4" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
