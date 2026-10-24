import '@/styles/globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leads | Oceania admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-paper text-ink-900">{children}</div>;
}
