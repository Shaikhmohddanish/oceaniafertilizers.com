import Image from 'next/image';

import type { ImageAsset } from '@/content/types';

import { RemoteImage } from './RemoteImage';

type PictureProps = {
  image: ImageAsset;
  sizes: string;
  /** Preload and fetch with high priority. Use only for the largest image above the fold. */
  preload?: boolean;
  /** Fill the parent (which must be positioned and sized). */
  fill?: boolean;
  quality?: 65 | 75;
  className?: string;
  alt?: string;
};

function objectPosition(image: ImageAsset) {
  if (!image.focal) return undefined;
  return `${Math.round(image.focal.x * 100)}% ${Math.round(image.focal.y * 100)}%`;
}

/** Renders a content image from either source with correct sizing and focal point. */
export function Picture({ image, sizes, preload = false, fill = false, quality = 75, className = '', alt }: PictureProps) {
  const style = { objectPosition: objectPosition(image) };
  const altText = alt ?? image.alt;

  if (typeof image.src === 'string') {
    return (
      <RemoteImage
        src={image.src}
        alt={altText}
        width={fill ? undefined : image.width}
        height={fill ? undefined : image.height}
        fill={fill}
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? 'high' : undefined}
        quality={quality}
        className={className}
        style={style}
        blurDataURL={preload ? undefined : image.blurDataURL}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={altText}
      sizes={sizes}
      fill={fill}
      preload={preload}
      fetchPriority={preload ? 'high' : undefined}
      quality={quality}
      // A preloaded image arrives with the first frame; its blur filter would only cost raster time.
      placeholder={image.blurDataURL && !preload ? 'blur' : 'empty'}
      className={className}
      style={style}
    />
  );
}

type FigureProps = PictureProps & {
  aspect?: string;
  /** Responsive aspect ratio classes, used instead of `aspect` when set (for example "aspect-[4/3] lg:aspect-[21/9]"). */
  aspectClassName?: string;
  figureClassName?: string;
  captionClassName?: string;
  showCaption?: boolean;
  reveal?: boolean;
  tone?: 'light' | 'dark';
};

/**
 * An editorial figure: a fixed-ratio frame with the image, then a caption and
 * credit line underneath. Captions are part of the visual language of the site.
 */
export function Figure({
  image,
  aspect = '4 / 3',
  aspectClassName,
  figureClassName = '',
  captionClassName = '',
  showCaption = true,
  reveal = true,
  tone = 'light',
  ...picture
}: FigureProps) {
  const captionColor = tone === 'light' ? 'text-ink-500' : 'text-sage-300';
  return (
    <figure className={figureClassName}>
      <div
        className={`relative overflow-hidden bg-sand-200 ${aspectClassName ?? ''}`}
        style={aspectClassName ? undefined : { aspectRatio: aspect }}
        data-reveal={reveal ? 'mask' : undefined}
      >
        <Picture image={image} fill className="h-full w-full object-cover" {...picture} />
      </div>
      {showCaption && (image.caption || image.credit) ? (
        <figcaption className={`type-caption mt-3 flex flex-wrap gap-x-3 gap-y-1 ${captionColor} ${captionClassName}`}>
          {image.caption ? <span>{image.caption}</span> : null}
          {image.credit ? (
            <span>
              Photo: {image.credit.author}
              {image.credit.license ? `, ${image.credit.license}` : ''}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
