'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Filters a server-rendered list in place. Items carry data-filter-* attributes
 * and the bar toggles their `hidden` attribute, so the list stays static HTML
 * and only this small control ships JavaScript. The selection is mirrored in
 * the URL so a filtered view can be shared.
 */

export type FilterGroup = {
  /** Matches data-filter-{key} on each item. Values are separated by "|". */
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** Chips for a few options; a select when there are many. */
  display?: 'chips' | 'select';
};

type FilterBarProps = {
  groups: FilterGroup[];
  /** id of the element that contains the [data-filter-item] elements. */
  listId: string;
  itemLabel: { one: string; many: string };
  className?: string;
};

function readSelection(groups: FilterGroup[]): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const selection: Record<string, string> = {};
  for (const group of groups) {
    const value = params.get(group.key);
    if (value && group.options.some((option) => option.value === value)) selection[group.key] = value;
  }
  return selection;
}

export function FilterBar({ groups, listId, itemLabel, className = '' }: FilterBarProps) {
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [counts, setCounts] = useState<{ shown: number; total: number } | null>(null);
  const ready = useRef(false);

  const apply = useCallback(
    (next: Record<string, string>) => {
      const list = document.getElementById(listId);
      if (!list) return;
      const items = Array.from(list.querySelectorAll<HTMLElement>('[data-filter-item]'));
      let shown = 0;
      for (const item of items) {
        const visible = Object.entries(next).every(([key, value]) => {
          const values = (item.dataset[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`] ?? '').split('|');
          return values.includes(value);
        });
        item.hidden = !visible;
        if (visible) shown += 1;
      }
      setCounts({ shown, total: items.length });
    },
    [listId],
  );

  useEffect(() => {
    const initial = readSelection(groups);
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelection(initial);
    apply(initial);
    /* eslint-enable react-hooks/set-state-in-effect */
    ready.current = true;
  }, [groups, apply]);

  function update(key: string, value: string) {
    const next = { ...selection };
    if (!value || next[key] === value) delete next[key];
    else next[key] = value;
    setSelection(next);
    apply(next);
    const params = new URLSearchParams(window.location.search);
    for (const group of groups) {
      if (next[group.key]) params.set(group.key, next[group.key] as string);
      else params.delete(group.key);
    }
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  }

  function reset() {
    setSelection({});
    apply({});
    window.history.replaceState(null, '', window.location.pathname);
  }

  const active = Object.keys(selection).length > 0;

  return (
    <div className={`border-y border-[color:var(--line-strong)] py-5 ${className}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {groups.map((group) => {
            const id = `${listId}-filter-${group.key}`;
            if ((group.display ?? (group.options.length > 6 ? 'select' : 'chips')) === 'select') {
              return (
                <div key={group.key}>
                  <label htmlFor={id} className="type-label block text-ink-500">
                    {group.label}
                  </label>
                  <select
                    id={id}
                    value={selection[group.key] ?? ''}
                    onChange={(event) => update(group.key, event.target.value)}
                    className="mt-2 h-11 min-w-48 rounded-[2px] border border-[color:var(--line-strong)] bg-white/70 px-3 text-[0.9375rem]"
                  >
                    <option value="">All</option>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <div key={group.key} role="group" aria-labelledby={`${id}-label`}>
                <p id={`${id}-label`} className="type-label text-ink-500">
                  {group.label}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={!selection[group.key]}
                    onClick={() => update(group.key, '')}
                    className="min-h-10 rounded-[2px] border border-[color:var(--line-strong)] px-3.5 text-[0.875rem] font-medium transition-colors hover:border-ink-700 aria-pressed:border-forest-800 aria-pressed:bg-forest-800 aria-pressed:text-ivory-50"
                  >
                    All
                  </button>
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selection[group.key] === option.value}
                      onClick={() => update(group.key, option.value)}
                      className="min-h-10 rounded-[2px] border border-[color:var(--line-strong)] px-3.5 text-[0.875rem] font-medium transition-colors hover:border-ink-700 aria-pressed:border-forest-800 aria-pressed:bg-forest-800 aria-pressed:text-ivory-50"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-5">
          <p aria-live="polite" className="type-small text-ink-500">
            {counts
              ? `Showing ${counts.shown} of ${counts.total} ${counts.total === 1 ? itemLabel.one : itemLabel.many}`
              : null}
          </p>
          {active ? (
            <button type="button" onClick={reset} className="link-draw type-small font-medium text-forest-800">
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
