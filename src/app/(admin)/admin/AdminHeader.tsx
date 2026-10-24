import Link from 'next/link';

import { Wordmark } from '@/components/brand/Wordmark';
import { logout } from '@/server/admin/actions';

const sections = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/newsletter', label: 'Newsletter' },
];

export function AdminHeader({ current = 'Leads' }: { current?: 'Leads' | 'Newsletter' }) {
  return (
    <header className="border-b border-[color:var(--line)] bg-ivory-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-8">
          <Link href="/admin/leads">
            <Wordmark size="sm" />
            <span className="sr-only">, admin home</span>
          </Link>
          <nav aria-label="Admin sections" className="flex items-center gap-5">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                aria-current={section.label === current ? 'page' : undefined}
                className="type-small inline-flex min-h-6 items-center font-medium text-ink-700 underline-offset-4 hover:underline aria-[current=page]:text-forest-900 aria-[current=page]:underline"
              >
                {section.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button type="submit" className="type-small font-medium text-forest-800 underline-offset-4 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
