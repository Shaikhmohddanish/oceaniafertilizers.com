import type { Faq } from '@/content/types';

import { RichText } from './RichText';

/** Questions as native disclosures: keyboard and screen-reader friendly, no JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <div className="border-t border-[color:var(--line-strong)]">
      {faqs.map((faq) => (
        <details key={faq.id} className="group border-b border-[color:var(--line-strong)]">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-[1.1875rem] font-bold text-forest-900 [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-gold-700 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <RichText value={faq.answer} className="max-w-[62ch] pb-6 text-ink-700" />
        </details>
      ))}
    </div>
  );
}
