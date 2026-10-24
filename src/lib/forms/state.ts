/** Shared by server actions and the client forms that render their results. */

export type FormStatus = 'idle' | 'success' | 'duplicate' | 'invalid' | 'rate_limited' | 'error';

export type FormState = {
  status: FormStatus;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Lead reference, shown on success. */
  reference?: string;
  /** Submitted values, so a form re-rendered without JavaScript keeps what was typed. */
  values?: Record<string, string | string[]>;
  /** Changes on every response, so the client can react to repeat errors. */
  respondedAt?: number;
};

export const initialFormState: FormState = { status: 'idle' };

/** Internal fields added to every form. */
export const HONEYPOT_FIELD = 'oc_hp';
export const STARTED_AT_FIELD = 'oc_started';
export const SOURCE_FIELD = 'oc_source';
export const UTM_FIELD = 'oc_utm';
export const TURNSTILE_FIELD = 'cf-turnstile-response';

/** Version of the consent wording shown on forms. Update when the wording changes. */
export const CONSENT_VERSION = '2026-10-24';

/** Wording of the newsletter consent checkbox, stored with each subscription. */
export const NEWSLETTER_CONSENT_TEXT =
  'I would like to receive the Oceania newsletter by email. I can unsubscribe at any time.';
