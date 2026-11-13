import { Figure } from '@/components/media/Picture';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage } from '@/content/types';

/*
 * Farmers who learn. The client's own line, "More than a farmer. A
 * decision-maker.", with three short points about learning, asking and
 * sharing, rather than an idealised portrait of the perfect farmer.
 */
export function OceaniaFarmer({ farmer }: { farmer: HomePage['farmer'] }) {
  return (
    <section aria-labelledby="oceania-farmer-title" className="on-dark section-space render-later bg-pine-900 text-paper">
      <div className="container-site grid-site items-center gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <Figure image={farmer.image} aspect="4 / 5" tone="dark" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-reveal="rise">
            <Eyebrow tone="dark">{farmer.eyebrow}</Eyebrow>
            <h2 id="oceania-farmer-title" className="type-h2 mt-6">
              <Lines text={farmer.headline} />
            </h2>
            <p className="type-lead mt-8 max-w-[38ch] text-pine-100">{farmer.body}</p>
          </div>

          <ul className="mt-12">
            {farmer.points.map((point, index) => (
              <li
                key={point.title}
                data-reveal="rise"
                style={{ ['--reveal-index' as string]: index }}
                className="grid gap-x-8 border-t border-[color:var(--line-on-dark)] py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline"
              >
                <h3 className="type-h3 text-clay-300">{point.title}</h3>
                <p className="mt-1 text-pine-100 sm:mt-0">{point.body}</p>
              </li>
            ))}
          </ul>

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
