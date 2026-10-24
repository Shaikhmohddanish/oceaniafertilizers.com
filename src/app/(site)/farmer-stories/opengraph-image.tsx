import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = "Oceania Fertilizers: Farmers' experiences";

export default function OpenGraphImage() {
  return shareImage({ label: "Farmers' experiences", title: 'In their own words.' });
}
