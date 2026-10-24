'use client';

import { useEffect, useRef } from 'react';

/*
 * Cloudflare Turnstile, loaded only after someone starts filling in a form, so
 * it never costs anything on page load. Renders nothing unless a site key is
 * configured.
 */

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __ocTurnstileLoading?: Promise<TurnstileApi>;
  }
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  window.__ocTurnstileLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile unavailable')));
    script.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.appendChild(script);
  });
  return window.__ocTurnstileLoading;
}

type TurnstileProps = {
  /** Becomes true on first interaction with the form. */
  active: boolean;
  action: string;
  onToken: (token: string | null) => void;
  /** Changes after each submission, so the single-use token is renewed. */
  resetKey?: number;
};

export function Turnstile({ active, action, onToken, resetKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !active || widgetRef.current || !containerRef.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !containerRef.current) return;
        widgetRef.current = api.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          appearance: 'interaction-only',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelled = true;
    };
  }, [active, action]);

  useEffect(() => {
    if (resetKey && widgetRef.current && window.turnstile) {
      onTokenRef.current(null);
      window.turnstile.reset(widgetRef.current);
    }
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className="min-h-0 empty:hidden" />;
}
