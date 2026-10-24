import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { WhatsAppIcon } from '@/components/brand/icons';
import { RichText } from '@/components/content/RichText';
import { ContactFallback } from '@/components/forms/ContactFallback';
import { ProductEnquiryForm } from '@/components/forms/ProductEnquiryForm';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Picture } from '@/components/media/Picture';
import { ProductCard } from '@/components/products/ProductCard';
import { SpecRecord } from '@/components/products/SpecRecord';
import { FieldRecordCard } from '@/components/proof/FieldRecordCard';
import { VideoStory } from '@/components/proof/VideoStory';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { PendingTag } from '@/components/ui/PendingTag';
import {
  getCrops,
  getDemoPlotsForProduct,
  getProduct,
  getProducts,
  getRelatedProducts,
  getSiteSettings,
  getTestimonialsForProduct,
} from '@/content/repository';
import { toPlainText, truncate } from '@/content/text';
import { whatsappHref } from '@/lib/contact';
import { productJsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seo?.title ?? `${product.name}, ${product.category.title.toLowerCase()}`,
    description: product.seo?.description ?? truncate(product.intro ?? toPlainText(product.description)),
    path: `/products/${product.slug}`,
    noindex: product.status === 'pending',
  });
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid-site gap-y-8 border-t border-[color:var(--line-strong)] pt-12 lg:pt-16">
      <div className="col-span-12 lg:col-span-4">
        <h2 id={id} className="type-h3 max-w-[18ch] text-forest-900">
          {title}
        </h2>
      </div>
      <div className="col-span-12 lg:col-span-7 lg:col-start-6">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-ink-900">
          <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 bg-gold-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [settings, crops, related, plots, stories] = await Promise.all([
    getSiteSettings(),
    getCrops(),
    getRelatedProducts(product),
    getDemoPlotsForProduct(product.slug),
    getTestimonialsForProduct(product.slug),
  ]);

  const image = product.images[0];
  const isRender = Boolean(image?.backdrop);
  const whatsapp = settings.contact.whatsapp;

  return (
    <>
      <JsonLd data={productJsonLd(product)} />

      <div className="bg-ivory-50 pt-8 lg:pt-12">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
          />

          <div className="grid-site mt-10 gap-y-12 pb-[var(--section-space)] lg:mt-14">
            <div className="col-span-12 lg:col-span-6">
              <div
                className="relative aspect-[4/5] overflow-hidden"
                style={{ backgroundColor: image?.backdrop ?? 'var(--color-sand-200)' }}
              >
                {image ? (
                  <Picture
                    image={image}
                    fill
                    preload
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className={isRender ? 'object-contain p-[7%]' : 'object-cover'}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end p-8" aria-hidden="true">
                    <span className="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-ink-900/15">{product.name}</span>
                  </div>
                )}
              </div>
              {image?.caption ? <p className="type-caption mt-3 text-ink-500">{image.caption}</p> : null}
            </div>

            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <div className="flex flex-wrap items-center gap-3">
                <p className="type-label text-gold-700">{product.category.title}</p>
                <PendingTag status={product.status} />
              </div>
              <h1 className="type-h1 mt-5 text-forest-900">{product.name}</h1>
              {product.intro ? <p className="type-lead mt-6 text-ink-700">{product.intro}</p> : null}
              {product.tagline ? (
                <p className="type-small mt-5 text-ink-500">
                  On the pack: <span className="text-ink-900">&quot;{product.tagline}&quot;</span>
                </p>
              ) : null}

              <div className="mt-10">
                <SpecRecord product={product} />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="#enquire">Enquire about {product.name}</ButtonLink>
                {whatsapp ? (
                  <a
                    href={whatsappHref(whatsapp, `Hello Oceania, I would like to know more about ${product.name}.`)}
                    className="inline-flex min-h-12 items-center gap-2 font-medium text-forest-800"
                  >
                    <WhatsAppIcon className="text-gold-700" />
                    <span className="link-draw">Ask on WhatsApp</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-paper pb-[var(--section-space)]">
        <div className="container-site space-y-16 pt-[var(--section-space)] lg:space-y-20">
          <Section id="about-product" title={`About ${product.name}`}>
            <RichText value={product.description} className="type-body-lg max-w-[62ch] text-ink-700" />
          </Section>

          {product.features.length > 0 || product.benefits.length > 0 ? (
            <Section id="features" title="Features and benefits">
              <div className="grid gap-10 sm:grid-cols-2">
                {product.features.length > 0 ? (
                  <div>
                    <h3 className="type-label text-ink-500">Key features</h3>
                    <div className="mt-4">
                      <List items={product.features} />
                    </div>
                  </div>
                ) : null}
                {product.benefits.length > 0 ? (
                  <div>
                    <h3 className="type-label text-ink-500">Benefits, as described by Oceania</h3>
                    <div className="mt-4">
                      <List items={product.benefits} />
                    </div>
                  </div>
                ) : null}
              </div>
            </Section>
          ) : null}

          {product.applicationMethods.length > 0 || product.dosage.length > 0 || product.applicationNotes ? (
            <Section id="how-to-use" title="How to use it">
              {product.dosage.length > 0 ? (
                <ul className="space-y-4">
                  {product.dosage.map((row) => (
                    <li key={`${row.value}-${row.method ?? ''}`} className="border-l-2 border-gold-500 pl-5">
                      <p className="type-h3 type-numeral text-forest-900">{row.value}</p>
                      {row.method ? <p className="mt-1 text-ink-700">{row.method}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {product.applicationMethods.length > 0 ? (
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {product.applicationMethods.map((method) => (
                    <div key={method.slug} className="border-t border-[color:var(--line)] pt-4">
                      <dt className="font-semibold text-ink-900">{method.title}</dt>
                      {method.description ? <dd className="type-small mt-2 text-ink-700">{method.description}</dd> : null}
                    </div>
                  ))}
                </dl>
              ) : null}
              <RichText value={product.applicationNotes} className="mt-8 max-w-[62ch] text-ink-700" />
              <p className="type-caption mt-8 max-w-[56ch] text-ink-500">
                Always read the product label before use and follow its instructions.
              </p>
            </Section>
          ) : null}

          {product.usageGuidance ? (
            <Section id="guidance" title="Practical guidance">
              <RichText value={product.usageGuidance} className="max-w-[62ch] text-ink-700" />
            </Section>
          ) : null}

          {product.safety ? (
            <Section id="safety" title="Safety, handling and storage">
              <RichText value={product.safety} className="max-w-[62ch] text-ink-700" />
            </Section>
          ) : null}

          {plots.length > 0 ? (
            <Section id="field-evidence" title="Demo plots with this product">
              <div className="grid gap-12 sm:grid-cols-2">
                {plots.map((plot) => (
                  <FieldRecordCard key={plot.id} plot={plot} />
                ))}
              </div>
            </Section>
          ) : null}

          {stories.length > 0 ? (
            <Section id="farmer-stories" title="Farmer stories">
              <div className="grid gap-12 sm:grid-cols-2">
                {stories.map((story) => (
                  <VideoStory key={story.id} story={story} />
                ))}
              </div>
            </Section>
          ) : null}

          <section
            id="enquire"
            aria-labelledby="enquire-title"
            className="grid-site scroll-mt-28 gap-y-10 border-t border-[color:var(--line-strong)] pt-12 lg:pt-16"
          >
            <div className="col-span-12 lg:col-span-4">
              <h2 id="enquire-title" className="type-h2 max-w-[14ch] text-forest-900">
                Ask about {product.name}
              </h2>
              <p className="mt-5 max-w-[36ch] text-ink-700">
                Tell us where you farm and what you grow. Our team will call you with guidance for your crop.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ProductEnquiryForm
                product={{ slug: product.slug, name: product.name }}
                crops={crops}
                fallback={<ContactFallback contact={settings.contact} />}
              />
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="section-space bg-ivory-100">
          <div className="container-site">
            <h2 id="related-title" className="type-h2 text-forest-900">
              Explore more products
            </h2>
            <ul className="mt-12 grid gap-x-[var(--column-gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <li key={item.id}>
                  <ProductCard product={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" revealIndex={index} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
