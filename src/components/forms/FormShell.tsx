'use client';

import { usePathname } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { ArrowRightIcon } from '@/components/brand/icons';
import { buttonClass } from '@/components/ui/Button';
import { track } from '@/lib/analytics';
import {
  HONEYPOT_FIELD,
  initialFormState,
  SOURCE_FIELD,
  STARTED_AT_FIELD,
  UTM_FIELD,
  type FormState,
} from '@/lib/forms/state';

import { FormContext } from './fields';
import { TURNSTILE_SITE_KEY, Turnstile } from './Turnstile';

type ServerAction = (previous: FormState, formData: FormData) => Promise<FormState>;

type FormShellProps = {
  /** Unique on the page; prefixes field ids. */
  id: string;
  serverAction: ServerAction;
  /** Sent to analytics with the generate_lead event. */
  analyticsName: string;
  submitLabel: string;
  pendingLabel?: string;
  tone?: 'light' | 'dark';
  children: ReactNode;
  /** Extra content under the success message, such as next steps. */
  successExtra?: ReactNode;
  successTitle?: string;
  /** Contact options shown when something goes wrong. */
  fallback?: ReactNode;
  className?: string;
  submitClassName?: string;
  compact?: boolean;
};

type ClientError = { name: string; message: string };

/** Checks fields with the browser's constraint API and our own wording. */
function validate(form: HTMLFormElement): ClientError[] {
  const errors: ClientError[] = [];
  const seen = new Set<string>();
  for (const element of Array.from(form.elements)) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) continue;
    if (!element.name || !element.willValidate || seen.has(element.name)) continue;
    if (element.checkValidity()) continue;
    seen.add(element.name);
    const message = element.validity.valueMissing
      ? (element.dataset.msgRequired ?? 'This field is required.')
      : (element.dataset.msgInvalid ?? element.validationMessage);
    errors.push({ name: element.name, message });
  }
  return errors;
}

function readUtm(): string {
  const params = new URLSearchParams(window.location.search);
  const entries = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    .map((key) => [key, params.get(key)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));
  return entries.length > 0 ? JSON.stringify(Object.fromEntries(entries)) : '';
}

/**
 * Shared behaviour for every form. Works as a plain form post before
 * JavaScript loads; once hydrated it validates in the browser, shows an error
 * summary, keeps the honeypot and timing fields, and loads Turnstile on demand.
 */
