'use client';

import { createContext, useContext, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

import { ChevronDownIcon } from '@/components/brand/icons';

/*
 * Form fields. Each is labelled, marks optional fields in words, and links its
 * hint and error to the control with aria-describedby. Values come back from
 * the server after a failed submission so nothing typed is lost.
 */

type Tone = 'light' | 'dark';

type FormContextValue = {
  id: string;
  errors: Record<string, string>;
  values: Record<string, string | string[]>;
  tone: Tone;
};

export const FormContext = createContext<FormContextValue>({ id: 'form', errors: {}, values: {}, tone: 'light' });

function useField(name: string) {
  const context = useContext(FormContext);
  const id = `${context.id}-${name}`;
  const value = context.values[name];
  return {
    id,
    hintId: `${id}-hint`,
    errorId: `${id}-error`,
    error: context.errors[name],
    value: typeof value === 'string' ? value : undefined,
    values: Array.isArray(value) ? value : typeof value === 'string' ? [value] : [],
    tone: context.tone,
  };
}

const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined;

function controlClass(tone: Tone, invalid: boolean) {
  const base =
    'block w-full rounded-[2px] border px-4 text-[1rem] transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2';
  if (tone === 'dark') {
    return `${base} bg-transparent text-ivory-50 placeholder:text-sage-400 focus:border-ivory-50 focus-visible:outline-gold-300 ${
      invalid ? 'border-gold-300' : 'border-[color:var(--line-control-on-dark)] hover:border-ivory-50/70'
    }`;
  }
  return `${base} bg-white/70 text-ink-900 placeholder:text-ink-500 focus:border-forest-800 focus-visible:outline-gold-700 ${
    invalid ? 'border-error-700' : 'border-[color:var(--line-control)] hover:border-ink-700'
  }`;
}

export function FieldLabel({
  htmlFor,
  children,
  optional,
  tone = 'light',
  as: Tag = 'label',
}: {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
  tone?: Tone;
  as?: 'label' | 'legend';
}) {
  const color = tone === 'dark' ? 'text-ivory-50' : 'text-ink-900';
  const muted = tone === 'dark' ? 'text-sage-300' : 'text-ink-500';
  return (
    <Tag htmlFor={Tag === 'label' ? htmlFor : undefined} className={`type-small block font-bold ${color}`}>
      {children}
      {optional ? <span className={`font-normal ${muted}`}> (optional)</span> : null}
    </Tag>
  );
}

function Hint({ id, children, tone }: { id: string; children?: ReactNode; tone: Tone }) {
  if (!children) return null;
  return (
    <p id={id} className={`type-caption mt-1 ${tone === 'dark' ? 'text-sage-300' : 'text-ink-500'}`}>
      {children}
    </p>
  );
}

export function FieldError({ id, message, tone = 'light' }: { id: string; message?: string; tone?: Tone }) {
  if (!message) return null;
  return (
    <p id={id} className={`type-small mt-2 font-bold ${tone === 'dark' ? 'text-gold-300' : 'text-error-700'}`}>
      <span className="sr-only">Error: </span>
      {message}
    </p>
  );
}

type Messages = {
  /** Shown when a required field is left empty (client-side check). */
  requiredMessage?: string;
  /** Shown when the value does not match the expected format (client-side check). */
  invalidMessage?: string;
};

type TextFieldProps = Messages &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'defaultValue'> & {
    name: string;
    label: ReactNode;
    hint?: ReactNode;
    optional?: boolean;
  };

export function TextField({
  name,
  label,
  hint,
  optional,
  requiredMessage,
  invalidMessage,
  className = '',
  type = 'text',
  ...input
}: TextFieldProps) {
  const field = useField(name);
  return (
    <div className={className}>
      <FieldLabel htmlFor={field.id} optional={optional} tone={field.tone}>
        {label}
      </FieldLabel>
      <Hint id={field.hintId} tone={field.tone}>
        {hint}
      </Hint>
      <input
        id={field.id}
        name={name}
        type={type}
        required={!optional}
        defaultValue={field.value}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(hint ? field.hintId : false, field.error ? field.errorId : false)}
        data-msg-required={requiredMessage}
        data-msg-invalid={invalidMessage}
        className={`mt-2 h-12 ${controlClass(field.tone, Boolean(field.error))}`}
        {...input}
      />
      <FieldError id={field.errorId} message={field.error} tone={field.tone} />
    </div>
  );
}

type TextAreaFieldProps = Messages &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'id' | 'defaultValue'> & {
    name: string;
    label: ReactNode;
    hint?: ReactNode;
    optional?: boolean;
  };

