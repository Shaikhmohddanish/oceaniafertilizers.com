import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Become a partner';

export default function OpenGraphImage() {
  return shareImage({ label: 'Become a partner', title: 'Grow with Oceania.' });
}
