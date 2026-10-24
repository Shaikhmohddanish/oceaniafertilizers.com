import { Picture } from '@/components/media/Picture';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage } from '@/content/types';

/** A split statement band: a solid green panel beside a full-height photograph. */
export function PartnerBand({ partner }: { partner: HomePage['partner'] }) {
  return (
    <section aria-labelledby="partner-band-title" className="on-dark render-later grid bg-forest-900 text-ivory-50 lg:grid-cols-2">
      <div className="relative aspect-[4/3] lg:order-2 lg:aspect-auto lg:min-h-[38rem]">
        <Picture image={partner.image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-between gap-12 px-[var(--gutter)] py-16 lg:order-1 lg:py-24 lg:pr-16 xl:pl-[max(var(--gutter),calc((100vw-var(--max-width))/2))]">
        <div data-reveal="rise">
          <Eyebrow tone="dark">{partner.eyebrow}</Eyebrow>
          <h2 id="partner-band-title" className="type-h2 mt-6 max-w-[16ch]">
            <Lines text={partner.headline} />
          </h2>
          <p className="type-lead mt-8 max-w-[34ch] text-sage-200">{partner.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href={partner.cta.href} variant="light">
            {partner.cta.label}
          </ButtonLink>
          {partner.image.caption ? (
            <p className="type-caption max-w-[30ch] text-sage-300">{partner.image.caption}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
