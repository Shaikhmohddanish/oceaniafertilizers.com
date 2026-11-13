import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import type { HelpPath } from '@/lib/site';

/** Choose: four large, tappable rows, one for each thing someone can do next. */
export function HelpPaths({ paths }: { paths: HelpPath[] }) {
  return (
    <section aria-labelledby="help-paths-title" className="section-space bg-paper">
      <div className="container-site grid-site gap-y-10">
        <div className="col-span-12 lg:col-span-4" data-reveal="rise">
          <h2 id="help-paths-title" className="type-h1 max-w-[10ch] text-pine-700">
            How can we help?
          </h2>
        </div>
        <ul className="col-span-12 border-t border-[color:var(--line-strong)] lg:col-span-7 lg:col-start-6">
          {paths.map((path, index) => (
            <li key={path.href + path.title} className="border-b border-[color:var(--line-strong)]" data-reveal="rise" style={{ ['--reveal-index' as string]: index }}>
              <Link href={path.href} className="has-arrow group flex items-center justify-between gap-6 py-6">
                <span>
                  <span className="type-h3 block text-pine-700">{path.title}</span>
                  <span className="mt-2 block text-ink-700">{path.body}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-clay-300 text-ink-900 transition-colors duration-300 group-hover:bg-clay-400"
                >
                  <ArrowRightIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
