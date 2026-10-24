import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const alt = 'Oceania Fertilizers. Farming should not be a game of guesswork.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return shareImage({ label: "Let's understand farming", title: 'Farming should not be a game of guesswork.' });
}
