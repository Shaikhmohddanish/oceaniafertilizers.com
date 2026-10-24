'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SELECTOR = '[data-reveal]:not([data-revealed])';
const DEFERRED_SECTION = '.render-later';

/**
 * Reveals [data-reveal] elements as they come into view. Content is fully
 * visible without JavaScript; the hidden state only applies once this has run.
 *
 * Anything that has reached the reveal line is shown, including content a fast
 * scroll has already carried past, so nothing can be left hidden. Positions
 * are read in one batch per frame, then attributes are written.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Each element is stored with the deferred-rendering section it sits in, if any.
    const pending = new Map<Element, Element | null>();
    const track = (element: Element) => pending.set(element, element.closest(DEFERRED_SECTION));
    document.querySelectorAll(SELECTOR).forEach(track);
    let frame = 0;

    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.92;
      const due: Element[] = [];
      for (const [element, section] of pending) {
        // Content cannot have reached the line before its section has. Checking the section
        // first also avoids forcing layout inside sections the browser is still skipping.
        if (section && section.getBoundingClientRect().top >= line) continue;
        if (element.getBoundingClientRect().top < line) due.push(element);
      }
      for (const element of due) {
        element.setAttribute('data-revealed', '');
        pending.delete(element);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    // Reveal what is already on screen before the hidden state switches on, so nothing flickers.
    check();
    document.documentElement.classList.add('js-reveal');

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Content that streams in after this effect has run.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) track(node);
          node.querySelectorAll(SELECTOR).forEach(track);
        }
      }
      schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mutations.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
