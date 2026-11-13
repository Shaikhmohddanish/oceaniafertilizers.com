import Link from 'next/link';

import { ArrowRightIcon } from '@/components/brand/icons';
import { Picture } from '@/components/media/Picture';
import { buttonClass } from '@/components/ui/Button';
import { PendingTag } from '@/components/ui/PendingTag';
import type { Product, ProductSummary } from '@/content/types';
import { canOrder } from '@/lib/ordering';

type ProductCardProps = {
  product: ProductSummary & Pick<Product, 'packSizes'>;
  sizes: string;
  aspect?: string;
  headingLevel?: 'h2' | 'h3';
  revealIndex?: number;
  /** Adds an "Order" link to the order request on the product page. */
  showOrder?: boolean;
};

/**
 * A pack shot on its own ground, then the record: category, name, purpose.
 * Renders with a supplied backdrop sit on that colour (object-contain); real
 * photographs fill the frame. Products without imagery get a typographic plate.
 */
export function ProductCard({ product, sizes, aspect = '4 / 5', headingLevel: Heading = 'h3', revealIndex = 0, showOrder = false }: ProductCardProps) {
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
            <span className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none text-pine-700/30">{product.name}</span>
          </div>
        )}
        {product.status === 'pending' ? <PendingTag status="pending" className="absolute top-4 left-4" /> : null}
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 border-t border-[color:var(--line)] pt-5">
        <div>
          <p className="type-label text-clay-700">{product.category.title}</p>
          <Heading className="type-h3 mt-3 text-pine-700">
            <Link
              href={`/products/${product.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </Heading>
          <p className="mt-3 max-w-[42ch] text-ink-700">{product.purpose}</p>
          {showOrder && canOrder(product) ? (
            <Link
              href={`/products/${product.slug}#order`}
              className={`${buttonClass('primary', 'sm')} relative z-10 mt-5`}
              aria-label={`Order ${product.name}`}
            >
              Order
            </Link>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--line-strong)] text-pine-700 transition-colors duration-300 group-hover:border-pine-700 group-hover:bg-pine-700 group-hover:text-paper"
        >
          <ArrowRightIcon />
        </span>
      </div>
      {/* Keyboard focus ring for the whole card, drawn from the link inside. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 hidden outline-2 outline-offset-0 outline-clay-700 group-has-[a:focus-visible]:block"
      />
    </article>
  );
}
