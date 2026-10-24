import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import { Picture } from '@/components/media/Picture';
import { PendingTag } from '@/components/ui/PendingTag';
import type { ProductSummary } from '@/content/types';

type ProductCardProps = {
  product: ProductSummary;
  sizes: string;
  aspect?: string;
  headingLevel?: 'h2' | 'h3';
  revealIndex?: number;
};

/**
 * A pack shot on its own ground, then the record: category, name, purpose.
 * Renders with a supplied backdrop sit on that colour (object-contain); real
 * photographs fill the frame. Products without imagery get a typographic plate.
 */
export function ProductCard({ product, sizes, aspect = '4 / 5', headingLevel: Heading = 'h3', revealIndex = 0 }: ProductCardProps) {
  const { image } = product;
  const isRender = Boolean(image?.backdrop);

  return (
    <article
      className="group relative"
      data-reveal="rise"
      style={{ ['--reveal-index' as string]: revealIndex }}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: aspect, backgroundColor: image?.backdrop ?? 'var(--color-sand-200)' }}
      >
        {image ? (
          <Picture
            image={image}
            fill
            sizes={sizes}
            className={`transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] ${
              isRender ? 'object-contain p-[9%]' : 'object-cover'
            }`}
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-end p-6">
            <span className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none text-forest-900/30">{product.name}</span>
          </div>
        )}
        {product.status === 'pending' ? <PendingTag status="pending" className="absolute top-4 left-4" /> : null}
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 border-t border-[color:var(--line)] pt-5">
        <div>
          <p className="type-label text-gold-700">{product.category.title}</p>
          <Heading className="type-h3 mt-3 text-forest-900">
            <Link
              href={`/products/${product.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </Heading>
          <p className="mt-3 max-w-[42ch] text-ink-700">{product.purpose}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--line-strong)] text-forest-800 transition-colors duration-300 group-hover:border-forest-800 group-hover:bg-forest-800 group-hover:text-ivory-50"
        >
          <ArrowRightIcon />
        </span>
      </div>
      {/* Keyboard focus ring for the whole card, drawn from the link inside. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 hidden outline-2 outline-offset-0 outline-gold-700 group-has-[a:focus-visible]:block"
      />
    </article>
  );
}
