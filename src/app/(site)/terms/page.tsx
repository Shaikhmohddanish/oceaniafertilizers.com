import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LegalPageView } from '@/components/content/LegalPageView';
import { getLegalPage } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('terms');
  return pageMetadata({
    title: page?.title ?? 'Terms and conditions',
    description: page?.summary ?? 'The terms that apply when you use the Oceania Fertilizers website.',
    path: '/terms',
  });
}

export default async function TermsPage() {
  const page = await getLegalPage('terms');
  if (!page) notFound();
  return <LegalPageView page={page} />;
}
