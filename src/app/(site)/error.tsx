'use client';

import { useEffect } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';

/** Shown when a page fails while rendering. The details go to the server log, not the visitor. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-space bg-ivory-50" aria-labelledby="error-title">
      <div className="container-site max-w-[48rem]">
        <p className="type-label text-gold-700">Something went wrong</p>
        <h1 id="error-title" className="type-h1 mt-6 text-forest-900">
          This page did not load properly.
        </h1>
        <p className="type-lead mt-8 text-ink-700">Please try again. If it keeps happening, come back a little later.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go to the homepage
          </ButtonLink>
        </div>
        {error.digest ? <p className="type-caption mt-10 text-ink-500">Reference: {error.digest}</p> : null}
      </div>
    </section>
  );
}
