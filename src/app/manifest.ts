import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oceania Fertilizers',
    short_name: 'Oceania',
    description: 'Agricultural inputs for farms across India.',
    start_url: '/',
    display: 'browser',
    background_color: '#f7f3ea',
    theme_color: '#1e3a2b',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
