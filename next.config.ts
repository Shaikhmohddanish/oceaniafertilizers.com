import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const siteEnv = process.env.NEXT_PUBLIC_SITE_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? (isDev ? 'development' : 'preview');
const canonicalHost = 'oceaniafertilizers.com';

/*
 * Content Security Policy for the public site. 'unsafe-inline' scripts are
 * required by Next.js streaming without per-request nonces (nonces would force
 * every page to render dynamically). Everything else is locked to the origins
 * the site actually uses.
 */
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com",
  'frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://challenges.cloudflare.com',
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
];

const nextConfig: NextConfig = {
  // End-to-end tests build into their own folder so they never disturb `next dev`.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  poweredByHeader: false,
  // Do not write AGENTS.md into the project on `next dev`.
  agentRules: false,
  serverExternalPackages: ['@electric-sql/pglite'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/:path((?!studio(?:/|$)).*)', headers: [{ key: 'Content-Security-Policy', value: siteCsp }] },
      { source: '/studio/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      ...(siteEnv === 'production' ? [] : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${canonicalHost}` }],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
      // Names used in the client's workbook and mockups.
      { source: '/testimonials', destination: '/farmer-stories', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/business-opportunity', destination: '/become-a-partner', permanent: true },
    ];
  },
};

export default nextConfig;
