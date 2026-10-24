import type { StaticImageData } from 'next/image';

import haladSpecial from '@/assets/products/halad-special-5l.png';
import waves from '@/assets/products/waves-300g.jpg';

import { photoLibrary, type PhotoId } from '../photo-library';
import type { ImageAsset } from '../types';

/** A temporary licensed photo from the library, as a content image. */
export function photo(id: PhotoId, overrides: Partial<ImageAsset> = {}): ImageAsset {
  const entry = photoLibrary[id];
  return {
    src: entry.image,
    width: entry.image.width,
    height: entry.image.height,
    alt: entry.alt,
    caption: entry.caption,
    credit: entry.credit,
    blurDataURL: entry.image.blurDataURL,
    temporary: true,
    ...overrides,
  };
}

function productImage(image: StaticImageData, alt: string, overrides: Partial<ImageAsset> = {}): ImageAsset {
  return {
    src: image,
    width: image.width,
    height: image.height,
    alt,
    blurDataURL: image.blurDataURL,
    ...overrides,
  };
}

export const productImages = {
  haladSpecial: productImage(haladSpecial, 'Halad Special bio-stimulant in a white 5 litre can with a blue and green label.', {
    backdrop: '#FFFCEB',
    caption: 'Halad Special, 5 litre can. Pack render supplied by Oceania.',
    temporary: true,
  }),
  waves: productImage(waves, 'WAVES Mycorrhizal Biofertilizer in a white 300 gm stand-up pouch with an anchor and gold wave design.', {
    caption: 'WAVES Mycorrhizal Biofertilizer, 300 gm pouch.',
    focal: { x: 0.5, y: 0.45 },
    temporary: true,
  }),
};
