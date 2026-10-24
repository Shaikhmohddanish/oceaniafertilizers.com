import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import { ButtonLink } from '@/components/ui/Button';

const destinations = [
  { href: '/products', label: 'Products' },
  { href: '/demo-plots', label: 'Field results' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export function NotFoundContent() {
  return (
    <section className="section-space bg-ivory-50" aria-labelledby="not-found-title">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <p className="type-label text-gold-700">Page not found</p>
          <h1 id="not-found-title" className="type-h1 mt-6 max-w-[14ch] text-forest-900">
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
                <Link href={item.href} className="has-arrow flex items-center justify-between py-4 font-display text-[1.375rem] text-forest-900">
                  {item.label}
                  <ArrowRightIcon className="text-forest-800" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
