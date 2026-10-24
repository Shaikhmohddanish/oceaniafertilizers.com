import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Terms and conditions';

export default function OpenGraphImage() {
  return shareImage({ label: 'Terms and conditions', title: 'The terms for using this website.' });
}
