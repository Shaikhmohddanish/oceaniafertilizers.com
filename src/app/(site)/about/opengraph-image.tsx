import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: About Oceania';

export default function OpenGraphImage() {
  return shareImage({ label: 'About Oceania', title: 'Better farming begins with better understanding.' });
}
