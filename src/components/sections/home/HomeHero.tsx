import { OFrame } from '@/components/brand/OFrame';
import { ContactActions } from '@/components/contact/ContactActions';
import { Picture } from '@/components/media/Picture';
import { ButtonLink } from '@/components/ui/Button';
import type { HomePage, SiteSettings } from '@/content/types';

/**
 * Arrive: the brand line, one short promise, the main action and a way to
 * reach a person, set on pine. The crop photograph sits in the O-frame.
 */
export function HomeHero({ hero, contact }: { hero: HomePage['hero']; contact: SiteSettings['contact'] }) {
  const lines = hero.headline.split('\n');

  return (
    <section aria-labelledby="home-hero-title" className="on-dark overflow-hidden bg-pine-700 text-paper">
      <div className="container-site grid-site items-center gap-y-12 py-[clamp(3rem,9vh,7rem)]">
        <div className="col-span-12 lg:col-span-7">
          <h1 id="home-hero-title" className="type-display">
            {lines.map((line, index) => (
              <span key={line} className="block">
                <span className="hero-line" style={{ ['--line-index' as string]: index }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="type-lead mt-6 max-w-[34ch] text-pine-100">{hero.standfirst}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href={hero.primaryCta.href} variant="light">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline-light">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ContactActions contact={contact} place="hero" tone="dark" className="mt-7" />
        </div>

        <figure className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9">
          <OFrame>
            <Picture
              image={hero.image}
              fill
              preload
              quality={65}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 90vw"
              className="object-cover"
            />
          </OFrame>
          {hero.image.caption ? (
            <figcaption className="type-caption mt-4 text-center text-pine-200">
              {hero.image.caption}
              {hero.image.credit ? ` Photo: ${hero.image.credit.author}, ${hero.image.credit.license}.` : ''}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
