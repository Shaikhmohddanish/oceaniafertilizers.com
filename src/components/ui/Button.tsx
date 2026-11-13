import Link from 'next/link';
import type { ComponentProps } from 'react';

import { ArrowRightIcon } from '@/components/brand/icons';

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light';
type Size = 'md' | 'sm';

const base =
  'has-arrow inline-flex items-center justify-center gap-3 rounded-[2px] font-sans font-bold tracking-[0.01em] whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

/*
 * Clay marks the action. On paper the clay fill alone is too close to the
 * background, so it carries a darker clay edge (3.6:1); on pine it stands on its own.
 */
const variants: Record<Variant, string> = {
  primary: 'border border-clay-600 bg-clay-300 text-ink-900 hover:bg-clay-400',
  secondary: 'border border-pine-700 text-pine-700 hover:bg-pine-700 hover:text-paper',
  light: 'bg-clay-300 text-ink-900 hover:bg-clay-400',
  'outline-light': 'border border-paper/50 text-paper hover:border-paper',
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
