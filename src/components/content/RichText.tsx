import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import { Figure } from '@/components/media/Picture';
import type { RichText as RichTextValue, RichTextCallout, RichTextImage, RichTextProductReference } from '@/content/types';

/*
 * Renders rich text from either content source with the site's typography.
 * Internal links use next/link; external links open safely.
 */

function isInternal(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="type-h3 mt-14 text-pine-700 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="type-h4 mt-10 text-pine-700 first:mt-0">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-clay-600 pl-6 font-display text-[1.375rem] leading-snug text-pine-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-clay-700">{children}</ul>,
    number: ({ children }) => <ol className="type-numeral mt-5 list-decimal space-y-2 pl-6 marker:text-clay-700">{children}</ol>,
  },
  listItem: ({ children }) => <li className="pl-1">{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = String((value as { href?: string } | undefined)?.href ?? '#');
      return isInternal(href) ? (
        <Link href={href} className="link-inline font-medium text-pine-700">
          {children}
        </Link>
      ) : (
        <a href={href} className="link-inline font-medium text-pine-700" rel="noopener noreferrer" target="_blank">
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    },
  },
  types: {
    figure: ({ value }: { value: RichTextImage }) => (
      <Figure image={value.image} aspect="3 / 2" sizes="(min-width: 1024px) 50vw, 100vw" figureClassName="mt-10" />
    ),
    callout: ({ value }: { value: RichTextCallout }) => (
      <aside
        className={`mt-10 border-l-2 px-6 py-5 ${value.tone === 'caution' ? 'border-clay-700 bg-sand-200/60' : 'border-pine-600 bg-paper-deep'}`}
      >
        {value.title ? <p className="type-label text-clay-700">{value.title}</p> : null}
        <p className={`${value.title ? 'mt-2' : ''} text-ink-900`}>{value.body}</p>
      </aside>
    ),
    productReference: ({ value }: { value: RichTextProductReference }) => (
      <Link
        href={`/products/${value.slug}`}
        className="has-arrow group mt-10 flex items-center justify-between gap-6 border-y border-[color:var(--line-strong)] py-5"
      >
        <span>
          <span className="type-label block text-clay-700">From the Oceania range</span>
          <span className="type-h3 mt-2 block text-pine-700">{value.name}</span>
          <span className="type-small mt-1 block text-ink-700">{value.purpose}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-pine-700" />
      </Link>
    ),
  },
};

export function RichText({ value, className = '' }: { value: RichTextValue | undefined; className?: string }) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
