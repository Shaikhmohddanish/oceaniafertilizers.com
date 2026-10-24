/**
 * Conversion tracking. Sends events to Google Analytics 4 only when it has
 * been configured (NEXT_PUBLIC_GA_MEASUREMENT_ID) and loaded. Never sends form
 * contents: only the form type.
 */

type Gtag = (command: 'event', name: string, params?: Record<string, string | number>) => void;

export function track(name: 'generate_lead' | 'sign_up' | 'video_play' | 'contact_click', params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
