import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers: Insights';

export default function OpenGraphImage() {
  return shareImage({ label: 'Insights', title: 'Better decisions start here.' });
}
