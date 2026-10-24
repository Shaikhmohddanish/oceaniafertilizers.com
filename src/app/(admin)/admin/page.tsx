import { notFound, redirect } from 'next/navigation';

import { Wordmark } from '@/components/brand/Wordmark';
import { adminEnabled, hasSession } from '@/server/admin/session';

import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (!adminEnabled()) notFound();
  if (await hasSession()) redirect('/admin/leads');

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <Wordmark />
      <h1 className="type-h2 mt-12 text-forest-900">Leads</h1>
      <p className="mt-3 text-ink-700">Sign in to see enquiries, partner applications and farmer registrations.</p>
      <LoginForm />
    </main>
  );
}
