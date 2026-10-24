import Link from 'next/link';

import { ChevronRightIcon } from '@/components/brand/icons';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';

export type Crumb = { label: string; href: string };

/** Visible breadcrumbs plus matching BreadcrumbList structured data. Home is implied. */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="type-caption flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-500">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="inline-flex min-h-6 items-center text-ink-700">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="link-draw inline-flex min-h-6 items-center hover:text-ink-900">
                      {crumb.label}
                    </Link>
                    <ChevronRightIcon size={14} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
