import { Figure } from '@/components/media/Picture';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage } from '@/content/types';

/*
 * The workbook's "anatomy of an Oceania farmer", set as the legend of an
 * anatomical plate instead of a crowded infographic. The figure stays clean;
 * the fourteen lines read head to feet beside it, at every screen size.
 */
export function OceaniaFarmer({ farmer }: { farmer: HomePage['farmer'] }) {
  return (
    <section aria-labelledby="oceania-farmer-title" className="on-dark section-space render-later bg-botanical-950 text-ivory-50">
      <div className="container-site grid-site gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <Figure
              image={farmer.image}
              aspect="4 / 5"
              tone="dark"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-reveal="rise">
            <Eyebrow tone="dark">{farmer.eyebrow}</Eyebrow>
            <h2 id="oceania-farmer-title" className="type-h2 mt-6">
              <Lines text={farmer.headline} />
            </h2>
            <p className="type-lead mt-8 max-w-[38ch] text-sage-200">{farmer.body}</p>
          </div>

          <ol aria-label="The Oceania farmer, head to feet" className="mt-14 grid gap-x-10 sm:grid-cols-2">
            {farmer.points.map((point) => (
              <li
                key={`${point.part}-${point.meaning}`}
                className="border-t border-[color:var(--line-on-dark)] py-4"
              >
                <p>
                  <span className="type-label block text-gold-300">{point.part}</span>
                  <span className="mt-1 block font-display text-[1.25rem] leading-snug text-ivory-50">{point.meaning}</span>
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <ButtonLink href={farmer.cta.href} variant="light">
              {farmer.cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
