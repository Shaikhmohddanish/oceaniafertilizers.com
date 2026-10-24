import type { Metadata } from 'next';
import Image from 'next/image';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { photoLibrary } from '@/content/photo-library';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Image credits',
  description: 'Credits and licences for photographs used on the Oceania Fertilizers website.',
  path: '/image-credits',
});

export default function ImageCreditsPage() {
  const photos = Object.entries(photoLibrary);
  return (
    <div className="bg-ivory-50 pt-8 pb-[var(--section-space)] lg:pt-12">
      <div className="container-site">
        <Breadcrumbs items={[{ label: 'Image credits', href: '/image-credits' }]} />
        <div className="mt-10 max-w-[48rem] lg:mt-14">
          <h1 className="type-h1 text-forest-900">Image credits</h1>
          <p className="type-lead mt-6 text-ink-700">
            Some landscape and crop photographs on this website are used under Creative Commons licences, from photographers
            across India. Product photographs are Oceania&apos;s own.
          </p>
          <p className="type-small mt-6 text-ink-500">
            Photographs under ShareAlike licences may have been cropped or resized for this website; those versions are
            shared under the same licence.
          </p>
        </div>

        <ul className="mt-16 border-t border-[color:var(--line-strong)]">
          {photos.map(([id, photo]) => (
            <li key={id} className="grid grid-cols-[5rem_1fr] gap-x-5 gap-y-1 border-b border-[color:var(--line)] py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
              <div className="relative row-span-2 aspect-[4/3] overflow-hidden bg-sand-200 sm:row-span-1">
                <Image src={photo.image} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-ink-900">{photo.caption}</p>
                <p className="type-small mt-1 text-ink-700">
                  Photo by {photo.credit.author},{' '}
                  <a href={photo.credit.licenseUrl} className="link-inline" rel="noopener noreferrer license" target="_blank">
                    {photo.credit.license}
                  </a>
                </p>
              </div>
              <a
                href={photo.credit.sourceUrl}
                className="type-small link-inline col-start-2 text-forest-800 sm:col-start-3"
                rel="noopener noreferrer"
                target="_blank"
              >
                View source<span className="sr-only"> for {photo.caption} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
