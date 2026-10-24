import type {
  ImageAsset,
  RichText,
  RichTextBlock,
  RichTextCallout,
  RichTextImage,
  RichTextMarkDef,
  RichTextNode,
  RichTextProductReference,
  RichTextSpan,
} from '../types';

// Deterministic keys: module evaluation order is stable, so a counter is enough.
let counter = 0;
const nextKey = (prefix: string) => `${prefix}${(counter++).toString(36)}`;

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

/** Parses **strong**, *em* and [label](href) into spans and mark definitions. */
function parseInline(text: string): { children: RichTextSpan[]; markDefs: RichTextMarkDef[] } {
  const children: RichTextSpan[] = [];
  const markDefs: RichTextMarkDef[] = [];
  for (const part of text.split(INLINE)) {
    if (!part) continue;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const markKey = nextKey('m');
      markDefs.push({ _key: markKey, _type: 'link', href: link[2] ?? '' });
      children.push({ _type: 'span', _key: nextKey('s'), text: link[1] ?? '', marks: [markKey] });
    } else if (part.startsWith('**') && part.endsWith('**')) {
      children.push({ _type: 'span', _key: nextKey('s'), text: part.slice(2, -2), marks: ['strong'] });
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      children.push({ _type: 'span', _key: nextKey('s'), text: part.slice(1, -1), marks: ['em'] });
    } else {
      children.push({ _type: 'span', _key: nextKey('s'), text: part, marks: [] });
    }
  }
  return { children, markDefs };
}

function block(text: string, extra: Partial<RichTextBlock> = {}): RichTextBlock {
  return { _type: 'block', _key: nextKey('b'), style: 'normal', ...parseInline(text), ...extra };
}

export const rt = {
  p: (text: string) => block(text),
  h2: (text: string) => block(text, { style: 'h2' }),
  h3: (text: string) => block(text, { style: 'h3' }),
  quote: (text: string) => block(text, { style: 'blockquote' }),
  bullets: (items: string[]) => items.map((item) => block(item, { listItem: 'bullet', level: 1 })),
  numbered: (items: string[]) => items.map((item) => block(item, { listItem: 'number', level: 1 })),
  callout: (tone: RichTextCallout['tone'], body: string, title?: string): RichTextCallout => ({
    _type: 'callout',
    _key: nextKey('c'),
    tone,
    title,
    body,
  }),
  figure: (image: ImageAsset): RichTextImage => ({ _type: 'figure', _key: nextKey('f'), image }),
  product: (slug: string, name: string, purpose: string): RichTextProductReference => ({
    _type: 'productReference',
    _key: nextKey('r'),
    slug,
    name,
    purpose,
  }),
  /** Flattens nodes and lists into one rich text value. */
  doc: (...nodes: (RichTextNode | RichTextNode[])[]): RichText => nodes.flat(),
};
