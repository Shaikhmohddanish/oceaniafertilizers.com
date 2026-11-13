import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Field visits and demos';

export default function OpenGraphImage() {
  return shareImage({ label: 'Field visits', title: 'Field visits and demos.' });
}
