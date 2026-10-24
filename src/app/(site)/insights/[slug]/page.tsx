import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RichText } from '@/components/content/RichText';
import { ArticleCard } from '@/components/insights/ArticleCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Figure } from '@/components/media/Picture';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { PendingTag } from '@/components/ui/PendingTag';
import { getArticle, getArticles, getProducts } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { articleJsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    path: `/insights/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    noindex: article.status === 'pending',
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [allArticles, products] = await Promise.all([getArticles(), getProducts()]);
  const related = article.relatedArticleSlugs
    .map((item) => allArticles.find((candidate) => candidate.slug === item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);
  const relatedProducts = article.relatedProductSlugs
    .map((item) => products.find((candidate) => candidate.slug === item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const category = article.categories[0];

  return (
    <>
      {article.status === 'published' ? <JsonLd data={articleJsonLd(article)} /> : null}
      <article>
        <header className="bg-ivory-50 pt-8 lg:pt-12">
          <div className="container-site">
            <Breadcrumbs
              items={[
                { label: 'Insights', href: '/insights' },
                { label: article.title, href: `/insights/${article.slug}` },
              ]}
            />
            <div className="mt-10 max-w-[56rem] lg:mt-14">
              <div className="flex flex-wrap items-center gap-3">
                {category ? <p className="type-label text-gold-700">{category.title}</p> : null}
                <PendingTag status={article.status} />
              </div>
              <h1 className="type-h1 mt-6 text-forest-900">{article.title}</h1>
              {article.standfirst ? <p className="type-lead mt-8 max-w-[44ch] text-ink-700">{article.standfirst}</p> : null}
              <p className="type-small mt-8 flex flex-wrap gap-x-4 gap-y-1 text-ink-500">
                <span>By {article.author.name}</span>
                <span>{article.publishedAt ? formatDate(article.publishedAt) : 'Draft, not yet published'}</span>
                <span>{article.readingMinutes} min read</span>
                {article.reviewedBy ? <span>Reviewed by {article.reviewedBy}</span> : null}
              </p>
            </div>
          </div>
          {article.cover ? (
            <div className="container-site mt-12 lg:mt-16">
              <Figure image={article.cover} aspectClassName="aspect-[3/2] lg:aspect-[21/9]" sizes="100vw" preload reveal={false} />
            </div>
          ) : null}
        </header>

        <div className="bg-ivory-50 pb-[var(--section-space)]">
          <div className="container-site grid-site gap-y-12 pt-14 lg:pt-20">
            <RichText value={article.body} className="type-body-lg col-span-12 max-w-[64ch] text-ink-700 lg:col-span-7 lg:col-start-3" />

            {article.sources.length > 0 ? (
              <aside aria-labelledby="sources-title" className="col-span-12 border-t border-[color:var(--line-strong)] pt-8 lg:col-span-7 lg:col-start-3">
                <h2 id="sources-title" className="type-label text-ink-500">
                  Sources
                </h2>
                <ol className="type-small mt-4 list-decimal space-y-2 pl-5 text-ink-700 marker:text-gold-700">
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} className="link-inline" rel="noopener noreferrer" target="_blank">
                        {source.title}
                      </a>
                      <span className="text-ink-500">, {source.publisher}</span>
                    </li>
                  ))}
                </ol>
              </aside>
            ) : null}
          </div>
        </div>
      </article>

      {relatedProducts.length > 0 ? (
        <section aria-labelledby="article-products-title" className="section-space bg-ivory-100">
          <div className="container-site">
            <h2 id="article-products-title" className="type-h2 text-forest-900">
              Related products
            </h2>
            <ul className="mt-12 grid gap-x-[var(--column-gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" revealIndex={index} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section aria-labelledby="further-reading-title" className="section-space bg-ivory-50">
          <div className="container-site">
            <h2 id="further-reading-title" className="type-h2 text-forest-900">
              Further reading
            </h2>
            <div className="mt-12 grid gap-x-[var(--column-gap)] gap-y-14 md:grid-cols-3">
              {related.map((item, index) => (
                <ArticleCard key={item.id} article={item} revealIndex={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
