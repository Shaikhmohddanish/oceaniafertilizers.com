'use client';

import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;

/**
 * Google Analytics 4. The site layout renders this only on the production
 * deployment and only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * - It loads once the browser is idle, so it never competes with the page.
 * - It runs in cookieless mode: every Consent Mode storage type is denied, so
 *   no analytics or advertising cookies are set and Google signals are off.
 *   Turning on cookies would need a consent banner and a privacy policy update.
 * - Page changes are picked up by GA4's enhanced measurement (history events).
 */
export function Analytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    const scope = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };
    if (scope.gtag) return;

    scope.dataLayer = scope.dataLayer ?? [];
    scope.gtag = function gtag() {
      // gtag.js expects the arguments object itself, not an array copy.
      // eslint-disable-next-line prefer-rest-params
      scope.dataLayer?.push(arguments);
    };
    scope.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    scope.gtag('js', new Date());
    scope.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });

    const load = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 5000 });
    else setTimeout(load, 3000);
  }, [measurementId]);

  return null;
}
