'use client';

import { useRef, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/brand/icons';
import type { GalleryItem } from '@/content/types';
import { formatDate } from '@/lib/format';

import { Picture } from './Picture';

function caption(item: GalleryItem) {
  const place = [item.district, item.state].filter(Boolean).join(', ');
  return [item.title, place, item.date ? formatDate(item.date) : ''].filter(Boolean).join(', ');
}

/**
 * Justified rows sized by each photograph's own proportions (pure CSS), and a
 * lightbox dialog with previous and next, arrow keys and visible captions.
 * Items hidden by the category filter are skipped.
 */
export function GalleryGrid({ items, listId }: { items: GalleryItem[]; listId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  // The photos that were visible (not filtered out) when the viewer opened.
  const [viewer, setViewer] = useState<{ index: number; visible: number[] } | null>(null);
  const current = viewer === null ? null : items[viewer.index];

  function step(direction: 1 | -1) {
    setViewer((state) => {
      if (!state || state.visible.length === 0) return state;
      const at = state.visible.indexOf(state.index);
      const next = state.visible[(at + direction + state.visible.length) % state.visible.length];
      return next === undefined ? state : { ...state, index: next };
    });
  }

  function open(position: number) {
    const visible = items
      .map((_, index) => index)
      .filter((index) => !triggers.current[index]?.closest('[data-filter-item]')?.hasAttribute('hidden'));
    setViewer({ index: position, visible });
    dialogRef.current?.showModal();
  }

  const visibleCount = viewer?.visible.length ?? 0;
  const visiblePosition = viewer ? viewer.visible.indexOf(viewer.index) + 1 : 0;

  return (
    <>
      <ul id={listId} className="flex flex-wrap gap-3 after:block after:grow-[10000] after:content-['']">
        {items.map((item, position) => {
          const ratio = item.image.width / item.image.height;
          return (
            <li
              key={item.id}
              data-filter-item=""
              data-filter-category={item.category.slug}
              style={{ flexGrow: ratio * 100, flexBasis: `calc(${ratio} * clamp(9rem, 22vw, 15rem))` }}
            >
              <button
                ref={(element) => {
                  triggers.current[position] = element;
                }}
                type="button"
                onClick={() => open(position)}
                aria-label={`Open photo: ${caption(item)}`}
                aria-haspopup="dialog"
                className="group relative block w-full overflow-hidden bg-sand-200"
                style={{ aspectRatio: `${ratio}` }}
              >
                <Picture
                  image={item.image}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </button>
              <p className="type-caption mt-2 text-ink-500">{item.title}</p>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
        data-animate=""
        data-lock-scroll=""
        onClose={() => {
          if (viewer !== null) triggers.current[viewer.index]?.focus();
          setViewer(null);
        }}
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-botanical-950 p-0 text-ivory-50"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="container-site flex h-16 shrink-0 items-center justify-between">
              <p className="type-numeral type-small text-sage-300" aria-live="polite">
                {visiblePosition} of {visibleCount}
              </p>
              <button type="button" onClick={() => dialogRef.current?.close()} className="inline-flex min-h-11 items-center gap-2 font-medium">
                Close
                <CloseIcon />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Picture image={current.image} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="container-site flex shrink-0 flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-[1.25rem] font-bold">{current.title}</p>
                <p className="type-caption mt-1 text-sage-300">
                  {caption(current)}
                  {current.image.credit ? `. Photo: ${current.image.credit.author}` : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="flex h-12 w-12 items-center justify-center border border-ivory-50/40 hover:border-ivory-50"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="flex h-12 w-12 items-center justify-center border border-ivory-50/40 hover:border-ivory-50"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
