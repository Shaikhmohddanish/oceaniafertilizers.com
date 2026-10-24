import { ProductCard } from '@/components/products/ProductCard';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage, Product } from '@/content/types';

/** Up to four featured products. Two published products read as a diptych. */
export function FeaturedProducts({ section, products }: { section: HomePage['products']; products: Product[] }) {
  if (products.length === 0) return null;
  const columns = products.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2';
  const sizes = products.length >= 3 ? '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw' : '(min-width: 640px) 45vw, 100vw';

  return (
    <section aria-labelledby="featured-products-title" className="section-space render-later bg-ivory-100">
      <div className="container-site">
        <div className="grid-site items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7" data-reveal="rise">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 id="featured-products-title" className="type-h1 mt-6 text-forest-900">
              <Lines text={section.headline} />
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9" data-reveal="rise">
            <p className="text-ink-700">{section.intro}</p>
            <TextLink href="/products" className="mt-5 text-forest-800">
              View all products
            </TextLink>
          </div>
        </div>

        <div className={`mt-14 grid gap-x-[var(--column-gap)] gap-y-14 lg:mt-20 ${columns}`}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} sizes={sizes} revealIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
