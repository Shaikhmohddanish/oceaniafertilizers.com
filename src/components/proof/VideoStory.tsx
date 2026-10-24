'use client';

import { useRef, useState } from 'react';

import { CloseIcon, PlayIcon } from '@/components/brand/icons';
import { RichText } from '@/components/content/RichText';
import { Picture } from '@/components/media/Picture';
import { PendingTag } from '@/components/ui/PendingTag';
import type { Testimonial } from '@/content/types';
import { track } from '@/lib/analytics';
import { formatDuration } from '@/lib/format';

function embedSrc(video: Testimonial['video']) {
  return video.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`
    : `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1`;
}

/**
 * A farmer's story: poster, quote and attribution. The player is created only
 * when someone presses play, inside a native modal dialog that returns focus
 * when it closes. Nothing autoplays on page load.
 */
export function VideoStory({ story, size = 'default' }: { story: Testimonial; size?: 'default' | 'feature' }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const place = [story.district, story.state].filter(Boolean).join(', ');
  const poster =
    story.poster ??
    (story.video.provider === 'youtube'
      ? {
          src: `https://i.ytimg.com/vi/${story.video.id}/hqdefault.jpg`,
          width: 480,
          height: 360,
          alt: '',
        }
      : undefined);

  function play() {
    setOpen(true);
    dialogRef.current?.showModal();
    track('video_play', { story: story.id });
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <article id={story.id} className="group scroll-mt-32" data-reveal="rise">
      <button
        ref={triggerRef}
        type="button"
        onClick={play}
        className="relative block w-full overflow-hidden bg-forest-900 text-left"
        style={{ aspectRatio: size === 'feature' ? '16 / 9' : '4 / 3' }}
        aria-label={`Play video: ${story.farmerName}${place ? `, ${place}` : ''}${story.video.durationSeconds ? `, ${formatDuration(story.video.durationSeconds)}` : ''}`}
      >
        {poster ? (
          <Picture
            image={poster}
            fill
            alt=""
            sizes={size === 'feature' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : null}
        <span className="absolute bottom-4 left-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory-50 text-forest-900 transition-transform duration-300 group-hover:scale-105">
            <PlayIcon />
          </span>
          {story.video.durationSeconds ? (
            <span className="type-numeral type-caption bg-botanical-950/85 px-2 py-1 text-ivory-50">
              {formatDuration(story.video.durationSeconds)}
            </span>
          ) : null}
        </span>
      </button>

      <div className="mt-5">
        <div className="flex items-center gap-3">
          {story.crop ? <p className="type-label text-gold-700">{story.crop.title}</p> : null}
          <PendingTag status={story.status} />
        </div>
        <blockquote className={`mt-3 font-display text-forest-900 ${size === 'feature' ? 'type-h3' : 'text-[1.3125rem] leading-snug'}`}>
          &quot;{story.quote}&quot;
        </blockquote>
        <p className="type-small mt-4 text-ink-700">
          <span className="font-semibold text-ink-900">{story.farmerName}</span>
          {place ? `, ${place}` : ''}
          {story.products.length > 0 ? ` / ${story.products.map((product) => product.name).join(', ')}` : ''}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`Video: ${story.farmerName}`}
        data-animate=""
        data-lock-scroll=""
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none bg-botanical-950 p-0 text-ivory-50"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <p className="type-small truncate">
            <span className="font-semibold">{story.farmerName}</span>
            {place ? `, ${place}` : ''}
          </p>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 items-center gap-2 px-2 text-[0.9375rem] font-medium"
          >
            Close
            <CloseIcon />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          {open ? (
            <iframe
              src={embedSrc(story.video)}
              title={`Video: ${story.farmerName}${place ? `, ${place}` : ''}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          ) : null}
        </div>
        {story.transcript ? (
          <details className="group border-t border-[color:var(--line-on-dark)] px-5">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
              Read the transcript{story.transcriptLanguage ? ` (${story.transcriptLanguage})` : ''}
              <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <RichText value={story.transcript} className="type-small max-h-64 overflow-y-auto pb-5 text-sage-200" />
          </details>
        ) : null}
      </dialog>
    </article>
  );
}
