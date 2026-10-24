import type { Metadata } from 'next';

import { FilterBar } from '@/components/content/FilterBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCard } from '@/components/products/ProductCard';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { getActiveProductCategories, getPageIntro, getProducts } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('products');
  return pageMetadata({ ...intro.seo, path: '/products' });
}

export default async function ProductsPage() {
  const [intro, products, categories] = await Promise.all([
    getPageIntro('products'),
    getProducts(),
    getActiveProductCategories(),
  ]);

  return (
    <>
      <PageHeader
        variant="banner"
        title={intro.title}
        standfirst={intro.standfirst}
        crumbs={[{ label: 'Products', href: '/products' }]}
        image={intro.image}
      />

      <section aria-labelledby="range-title" className="section-space bg-ivory-50">
        <div className="container-site">
          <h2 id="range-title" className="sr-only">
            All products
          </h2>
          {categories.length > 1 ? (
            <FilterBar
              listId="product-list"
              itemLabel={{ one: 'product', many: 'products' }}
              groups={[
                {
                  key: 'category',
                  label: 'Category',
                  options: categories.map((category) => ({ value: category.slug, label: category.title })),
                },
              ]}
              className="mb-14"
            />
          ) : null}

          <ul id="product-list" className="grid gap-x-[var(--column-gap)] gap-y-16 sm:grid-cols-2">
            {products.map((product, index) => (
              <li key={product.id} data-filter-item="" data-filter-category={product.category.slug}>
                <ProductCard
                  product={product}
                  headingLevel="h3"
                  sizes="(min-width: 640px) 45vw, 100vw"
                  revealIndex={index % 2}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="categories-title" className="section-space bg-ivory-100">
        <div className="container-site grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="categories-title" className="type-h2 max-w-[14ch] text-forest-900">
              What each category does
            </h2>
          </div>
          <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="grid gap-2 border-t border-[color:var(--line-strong)] py-6 last:border-b sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8"
              >
                <dt className="type-h4 text-forest-900">{category.title}</dt>
                <dd className="text-ink-700">{category.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="products-next-title" className="section-space bg-paper">
        <div className="container-site grid-site items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <h2 id="products-next-title" className="type-h2 max-w-[18ch] text-forest-900">
              Not sure which input fits your crop?
            </h2>
            <p className="type-body-lg mt-6 max-w-[48ch] text-ink-700">
              Tell us about your crop, your soil and how you irrigate. Our team will help you choose, and explain the dose
              and method before you buy.
            </p>
          </div>
          <div className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <ButtonLink href="/contact?topic=product">Ask our team</ButtonLink>
            <TextLink href="/become-a-partner" className="text-forest-800">
              Sell Oceania products
            </TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
