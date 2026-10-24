import { Picture } from '@/components/media/Picture';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import type { HomePage } from '@/content/types';

/**
 * The headline sits in the sky. The section takes the colour of the top edge
 * of the photograph, and the image starts below the text with a short
 * feathered edge, so the field rises out of the page with no overlay needed.
 */
export function HomeHero({ hero }: { hero: HomePage['hero'] }) {
  const lines = hero.headline.split('\n');
  const sky = hero.image.backdrop ?? 'var(--color-ivory-50)';

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative -mt-[var(--header-height)] overflow-hidden"
      style={{ backgroundColor: sky }}
    >
      <div className="container-site relative z-10 pt-[calc(var(--header-height)+clamp(2.5rem,7vh,6rem))]">
        <div className="grid-site items-end gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            {hero.eyebrow ? <Eyebrow>{hero.eyebrow}</Eyebrow> : null}
            <h1 id="home-hero-title" className="type-display mt-6 text-forest-900">
              {lines.map((line, index) => (
                <span key={line} className="block">
                  <span className="hero-line" style={{ ['--line-index' as string]: index }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>
          <div className="col-span-12 sm:col-span-9 lg:col-span-4 lg:pb-3">
            <p className="type-lead max-w-[34ch] text-ink-700">{hero.standfirst}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
              <TextLink href={hero.secondaryCta.href} className="text-forest-800">
                {hero.secondaryCta.label}
              </TextLink>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-6 aspect-[4/5] w-full sm:aspect-[16/10] lg:-mt-16 lg:aspect-auto lg:h-[min(62svh,40rem)]">
        <Picture
          image={hero.image}
          fill
          preload
          quality={65}
          sizes="100vw"
          className="object-cover [mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%)]"
        />
      </div>

      {hero.image.caption ? (
        <p className="container-site type-caption relative z-10 -mt-9 pb-3 text-right text-ivory-50/85">
          {hero.image.caption}
          {hero.image.credit ? ` Photo: ${hero.image.credit.author}, ${hero.image.credit.license}.` : ''}
        </p>
      ) : null}
    </section>
  );
}
