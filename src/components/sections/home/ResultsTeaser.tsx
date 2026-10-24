import { FieldRecordCard } from '@/components/proof/FieldRecordCard';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { DemoPlot, HomePage } from '@/content/types';

/** Renders only once documented, consented demo plots are published. */
export function ResultsTeaser({ section, plots }: { section: HomePage['results']; plots: DemoPlot[] }) {
  if (plots.length === 0) return null;
  return (
    <section aria-labelledby="results-teaser-title" className="section-space render-later bg-paper">
      <div className="container-site">
        <div className="grid-site items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7" data-reveal="rise">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 id="results-teaser-title" className="type-h1 mt-6 text-forest-900">
              <Lines text={section.headline} />
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-ink-700">{section.intro}</p>
            <TextLink href="/demo-plots" className="mt-5 text-forest-800">
              All field results
            </TextLink>
          </div>
        </div>
        <ul className="mt-14 grid gap-x-[var(--column-gap)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {plots.slice(0, 3).map((plot) => (
            <li key={plot.id}>
              <FieldRecordCard plot={plot} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
