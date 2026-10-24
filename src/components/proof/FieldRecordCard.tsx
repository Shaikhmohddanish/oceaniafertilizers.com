import Link from 'next/link';

import { CompareSlider } from '@/components/media/CompareSlider';
import { PendingTag } from '@/components/ui/PendingTag';
import type { DemoPlot } from '@/content/types';
import { formatDate, formatSeason } from '@/lib/format';

/**
 * One demo plot, written up like a field record: what was grown, where and
 * when, what it was compared with, and what was observed. Never phone numbers.
 */
export function FieldRecordCard({ plot, headingLevel: Heading = 'h3' }: { plot: DemoPlot; headingLevel?: 'h2' | 'h3' }) {
  const place = [plot.village, plot.district, plot.state].filter(Boolean).join(', ');
  const productNames = plot.products.map((product) => product.name).join(' + ');

  return (
    <article className="flex h-full flex-col" data-reveal="rise">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Heading className="type-h3 text-forest-900">{plot.crop.title}</Heading>
          <p className="type-small mt-1 font-medium text-forest-700">{productNames}</p>
        </div>
        <PendingTag status={plot.status} />
      </header>
      <p className="type-caption mt-3 flex flex-wrap gap-x-4 gap-y-1 text-ink-500">
        <span>{place}</span>
        <span className="type-numeral">{formatSeason(plot.season, plot.year)}</span>
      </p>

      <div className="mt-5">
        <CompareSlider
          before={plot.before}
          after={plot.after}
          label={`Compare the ${plot.crop.title.toLowerCase()} plot before and after`}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
        {plot.before.capturedOn || plot.after.capturedOn ? (
          <p className="type-caption mt-2 text-ink-500">
            {plot.before.capturedOn ? `Before: ${formatDate(plot.before.capturedOn)}` : ''}
            {plot.before.capturedOn && plot.after.capturedOn ? '. ' : ''}
            {plot.after.capturedOn ? `After: ${formatDate(plot.after.capturedOn)}` : ''}
          </p>
        ) : null}
      </div>

      <ul className="mt-5 space-y-2 text-ink-900">
        {plot.observations.map((observation) => (
          <li key={observation} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-gold-500" />
            <span>{observation}</span>
          </li>
        ))}
      </ul>

      <details className="group mt-6 border-t border-[color:var(--line-strong)]">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-medium text-forest-800 [&::-webkit-details-marker]:hidden">
          Plot details
          <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <dl className="type-small grid grid-cols-[minmax(0,8rem)_1fr] gap-x-4 gap-y-3 pb-5 text-ink-700">
          <dt className="text-ink-500">Treatment</dt>
          <dd>{plot.treatment}</dd>
          <dt className="text-ink-500">Compared with</dt>
          <dd>{plot.comparison}</dd>
          {plot.sowingDate ? (
            <>
              <dt className="text-ink-500">Sowing date</dt>
              <dd>{formatDate(plot.sowingDate)}</dd>
            </>
          ) : null}
          {plot.plotSize ? (
            <>
              <dt className="text-ink-500">Plot size</dt>
              <dd>{plot.plotSize}</dd>
            </>
          ) : null}
          {plot.farmerName ? (
            <>
              <dt className="text-ink-500">Farmer</dt>
              <dd>{plot.farmerName}</dd>
            </>
          ) : null}
        </dl>
      </details>

      <p className="type-caption mt-auto pt-4 text-ink-500">
        Observed on one farm. Results vary with soil, weather and crop management.
        {plot.testimonialId ? (
          <>
            {' '}
            <Link href={`/farmer-stories#${plot.testimonialId}`} className="link-inline text-forest-800">
              Watch the farmer&apos;s story
            </Link>
            .
          </>
        ) : null}
      </p>
    </article>
  );
}
