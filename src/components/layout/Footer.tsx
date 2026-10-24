import { NewsletterForm } from '@/components/forms/NewsletterForm';
import type { SiteSettings } from '@/content/types';

import { SiteFooter } from './SiteFooter';

/** The site footer with its interactive parts slotted in. */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <SiteFooter
      settings={settings}
      newsletter={
        <div>
          <h2 className="type-label text-gold-300">The Oceania newsletter</h2>
          <p className="type-small mt-3 max-w-[44ch] text-sage-300">
            Occasional notes on crop nutrition, field results and good practice. No more than one email a month.
          </p>
          <div className="mt-6 max-w-[30rem]">
            <NewsletterForm />
          </div>
        </div>
      }
    />
  );
}
