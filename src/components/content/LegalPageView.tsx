import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import type { LegalPage, RichText as RichTextValue } from '@/content/types';
import { formatDate } from '@/lib/format';

import { RichText } from './RichText';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type Section = { heading?: string; id?: string; nodes: RichTextValue };

/** Splits the body at each h2, so headings can be linked from the contents list. */
function sections(body: RichTextValue): Section[] {
  const result: Section[] = [];
  let current: Section = { nodes: [] };
  for (const node of body) {
    if (node._type === 'block' && node.style === 'h2') {
      if (current.heading || current.nodes.length > 0) result.push(current);
      const heading = node.children.map((child) => child.text).join('');
      current = { heading, id: `section-${slugify(heading)}`, nodes: [] };
    } else {
      current.nodes.push(node);
    }
  }
  if (current.heading || current.nodes.length > 0) result.push(current);
  return result;
}

/** Legal pages: a contents list beside the text, and a visible notice until the copy is approved. */
export function LegalPageView({ page }: { page: LegalPage }) {
  const parts = sections(page.body);

  return (
    <div className="bg-ivory-50 pt-8 pb-[var(--section-space)] lg:pt-12">
      <div className="container-site">
        <Breadcrumbs items={[{ label: page.title, href: `/${page.slug}` }]} />
        <div className="mt-10 max-w-[48rem] lg:mt-14">
          <h1 className="type-h1 text-forest-900">{page.title}</h1>
          <p className="type-lead mt-6 text-ink-700">{page.summary}</p>
          <p className="type-small mt-6 text-ink-500">Last updated {formatDate(page.lastUpdated)}</p>
          {!page.approved ? (
            <p role="note" className="type-small mt-6 border-l-2 border-gold-500 bg-ivory-100 px-5 py-4 text-ink-700">
              <span className="font-semibold text-ink-900">Draft pending legal review.</span> This text describes how the
              website works and is being reviewed before it becomes final.
            </p>
          ) : null}
        </div>

        <div className="grid-site mt-16 gap-y-10 border-t border-[color:var(--line-strong)] pt-12">
          <nav aria-label="On this page" className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <p className="type-label text-ink-500">On this page</p>
              <ol className="type-small mt-4 space-y-2">
                {parts
                  .filter((part) => part.heading)
                  .map((part) => (
                    <li key={part.id}>
                      <a href={`#${part.id}`} className="link-quiet text-ink-700 hover:text-ink-900">
                        {part.heading}
                      </a>
                    </li>
                  ))}
              </ol>
            </div>
          </nav>
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            {parts.map((part, index) => (
              <section key={part.id ?? `intro-${index}`} aria-labelledby={part.id} className="mt-12 first:mt-0">
                {part.heading ? (
                  <h2 id={part.id} className="type-h3 scroll-mt-28 text-forest-900">
                    {part.heading}
                  </h2>
                ) : null}
                <RichText value={part.nodes} className="mt-5 max-w-[64ch] text-ink-700" />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
