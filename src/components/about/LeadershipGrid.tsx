'use client';

import { useRef, useState } from 'react';

import { CloseIcon, PlusIcon } from '@/components/brand/icons';
import { RichText } from '@/components/content/RichText';
import { Picture } from '@/components/media/Picture';
import type { LeadershipMember } from '@/content/types';

/**
 * Team portraits with a "+" that opens each person's bio in a side panel, as
 * in the workbook's reference. The panel is a native modal dialog.
 */
export function LeadershipGrid({ members }: { members: LeadershipMember[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const member = active === null ? null : members[active];

  function open(index: number) {
    setActive(index);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <ul className="grid gap-x-[var(--column-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((person, index) => (
          <li key={person.name}>
            <div className="relative aspect-[4/5] overflow-hidden bg-sand-200">
              {person.photo ? (
                <Picture image={person.photo} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
              ) : null}
              <button
                ref={(element) => {
                  triggerRefs.current[index] = element;
                }}
                type="button"
                onClick={() => open(index)}
                aria-label={`Read about ${person.name}`}
                aria-haspopup="dialog"
                className="absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-ivory-50 text-forest-900 transition-colors hover:bg-white"
              >
                <PlusIcon />
              </button>
            </div>
            <p className="type-h3 mt-5 text-forest-900">{person.name}</p>
            <p className="mt-1 text-ink-700">{person.role}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={member ? `About ${member.name}` : 'About'}
        data-animate=""
        data-lock-scroll=""
        onClose={() => {
          if (active !== null) triggerRefs.current[active]?.focus();
          setActive(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="ml-auto h-dvh max-h-none w-[min(40rem,100vw)] max-w-none bg-ivory-50 p-0 text-ink-900"
      >
        {member ? (
          <div className="flex min-h-full flex-col px-8 py-8 sm:px-12">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="ml-auto inline-flex min-h-11 items-center gap-2 font-medium"
            >
              Close
              <CloseIcon />
            </button>
            <p className="type-h1 mt-8 text-forest-900">{member.name}</p>
            <p className="type-lead mt-3 text-ink-700">{member.role}</p>
            <RichText value={member.bio} className="mt-10 text-ink-700" />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
