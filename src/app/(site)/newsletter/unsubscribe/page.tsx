import type { Metadata } from 'next';
import Link from 'next/link';

import { buttonClass } from '@/components/ui/Button';
import { getDb } from '@/server/db/client';
import { unsubscribeFromNewsletter } from '@/server/forms/actions';
import { findSubscriberByToken } from '@/server/leads/service';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Stop receiving the Oceania newsletter.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type View = { title: string; body: string; token?: string; retry?: boolean };

/** Enough of the address for someone to recognise it, without showing all of it. */
function maskEmail(email: string) {
  const [name = '', domain = ''] = email.split('@');
  return `${name.slice(0, 1)}${'*'.repeat(Math.min(6, Math.max(1, name.length - 1)))}@${domain}`;
}

const invalid: View = {
  title: 'This unsubscribe link is not complete.',
  body: 'Copy the whole link from the email into your browser, or send us a message and we will remove you.',
};

async function resolveView(params: Record<string, string | string[] | undefined>): Promise<View> {
  const token = typeof params.token === 'string' ? params.token : '';
  if (params.done) {
    return {
      title: 'You have been unsubscribed.',
      body: 'We will not send you the Oceania newsletter again. If you change your mind, you can sign up again at the foot of any page.',
    };
  }
  if (params.invalid || !token) return invalid;
  const failed: View = {
    title: 'That did not work this time.',
    body: 'We could not update your preferences just now. Please try again in a few minutes.',
    token,
    retry: true,
  };
  if (params.failed) return failed;
  try {
    const subscriber = await findSubscriberByToken(await getDb(), token);
    if (!subscriber) return invalid;
    if (subscriber.status === 'unsubscribed') {
      return { title: 'You are already unsubscribed.', body: 'This address no longer receives the Oceania newsletter.' };
    }
    return {
      title: 'Stop the Oceania newsletter?',
      body: `We will stop sending the newsletter to ${maskEmail(subscriber.email)}.`,
      token,
    };
  } catch {
    return failed;
  }
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const view = await resolveView(await searchParams);
  return (
    <section className="section-space bg-ivory-50" aria-labelledby="unsubscribe-title">
      <div className="container-site">
        <div className="max-w-[40rem]">
          <p className="type-label text-gold-700">Newsletter</p>
          <h1 id="unsubscribe-title" className="type-h1 mt-6 text-forest-900">
            {view.title}
          </h1>
          <p className="type-lead mt-8 text-ink-700">{view.body}</p>
          {view.token ? (
            <form action={unsubscribeFromNewsletter} className="mt-10">
              <input type="hidden" name="token" value={view.token} />
              <button type="submit" className={buttonClass('primary', 'md')}>
                {view.retry ? 'Try again' : 'Unsubscribe'}
              </button>
            </form>
          ) : (
            <p className="mt-10">
              <Link href={view === invalid ? '/contact' : '/'} className="link-draw font-medium text-forest-900">
                {view === invalid ? 'Send us a message' : 'Go to the homepage'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
