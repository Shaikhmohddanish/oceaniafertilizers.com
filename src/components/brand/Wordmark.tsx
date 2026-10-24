/**
 * INTERIM WORDMARK. The client has not yet supplied an official logo file and
 * the mockups show four different logos. This typographic mark stands in until
 * the vector logo arrives; replace this one component to update the whole site.
 */
type WordmarkProps = {
  tone?: 'ink' | 'ivory';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: { main: 'text-[1.0625rem]', sub: 'text-[0.4375rem] tracking-[0.5em]' },
  md: { main: 'text-[1.3125rem]', sub: 'text-[0.5rem] tracking-[0.56em]' },
  lg: { main: 'text-[2.25rem]', sub: 'text-[0.75rem] tracking-[0.6em]' },
};

export function Wordmark({ tone = 'ink', size = 'md', className = '' }: WordmarkProps) {
  const color = tone === 'ink' ? 'text-forest-800' : 'text-ivory-50';
  const sub = tone === 'ink' ? 'text-gold-700' : 'text-gold-300';
  return (
    <span className={`inline-flex flex-col items-center leading-none select-none ${color} ${className}`}>
      <span className={`font-display font-bold tracking-[0.16em] ${sizes[size].main}`} style={{ marginRight: '-0.16em' }}>
        OCEANIA
      </span>{' '}
      <span className={`mt-[0.36em] font-sans font-bold ${sizes[size].sub} ${sub}`} style={{ marginRight: '-0.5em' }}>
        FERTILIZERS
      </span>
    </span>
  );
}
