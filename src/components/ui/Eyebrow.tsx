type EyebrowProps = {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  as?: 'p' | 'span' | 'h2';
  className?: string;
};

/** A short label above a heading, used sparingly where it adds context. */
export function Eyebrow({ children, tone = 'light', as: Tag = 'p', className = '' }: EyebrowProps) {
  const color = tone === 'light' ? 'text-gold-700' : 'text-gold-300';
  return <Tag className={`type-label ${color} ${className}`}>{children}</Tag>;
}
