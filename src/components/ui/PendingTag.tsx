import type { PublicationStatus } from '@/content/types';

/**
 * Marks content that Oceania has not approved yet. Pending content only
 * renders outside production, so visitors to the live site never see this.
 */
export function PendingTag({ status, className = '' }: { status: PublicationStatus; className?: string }) {
  if (status !== 'pending') return null;
  return (
    <span
      className={`type-label inline-flex items-center gap-2 border border-gold-700/40 bg-ivory-100 px-2 py-1 text-gold-700 ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-gold-700" />
      Pending approval
    </span>
  );
}
