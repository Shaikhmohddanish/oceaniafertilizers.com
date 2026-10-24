import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Join Oceania';

export default function OpenGraphImage() {
  return shareImage({ label: 'Join Oceania', title: 'For farmers who want to know more.' });
}
