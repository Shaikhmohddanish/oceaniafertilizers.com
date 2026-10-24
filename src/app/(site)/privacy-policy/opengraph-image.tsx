import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Privacy policy';

export default function OpenGraphImage() {
  return shareImage({ label: 'Privacy policy', title: 'How we handle your information.' });
}
