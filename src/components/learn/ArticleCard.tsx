import Link from 'next/link';

import { Picture } from '@/components/media/Picture';
import { PendingTag } from '@/components/ui/PendingTag';
import type { ArticleSummary } from '@/content/types';
import { formatDate } from '@/lib/format';

export function ArticleCard({
  article,
  revealIndex = 0,
  headingLevel: Heading = 'h3',
}: {
  article: ArticleSummary;
  revealIndex?: number;
  headingLevel?: 'h2' | 'h3';
}) {
  const category = article.categories[0];
  return (
    <article className="group relative" data-reveal="rise" style={{ ['--reveal-index' as string]: revealIndex }}>
      {article.cover ? (
        <div className="relative aspect-[3/2] overflow-hidden bg-sand-200">
          <Picture
            image={article.cover}
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {category ? <p className="type-label text-gold-700">{category.title}</p> : null}
        <PendingTag status={article.status} />
      </div>
      <Heading className="type-h3 mt-3 text-forest-900">
        <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {article.title}
        </Link>
      </Heading>
      <p className="type-small mt-3 text-ink-700">{article.excerpt}</p>
      <p className="type-caption mt-4 text-ink-500">
        {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'} <span aria-hidden="true">/</span>{' '}
        {article.readingMinutes} min read
      </p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 hidden outline-2 outline-gold-700 group-has-[a:focus-visible]:block"
      />
    </article>
  );
}
