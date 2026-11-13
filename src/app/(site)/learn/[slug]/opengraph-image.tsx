import { getArticle, getArticles } from '@/content/repository';
import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers guide';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticleOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  return shareImage({
    label: article?.categories[0]?.title ?? 'Learn',
    title: article?.title ?? 'Learn farming together',
  });
}
