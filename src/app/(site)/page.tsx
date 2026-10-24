import type { Metadata } from 'next';

import { ContactFallback } from '@/components/forms/ContactFallback';
import { FarmCallbackForm } from '@/components/forms/FarmCallbackForm';
import { Chapters } from '@/components/sections/home/Chapters';
import { ContactInvite } from '@/components/sections/home/ContactInvite';
import { FeaturedProducts } from '@/components/sections/home/FeaturedProducts';
import { HomeHero } from '@/components/sections/home/HomeHero';
import { OceaniaFarmer } from '@/components/sections/home/OceaniaFarmer';
import { PartnerBand } from '@/components/sections/home/PartnerBand';
import { Pillars } from '@/components/sections/home/Pillars';
import { Practices } from '@/components/sections/home/Practices';
import { ResultsTeaser } from '@/components/sections/home/ResultsTeaser';
import { StoriesTeaser } from '@/components/sections/home/StoriesTeaser';
import {
  getArticles,
  getCrops,
  getDemoPlots,
  getFeaturedProducts,
  getHomePage,
  getSiteSettings,
  getTestimonials,
} from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return pageMetadata({
    title: home.seo?.title ?? 'Oceania Fertilizers',
    description: home.seo?.description ?? home.hero.standfirst,
    path: '/',
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [home, settings, articles, crops, stories, plots] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getArticles(),
    getCrops(),
    getTestimonials(),
    getDemoPlots(),
  ]);
  const featured = await getFeaturedProducts(home.products.featuredSlugs);

  return (
    <>
      <HomeHero hero={home.hero} />
      <Pillars items={home.pillars} />
      <Chapters chapters={home.chapters} />
      <FeaturedProducts section={home.products} products={featured} />
      <OceaniaFarmer farmer={home.farmer} />
      <StoriesTeaser section={home.stories} stories={stories} />
      <ResultsTeaser section={home.results} plots={plots} />
      <Practices section={home.practices} articles={articles} />
      <PartnerBand partner={home.partner} />
      <ContactInvite
        section={home.contact}
        contact={settings.contact}
        form={<FarmCallbackForm crops={crops} fallback={<ContactFallback contact={settings.contact} />} />}
      />
    </>
  );
}
