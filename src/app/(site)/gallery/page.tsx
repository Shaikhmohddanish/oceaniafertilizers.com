import type { Metadata } from 'next';

import { EmptyState } from '@/components/content/EmptyState';
import { FilterBar } from '@/components/content/FilterBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { GalleryGrid } from '@/components/media/GalleryGrid';
import { getActiveGalleryCategories, getGalleryItems, getPageIntro } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('gallery');
  return pageMetadata({ ...intro.seo, path: '/gallery' });
}

export default async function GalleryPage() {
  const [intro, items, categories] = await Promise.all([getPageIntro('gallery'), getGalleryItems(), getActiveGalleryCategories()]);

  return (
    <>
      <PageHeader
        title={intro.title}
        standfirst={intro.standfirst}
        crumbs={[{ label: 'Gallery', href: '/gallery' }]}
      />
      <section aria-label="Photographs" className="bg-ivory-50 pb-[var(--section-space)]">
        <div className="container-site">
          {items.length > 0 ? (
            <>
              {categories.length > 1 ? (
                <FilterBar
                  listId="gallery-list"
                  itemLabel={{ one: 'photo', many: 'photos' }}
                  groups={[
                    {
                      key: 'category',
                      label: 'Category',
                      options: categories.map((category) => ({ value: category.slug, label: category.title })),
                    },
                  ]}
                  className="mb-10"
                />
              ) : null}
              <GalleryGrid items={items} listId="gallery-list" />
            </>
          ) : (
            <EmptyState
              title="Photographs from the field will appear here."
              body="This gallery is for Oceania's own photographs: field visits, demonstrations, farmer meetings and our products. Each one is published with its place and date."
              action={{ label: 'See the products', href: '/products' }}
            />
          )}
        </div>
      </section>
    </>
  );
}
