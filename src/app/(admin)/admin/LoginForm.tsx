'use client';

import { useActionState } from 'react';

import { login, type LoginState } from '@/server/admin/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="admin-password" className="type-small block font-medium">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? 'admin-password-error' : undefined}
          className="mt-2 block h-12 w-full rounded-[2px] border border-[color:var(--line-control)] bg-white px-4 focus:border-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
        />
        {state.error ? (
          <p id="admin-password-error" role="alert" className="type-small mt-2 font-medium text-error-700">
            {state.error}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center rounded-[2px] bg-forest-800 px-6 font-medium text-ivory-50 hover:bg-forest-900 disabled:opacity-60"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
