import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import { ButtonLink } from '@/components/ui/Button';

const destinations = [
  { href: '/advice', label: 'Get crop advice' },
  { href: '/learn', label: 'Learn' },
  { href: '/products', label: 'Products' },
  { href: '/field-visits', label: 'Field visits' },
];

export function NotFoundContent() {
  return (
    <section className="section-space bg-paper" aria-labelledby="not-found-title">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <p className="type-label text-clay-700">Page not found</p>
          <h1 id="not-found-title" className="type-h1 mt-6 max-w-[14ch] text-pine-700">
            We could not find that page.
          </h1>
          <p className="type-lead mt-8 max-w-[38ch] text-ink-700">
            The link may be old, or the page may have moved. These are good places to start.
          </p>
          <div className="mt-10">
            <ButtonLink href="/">Go to the homepage</ButtonLink>
          </div>
        </div>
        <nav aria-label="Suggested pages" className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
          <ul className="border-t border-[color:var(--line-strong)]">
            {destinations.map((item) => (
              <li key={item.href} className="border-b border-[color:var(--line)]">
                <Link href={item.href} className="has-arrow flex items-center justify-between py-4 font-display text-[1.375rem] text-pine-700">
                  {item.label}
                  <ArrowRightIcon className="text-pine-700" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
