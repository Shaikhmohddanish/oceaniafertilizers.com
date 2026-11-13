import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Field results';

export default function OpenGraphImage() {
  return shareImage({ label: 'Field results', title: 'Demo plots, documented.' });
}
