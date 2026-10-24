import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Gallery';

export default function OpenGraphImage() {
  return shareImage({ label: 'Gallery', title: 'From the field.' });
}
