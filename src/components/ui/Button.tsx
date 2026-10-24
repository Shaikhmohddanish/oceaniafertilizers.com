import Link from 'next/link';
import type { ComponentProps } from 'react';

import { ArrowRightIcon } from '@/components/brand/icons';

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light';
type Size = 'md' | 'sm';

const base =
  'has-arrow inline-flex items-center justify-center gap-3 rounded-[2px] font-sans font-bold tracking-[0.01em] whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-forest-800 text-ivory-50 hover:bg-forest-900',
  secondary: 'border border-[color:var(--line-strong)] text-ink-900 hover:border-ink-900',
  light: 'bg-ivory-50 text-forest-900 hover:bg-white',
  'outline-light': 'border border-ivory-50/40 text-ivory-50 hover:border-ivory-50',
};

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 text-[0.9375rem]',
  sm: 'min-h-10 px-4 text-[0.875rem]',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
};

export function ButtonLink({ variant = 'primary', size = 'md', arrow = true, className = '', children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow ? <ArrowRightIcon size={18} /> : null}
    </Link>
  );
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
};

export function Button({ variant = 'primary', size = 'md', arrow = false, className = '', children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow ? <ArrowRightIcon size={18} /> : null}
    </button>
  );
}

type TextLinkProps = ComponentProps<typeof Link> & { arrow?: boolean };

/** An understated text link with a drawn underline and an optional arrow. */
export function TextLink({ arrow = true, className = '', children, ...props }: TextLinkProps) {
  return (
    <Link className={`has-arrow group inline-flex items-center gap-2 font-medium ${className}`} {...props}>
      <span className="link-draw">{children}</span>
      {arrow ? <ArrowRightIcon size={18} /> : null}
    </Link>
  );
}
