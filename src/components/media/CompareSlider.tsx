'use client';

import { useId, useRef, useState, type PointerEvent } from 'react';

import type { ImageAsset } from '@/content/types';

import { Picture } from './Picture';

type CompareSliderProps = {
  before: ImageAsset;
  after: ImageAsset;
  label: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspect?: string;
  sizes?: string;
};

/**
 * Before and after, one over the other. Drag or tap anywhere on the image to
 * move the divide (touch and mouse), or use the arrow keys on the slider,
 * which is a native range input for keyboards and screen readers.
 */
export function CompareSlider({
  before,
  after,
  label,
  beforeLabel = 'Before',
  afterLabel = 'After',
  aspect = '4 / 3',
  sizes = '(min-width: 1024px) 45vw, 100vw',
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inputId = useId();

  function positionFromPointer(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, Math.round(next))));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    positionFromPointer(event.clientX);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current) positionFromPointer(event.clientX);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="group/compare">
      <div
        ref={frameRef}
        className="relative cursor-ew-resize touch-pan-y overflow-hidden bg-sand-200 select-none"
        style={{ aspectRatio: aspect }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Picture image={before} fill sizes={sizes} className="pointer-events-none object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <Picture image={after} fill sizes={sizes} className="pointer-events-none object-cover" />
        </div>

        <span className="type-label pointer-events-none absolute top-3 left-3 bg-ivory-50 px-2 py-1 text-ink-900">{beforeLabel}</span>
        <span className="type-label pointer-events-none absolute top-3 right-3 bg-forest-800 px-2 py-1 text-ivory-50">{afterLabel}</span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-ivory-50" style={{ left: `${position}%` }} aria-hidden="true">
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-50 bg-forest-900 text-ivory-50 group-has-[input:focus-visible]/compare:outline-2 group-has-[input:focus-visible]/compare:outline-offset-2 group-has-[input:focus-visible]/compare:outline-gold-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M7.5 5 2.5 10l5 5M12.5 5l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>

      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${100 - position} percent ${afterLabel.toLowerCase()}, ${position} percent ${beforeLabel.toLowerCase()}`}
        className="sr-only"
      />
    </div>
  );
}
