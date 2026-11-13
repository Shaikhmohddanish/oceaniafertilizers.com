import { PlayIcon } from './icons';

/*
 * The O device from the brand and mobile proposal: shapes taken from the "O" of
 * the wordmark, in clay. Provisional until the official logo arrives. It is used
 * in two places only, so it stays recognisable: the homepage hero (a photograph
 * held in the O) and video covers (the play mark).
 */

/** A photograph held inside the O: an oval clay ring around the image. */
export function OFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[6/7] rounded-[50%] bg-clay-300 p-[6%] ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[50%] bg-pine-900">{children}</div>
    </div>
  );
}

/** The play mark on video covers: a clay O with the play triangle inside. */
export function OPlay({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const shape = size === 'lg' ? 'h-20 w-[4.25rem] border-[7px]' : 'h-14 w-12 border-[5px]';
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-[50%] border-clay-300 bg-pine-900/75 text-clay-300 transition-transform duration-300 group-hover:scale-105 ${shape}`}
    >
      <PlayIcon size={size === 'lg' ? 26 : 20} />
    </span>
  );
}
