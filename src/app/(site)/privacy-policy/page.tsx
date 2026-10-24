import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LegalPageView } from '@/components/content/LegalPageView';
import { getLegalPage } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy-policy');
  return pageMetadata({
    title: page?.title ?? 'Privacy policy',
    description: page?.summary ?? 'How Oceania Fertilizers handles personal data collected through this website.',
    path: '/privacy-policy',
  });
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage('privacy-policy');
  if (!page) notFound();
  return <LegalPageView page={page} />;
}
