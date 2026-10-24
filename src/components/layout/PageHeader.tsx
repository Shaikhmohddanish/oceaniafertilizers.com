import { Picture } from '@/components/media/Picture';
import { Lines } from '@/components/ui/Lines';
import type { ImageAsset } from '@/content/types';

import { Breadcrumbs, type Crumb } from './Breadcrumbs';

type PageHeaderProps = {
  title: string;
  standfirst?: string;
  crumbs: Crumb[];
  image?: ImageAsset;
  /**
   * split: text beside a tall image. banner: text, then a wide image.
   * statement: text only, set large.
   */
  variant?: 'split' | 'banner' | 'statement';
  children?: React.ReactNode;
};

/** The opening of an inner page. Three compositions, so pages do not all look alike. */
export function PageHeader({ title, standfirst, crumbs, image, variant = 'statement', children }: PageHeaderProps) {
  const titleSize = variant === 'split' ? 'type-h1 lg:text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)]' : 'type-h1';
  const text = (
    <>
      <h1 className={`${titleSize} max-w-[16ch] text-forest-900`}>
        <Lines text={title} />
      </h1>
      {standfirst ? <p className="type-lead mt-8 max-w-[40ch] text-ink-700">{standfirst}</p> : null}
      {children}
    </>
  );

  if (variant === 'split' && image) {
    return (
      <header className="bg-ivory-50 pt-8 pb-[var(--section-space)] lg:pt-12">
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="grid-site mt-10 items-end gap-y-12 lg:mt-14">
            <div className="col-span-12 lg:col-span-6 lg:pb-6">{text}</div>
            <div className="relative col-span-12 aspect-[4/3] overflow-hidden bg-sand-200 lg:col-span-5 lg:col-start-8 lg:aspect-[4/5]">
              <Picture image={image} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (variant === 'banner' && image) {
    return (
      <header className="bg-ivory-50 pt-8 lg:pt-12">
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 lg:mt-14">{text}</div>
        </div>
        <div className="relative mt-14 aspect-[16/10] w-full overflow-hidden bg-sand-200 sm:aspect-[21/9] lg:mt-20">
          <Picture image={image} fill preload quality={65} sizes="100vw" className="object-cover" />
        </div>
        {image.caption ? (
          <p className="container-site type-caption mt-3 text-ink-500">
            {image.caption}
            {image.credit ? ` Photo: ${image.credit.author}, ${image.credit.license}.` : ''}
          </p>
        ) : null}
      </header>
    );
  }

  return (
    <header className="bg-ivory-50 pt-8 pb-12 lg:pt-12 lg:pb-16">
      <div className="container-site">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 lg:mt-14">{text}</div>
      </div>
    </header>
  );
}
