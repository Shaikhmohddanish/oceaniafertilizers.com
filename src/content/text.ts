import type { RichText } from './types';

/** Plain text of a rich text value, for excerpts, reading time and metadata. */
export function toPlainText(value: RichText | undefined): string {
  if (!value) return '';
  return value
    .map((node) => {
      if (node._type === 'block') return node.children.map((child) => child.text).join('');
      if (node._type === 'callout') return [node.title, node.body].filter(Boolean).join(' ');
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

const WORDS_PER_MINUTE = 200;

export function readingMinutes(value: RichText | undefined): number {
  const words = toPlainText(value).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Trims text to a length on a word boundary, for meta descriptions. */
export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[,.;:\s]+$/, '')}...`;
}
