'use client';

import Image, { type ImageLoader, type ImageProps } from 'next/image';

/**
 * Images served from the Sanity CDN, which resizes and converts formats itself,
 * so they bypass the Next.js optimiser. Lives in a client file because a loader
 * function cannot be passed from a Server Component.
 */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
};

export function RemoteImage(props: Omit<ImageProps, 'loader' | 'placeholder'> & { blurDataURL?: string }) {
  const { blurDataURL, alt, ...rest } = props;
  const isSanity = typeof props.src === 'string' && props.src.startsWith('https://cdn.sanity.io/');
  return (
    <Image
      {...rest}
      alt={alt}
      loader={isSanity ? sanityLoader : undefined}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
    />
  );
}
