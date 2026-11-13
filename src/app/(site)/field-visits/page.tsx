import type { Metadata } from 'next';

import { EmptyState } from '@/components/content/EmptyState';
import { FilterBar, type FilterGroup } from '@/components/content/FilterBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { FieldRecordCard } from '@/components/proof/FieldRecordCard';
import { getDemoPlots, getPageIntro } from '@/content/repository';
import { formatSeason } from '@/lib/format';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('demoPlots');
  return pageMetadata({ ...intro.seo, path: '/demo-plots' });
}

/* The publishing standard each record meets. Copy for client approval. */
const standard = [
  { title: 'The plot', body: 'Crop, location, season and plot size, with the farmer named only if they agree.' },
  { title: 'The treatment', body: 'Which Oceania products were used, how much and how they were applied.' },
  { title: 'The comparison', body: 'What the neighbouring or earlier plot received, so the difference means something.' },
  { title: 'The observation', body: 'What was seen, with dated photographs, written as observation rather than promise.' },
];

const sortedUnique = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

export default async function DemoPlotsPage() {
  const [intro, plots] = await Promise.all([getPageIntro('demoPlots'), getDemoPlots()]);

  const groups: FilterGroup[] = [
    { key: 'crop', label: 'Crop', options: sortedUnique(plots.map((plot) => plot.crop.title)).map((value) => ({ value, label: value })) },
    {
      key: 'product',
      label: 'Product',
      options: sortedUnique(plots.flatMap((plot) => plot.products.map((product) => product.name))).map((value) => ({ value, label: value })),
    },
    { key: 'state', label: 'State', options: sortedUnique(plots.map((plot) => plot.state)).map((value) => ({ value, label: value })) },
    { key: 'district', label: 'District', options: sortedUnique(plots.map((plot) => plot.district)).map((value) => ({ value, label: value })) },
    {
      key: 'season',
      label: 'Season',
      options: sortedUnique(plots.map((plot) => formatSeason(plot.season, plot.year))).map((value) => ({ value, label: value })),
    },
  ].filter((group) => group.options.length > 1);

  return (
    <>
      <PageHeader
        variant="banner"
        title={intro.title}
        standfirst={intro.standfirst}
        image={intro.image}
        crumbs={[{ label: 'Field results', href: '/demo-plots' }]}
      />

      <section aria-labelledby="standard-title" className="section-space bg-ivory-50">
        <div className="container-site grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="standard-title" className="type-h2 max-w-[14ch] text-forest-900">
              Four things every plot record shows.
            </h2>
          </div>
          <ol className="col-span-12 grid gap-x-[var(--column-gap)] sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {standard.map((item, index) => (
              <li key={item.title} className="border-t border-[color:var(--line-strong)] py-6" data-reveal="rise" style={{ ['--reveal-index' as string]: index }}>
                <h3 className="type-h3 text-forest-900">{item.title}</h3>
                <p className="mt-3 text-ink-700">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="plots-title" className="bg-ivory-50 pb-[var(--section-space)]">
        <div className="container-site">
          {plots.length > 0 ? (
            <>
              <h2 id="plots-title" className="type-h2 text-forest-900">
                Plot records
              </h2>
              {groups.length > 0 ? (
                <FilterBar listId="plot-list" itemLabel={{ one: 'plot', many: 'plots' }} groups={groups} className="mt-10" />
              ) : null}
              <ul id="plot-list" className="mt-12 grid gap-x-[var(--column-gap)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {plots.map((plot) => (
                  <li
                    key={plot.id}
                    data-filter-item=""
                    data-filter-crop={plot.crop.title}
                    data-filter-product={plot.products.map((product) => product.name).join('|')}
                    data-filter-state={plot.state}
                    data-filter-district={plot.district}
                    data-filter-season={formatSeason(plot.season, plot.year)}
                  >
                    <FieldRecordCard plot={plot} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div>
              <EmptyState
                headingId="plots-title"
                title="Plot records will be published here."
                body="Each record is published once the season's observations are complete and the farmer has reviewed and approved it. If you would like to host a demo plot on your farm, register your interest."
                action={{ label: 'Host a demo plot', href: '/join-oceania?interest=demo-plot' }}
                note="Demo plots are documented with the farmer's permission. Contact details are never published."
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