export function TextAreaField({
  name,
  label,
  hint,
  optional,
  requiredMessage,
  invalidMessage,
  className = '',
  rows = 5,
  ...textarea
}: TextAreaFieldProps) {
  const field = useField(name);
  return (
    <div className={className}>
      <FieldLabel htmlFor={field.id} optional={optional} tone={field.tone}>
        {label}
      </FieldLabel>
      <Hint id={field.hintId} tone={field.tone}>
        {hint}
      </Hint>
      <textarea
        id={field.id}
        name={name}
        rows={rows}
        required={!optional}
        defaultValue={field.value}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(hint ? field.hintId : false, field.error ? field.errorId : false)}
        data-msg-required={requiredMessage}
        data-msg-invalid={invalidMessage}
        className={`mt-2 py-3 leading-relaxed ${controlClass(field.tone, Boolean(field.error))}`}
        {...textarea}
      />
      <FieldError id={field.errorId} message={field.error} tone={field.tone} />
    </div>
  );
}

export type Option = { value: string; label: string };

type SelectFieldProps = Messages & {
  name: string;
  label: ReactNode;
  options: Option[];
  placeholder?: string;
  hint?: ReactNode;
  optional?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  className?: string;
};

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Choose one',
  hint,
  optional,
  defaultValue,
  autoComplete,
  requiredMessage,
  className = '',
}: SelectFieldProps) {
  const field = useField(name);
  return (
    <div className={className}>
      <FieldLabel htmlFor={field.id} optional={optional} tone={field.tone}>
        {label}
      </FieldLabel>
      <Hint id={field.hintId} tone={field.tone}>
        {hint}
      </Hint>
      <div className="relative mt-2">
        <select
          id={field.id}
          name={name}
          required={!optional}
          defaultValue={field.value ?? defaultValue ?? ''}
          autoComplete={autoComplete}
          aria-invalid={field.error ? true : undefined}
          aria-describedby={describedBy(hint ? field.hintId : false, field.error ? field.errorId : false)}
          data-msg-required={requiredMessage}
          className={`h-12 appearance-none pr-11 ${controlClass(field.tone, Boolean(field.error))}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 ${field.tone === 'dark' ? 'text-ivory-50' : 'text-ink-700'}`}
        />
      </div>
      <FieldError id={field.errorId} message={field.error} tone={field.tone} />
    </div>
  );
}

type CheckboxFieldProps = Messages & {
  name: string;
  label: ReactNode;
  optional?: boolean;
  defaultChecked?: boolean;
  className?: string;
};

/** A single checkbox that submits "yes" when ticked. Used for consent. */
export function CheckboxField({ name, label, optional, defaultChecked, requiredMessage, className = '' }: CheckboxFieldProps) {
  const field = useField(name);
  const checked = field.value !== undefined ? field.value === 'yes' : defaultChecked;
  const textColor = field.tone === 'dark' ? 'text-sage-200' : 'text-ink-700';
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={field.id}
          name={name}
          type="checkbox"
          value="yes"
          required={!optional}
          defaultChecked={checked}
          aria-invalid={field.error ? true : undefined}
          aria-describedby={field.error ? field.errorId : undefined}
          data-msg-required={requiredMessage}
          className="h-6 w-6 shrink-0 cursor-pointer accent-forest-800"
        />
        <label htmlFor={field.id} className={`type-small cursor-pointer ${textColor}`}>
          {label}
        </label>
      </div>
      <FieldError id={field.errorId} message={field.error} tone={field.tone} />
    </div>
  );
}

type ChoiceGroupProps = Messages & {
  name: string;
  legend: ReactNode;
  options: (Option & { description?: string })[];
  type: 'checkbox' | 'radio';
  hint?: ReactNode;
  optional?: boolean;
  defaultValues?: string[];
  columns?: 1 | 2;
  className?: string;
};

/** A group of checkboxes or radio buttons inside a fieldset with a legend. */
export function ChoiceGroup({
  name,
  legend,
  options,
  type,
  hint,
  optional,
  defaultValues = [],
  columns = 1,
  requiredMessage,
  className = '',
}: ChoiceGroupProps) {
  const field = useField(name);
  const selected = field.values.length > 0 ? field.values : defaultValues;
  return (
    <fieldset
      className={className}
      aria-invalid={field.error ? true : undefined}
      aria-describedby={describedBy(hint ? field.hintId : false, field.error ? field.errorId : false)}
    >
      <FieldLabel as="legend" optional={optional} tone={field.tone}>
        {legend}
      </FieldLabel>
      <Hint id={field.hintId} tone={field.tone}>
        {hint}
      </Hint>
      <div className={`mt-3 grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
        {options.map((option, index) => {
          const optionId = `${field.id}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex cursor-pointer items-start gap-3 border border-[color:var(--line-strong)] bg-white/50 px-4 py-3 transition-colors hover:border-ink-700 has-[:checked]:border-forest-800 has-[:checked]:bg-white"
            >
              <input
                id={optionId}
                name={name}
                type={type}
                value={option.value}
                required={type === 'radio' && !optional && index === 0 ? true : undefined}
                defaultChecked={selected.includes(option.value)}
                data-msg-required={requiredMessage}
                className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-forest-800"
              />
              <span>
                <span className="type-small block font-medium text-ink-900">{option.label}</span>
                {option.description ? (
                  <span className="type-caption mt-1 block text-ink-500">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={field.errorId} message={field.error} tone={field.tone} />
    </fieldset>
  );
}
