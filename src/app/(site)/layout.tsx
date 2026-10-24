import '@/styles/globals.css';

import type { Metadata } from 'next';

import { Analytics } from '@/components/analytics/Analytics';
import { DraftModeBar } from '@/components/layout/DraftModeBar';
import { Footer } from '@/components/layout/Footer';
import { PreviewNotice } from '@/components/layout/PreviewNotice';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSettings } from '@/content/repository';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { isIndexable, showPendingContent, siteUrl } from '@/lib/site-config';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const verification = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
    description: settings.description,
    applicationName: settings.siteName,
    openGraph: { siteName: settings.siteName, locale: 'en_IN', type: 'website' },
    formatDetection: { telephone: false, email: false, address: false },
    ...(isIndexable ? {} : { robots: { index: false, follow: false } }),
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

// Analytics only ever runs on the production deployment.
const gaMeasurementId = isIndexable ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <SkipLink />
      {showPendingContent ? <PreviewNotice /> : null}
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      <RevealObserver />
      <DraftModeBar />
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
      {gaMeasurementId ? <Analytics measurementId={gaMeasurementId} /> : null}
    </>
  );
}
