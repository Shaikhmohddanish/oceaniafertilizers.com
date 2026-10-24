import { getProduct, getProducts } from '@/content/repository';
import { OG_SIZE, shareImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers product';

/* Local pack shots used on share images (Sanity images fall back to text only). */
const localPackShots: Record<string, { file: string; backdrop?: string }> = {
  'halad-special': { file: 'halad-special-5l.png', backdrop: '#FFFCEB' },
  'waves-mycorrhizal-biofertilizer': { file: 'waves-300g.jpg' },
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const packShot = localPackShots[slug];
  const remote = typeof product?.image?.src === 'string' ? `${product.image.src}?w=840&fm=png` : undefined;
  return shareImage({
    label: product?.category.title ?? 'Products',
    title: product?.name ?? 'Oceania Fertilizers',
    productImage: packShot?.file,
    imageUrl: packShot ? undefined : remote,
    imageBackdrop: packShot?.backdrop ?? product?.image?.backdrop,
  });
}
