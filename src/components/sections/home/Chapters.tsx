import { Figure } from '@/components/media/Picture';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage } from '@/content/types';

type Chapter = HomePage['chapters'][number];

/*
 * The workbook's three banners (what Oceania is, the problem, the solution)
 * as editorial chapters. Each one uses a different composition so the
 * sequence reads like a story rather than a repeated template.
 */
function ChapterText({ chapter, className = '' }: { chapter: Chapter; className?: string }) {
  return (
    <div className={className} data-reveal="rise">
      <Eyebrow>{chapter.label}</Eyebrow>
      <h3 className="type-h2 mt-6 max-w-[16ch] text-forest-900">
        <Lines text={chapter.title} />
      </h3>
      <p className="type-body-lg mt-6 max-w-[46ch] text-ink-700">{chapter.body}</p>
    </div>
  );
}

export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const [first, second, third] = chapters;
  return (
    <section aria-labelledby="chapters-title" className="section-space render-later bg-ivory-50">
      <div className="container-site">
        <h2 id="chapters-title" className="sr-only">
          Why Oceania
        </h2>

        {first ? (
          <div className="grid-site gap-y-10 lg:items-end">
            <ChapterText chapter={first} className="col-span-12 lg:col-span-5 lg:pb-16" />
            <Figure
              image={first.image}
              aspect="4 / 5"
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={65}
              figureClassName="col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-7"
            />
          </div>
        ) : null}

        {second ? (
          <div className="mt-[var(--section-space)]">
            <Figure
              image={second.image}
              aspectClassName="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
              sizes="100vw"
              quality={65}
              figureClassName="w-full"
            />
            <div className="grid-site mt-10 gap-y-6 lg:mt-14">
              <div className="col-span-12 lg:col-span-6" data-reveal="rise">
                <Eyebrow>{second.label}</Eyebrow>
                <h3 className="type-h2 mt-6 max-w-[18ch] text-forest-900">
                  <Lines text={second.title} />
                </h3>
              </div>
              <p
                className="type-body-lg col-span-12 max-w-[46ch] text-ink-700 lg:col-span-5 lg:col-start-8 lg:self-end"
                data-reveal="rise"
              >
                {second.body}
              </p>
            </div>
          </div>
        ) : null}

        {third ? (
          <div className="grid-site mt-[var(--section-space)] items-center gap-y-10">
            <Figure
              image={third.image}
              aspect="3 / 4"
              sizes="(min-width: 1024px) 40vw, 100vw"
              quality={65}
              figureClassName="order-2 col-span-12 sm:col-span-8 lg:order-1 lg:col-span-5"
            />
            <ChapterText chapter={third} className="order-1 col-span-12 lg:order-2 lg:col-span-6 lg:col-start-7" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
