'use client';

import { NEWSLETTER_CONSENT_TEXT } from '@/lib/forms/state';
import { submitNewsletter } from '@/server/forms/actions';

import { PrivacyLink } from './consent';
import { CheckboxField, TextField } from './fields';
import { FormShell } from './FormShell';
import { messages } from './options';

export function NewsletterForm({ tone = 'dark', id = 'newsletter' }: { tone?: 'light' | 'dark'; id?: string }) {
  return (
    <FormShell
      id={id}
      serverAction={submitNewsletter}
      analyticsName="newsletter"
      submitLabel="Subscribe"
      successTitle="You are subscribed"
      tone={tone}
      compact
    >
      <div className="space-y-5">
        <TextField name="email" placeholder="name@example.com" label="Email address" type="email" autoComplete="email" maxLength={254} {...messages.email} />
        <CheckboxField
          name="consentNewsletter"
          label={
            <>
              {NEWSLETTER_CONSENT_TEXT} See our <PrivacyLink />.
            </>
          }
          requiredMessage="Please confirm you would like to receive the newsletter."
        />
      </div>
    </FormShell>
  );
}