export function FormShell({
  id,
  serverAction,
  analyticsName,
  submitLabel,
  pendingLabel = 'Sending...',
  tone = 'light',
  children,
  successExtra,
  successTitle = 'Thank you',
  fallback,
  className = '',
  submitClassName = '',
  compact = false,
}: FormShellProps) {
  const pathname = usePathname();
  // Before JavaScript loads, the browser posts to this address. The fragment brings the
  // visitor back to the form and its outcome rather than to the top of the page.
  const [state, formAction, pending] = useActionState(serverAction, initialFormState, `${pathname ?? ''}#${id}`);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [hydrated, setHydrated] = useState(false);
  const [startedAt, setStartedAt] = useState('');
  const [utm, setUtm] = useState('');
  const [clientErrors, setClientErrors] = useState<ClientError[] | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [waitingForCheck, setWaitingForCheck] = useState(false);

  useEffect(() => {
    // Client-only values, set after hydration so server and client markup match.
    /* eslint-disable react-hooks/set-state-in-effect */
    setHydrated(true);
    setStartedAt(String(Date.now()));
    setUtm(readUtm());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // A new server response: drop client errors and move focus to the outcome.
  useEffect(() => {
    if (!state.respondedAt) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClientErrors(null);
    if (state.status === 'success' || state.status === 'duplicate') {
      resultRef.current?.focus();
      if (state.status === 'success') track('generate_lead', { form: analyticsName });
    } else {
      summaryRef.current?.focus();
    }
  }, [state.respondedAt, state.status, analyticsName]);

  // Submit automatically once the security check has produced its token.
  useEffect(() => {
    if (waitingForCheck && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWaitingForCheck(false);
      formRef.current?.requestSubmit();
    }
  }, [waitingForCheck, token]);

  const serverErrors = state.status === 'invalid' ? (state.fieldErrors ?? {}) : {};
  const errorList: ClientError[] =
    clientErrors ?? Object.entries(serverErrors).map(([name, message]) => ({ name, message }));
  const errors = Object.fromEntries(errorList.map((error) => [error.name, error.message]));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validate(event.currentTarget);
    if (found.length > 0) {
      event.preventDefault();
      setClientErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setClientErrors(null);
    if (TURNSTILE_SITE_KEY && !token) {
      event.preventDefault();
      setInteracted(true);
      setWaitingForCheck(true);
    }
  }

  function clearFieldError(name: string) {
    setClientErrors((current) => (current ? current.filter((error) => error.name !== name) : current));
  }

  if (state.status === 'success' || state.status === 'duplicate') {
    return (
      <div
        ref={resultRef}
        id={id}
        tabIndex={-1}
        role="status"
        className={`outline-none ${tone === 'dark' ? 'text-ivory-50' : 'text-ink-900'} ${className}`}
      >
        <p className={`type-label ${tone === 'dark' ? 'text-gold-300' : 'text-gold-700'}`}>
          {state.status === 'success' ? 'Received' : 'Already received'}
        </p>
        <p className={`mt-3 font-display font-bold ${compact ? 'text-[1.5rem]' : 'type-h3'}`}>
          {state.status === 'success' ? successTitle : 'We have this already'}
        </p>
        <p className={`mt-3 max-w-[48ch] ${tone === 'dark' ? 'text-sage-200' : 'text-ink-700'}`}>{state.message}</p>
        {state.reference ? (
          <p className={`type-small mt-4 ${tone === 'dark' ? 'text-sage-300' : 'text-ink-500'}`}>
            Your reference: <span className="type-numeral font-semibold text-current">{state.reference}</span>
          </p>
        ) : null}
        {state.status === 'success' ? successExtra : null}
      </div>
    );
  }

  const showSummary = errorList.length > 0 || state.status === 'error' || state.status === 'rate_limited';
  const summaryTone =
    tone === 'dark' ? 'border-gold-300/60 bg-forest-900 text-ivory-50' : 'border-error-700/40 bg-error-100 text-ink-900';

  return (
    <FormContext.Provider value={{ id, errors, values: state.values ?? {}, tone }}>
      <form
        ref={formRef}
        id={id}
        action={formAction}
        onSubmit={onSubmit}
        onFocusCapture={() => setInteracted(true)}
        onInput={(event) => {
          const target = event.target as HTMLInputElement;
          if (target.name) clearFieldError(target.name);
        }}
        noValidate={hydrated}
        className={`relative ${className}`}
        aria-describedby={showSummary ? `${id}-summary` : undefined}
      >
        <div
          ref={summaryRef}
          id={`${id}-summary`}
          tabIndex={-1}
          role={showSummary ? 'alert' : undefined}
          className={showSummary ? `mb-8 border px-5 py-4 outline-none ${summaryTone}` : 'sr-only'}
        >
          {showSummary ? (
            <>
              <p className="font-semibold">
                {errorList.length > 0 ? 'Please check the following:' : 'Your details were not sent'}
              </p>
              {errorList.length > 0 ? (
                <ul className="type-small mt-2 list-disc space-y-1 pl-5">
                  {errorList.map((error) => (
                    <li key={error.name}>
                      <a
                        href={`#${id}-${error.name}`}
                        className="link-inline"
                        onClick={(event) => {
                          event.preventDefault();
                          const field =
                            document.getElementById(`${id}-${error.name}`) ??
                            formRef.current?.querySelector<HTMLElement>(`[name="${error.name}"]`);
                          field?.focus();
                        }}
                      >
                        {error.message}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="type-small mt-2">{state.message}</p>
              )}
              {state.status === 'error' && fallback ? <div className="type-small mt-3">{fallback}</div> : null}
            </>
          ) : null}
        </div>

        {/* Internal fields: spam protection and context. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Leave this field empty</label>
          <input id={`${id}-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <input type="hidden" name={STARTED_AT_FIELD} value={startedAt} />
        <input type="hidden" name={SOURCE_FIELD} value={pathname ?? ''} />
        <input type="hidden" name={UTM_FIELD} value={utm} />

        {children}

        <Turnstile active={interacted} action={analyticsName} onToken={setToken} resetKey={state.respondedAt} />

        <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${compact ? 'mt-5' : 'mt-8'}`}>
          <button
            type="submit"
            disabled={pending || waitingForCheck}
            className={`${buttonClass(tone === 'dark' ? 'light' : 'primary', 'md')} ${submitClassName}`}
          >
            <span>{pending ? pendingLabel : waitingForCheck ? 'Checking...' : submitLabel}</span>
            <ArrowRightIcon size={18} />
          </button>
          <p aria-live="polite" className={`type-caption ${tone === 'dark' ? 'text-sage-300' : 'text-ink-500'}`}>
            {pending ? 'Sending your details securely.' : waitingForCheck ? 'Running a quick security check.' : ''}
          </p>
        </div>
      </form>
    </FormContext.Provider>
  );
}
