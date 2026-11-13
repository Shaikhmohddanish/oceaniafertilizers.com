import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oceania Fertilizers',
    short_name: 'Oceania',
    description: 'Agricultural inputs for farms across India.',
    start_url: '/',
    display: 'browser',
    background_color: '#f5f1e8',
    theme_color: '#24483c',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
