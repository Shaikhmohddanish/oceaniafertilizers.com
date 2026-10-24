import '@/styles/globals.css';

import type { Metadata } from 'next';

import { NotFoundContent } from '@/components/content/NotFoundContent';
import { Footer } from '@/components/layout/Footer';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { getSiteSettings } from '@/content/repository';

export const metadata: Metadata = {
  title: 'Page not found | Oceania Fertilizers',
  robots: { index: false, follow: true },
};

/** Unmatched addresses render here, outside the (site) layout, so it brings the site chrome with it. */
export default async function NotFound() {
  const settings = await getSiteSettings();
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <NotFoundContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
