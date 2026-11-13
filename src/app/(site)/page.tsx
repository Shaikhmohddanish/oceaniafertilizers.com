import type { Metadata } from 'next';

import { ContactFallback } from '@/components/forms/ContactFallback';
import { FarmCallbackForm } from '@/components/forms/FarmCallbackForm';
import { ContactInvite } from '@/components/sections/home/ContactInvite';
import { FeaturedProducts } from '@/components/sections/home/FeaturedProducts';
import { HelpPaths } from '@/components/sections/home/HelpPaths';
import { HomeHero } from '@/components/sections/home/HomeHero';
import { LearnSection } from '@/components/sections/home/LearnSection';
import { MeetTeam } from '@/components/sections/home/MeetTeam';
import { OceaniaFarmer } from '@/components/sections/home/OceaniaFarmer';
import { ResultsTeaser } from '@/components/sections/home/ResultsTeaser';
import { StoriesTeaser } from '@/components/sections/home/StoriesTeaser';
import {
  getAboutPage,
  getArticles,
  getCrops,
  getDemoPlots,
  getFarmingVideos,
  getFeaturedProducts,
  getHomePage,
  getSiteSettings,
  getTestimonials,
} from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';
import { helpPaths } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return pageMetadata({
    title: home.seo?.title ?? 'Oceania Fertilizers',
    description: home.seo?.description ?? home.hero.standfirst,
    path: '/',
    absoluteTitle: true,
  });
}

/*
 * The five moments from the brand and mobile proposal: arrive, meet, choose,
 * inspect, connect, with "Learn farming together" at the centre (the client's
 * change). Sections without real content are left out.
 */
export default async function HomePage() {
  const [home, settings, about, articles, crops, stories, plots, videos] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getAboutPage(),
    getArticles(),
    getCrops(),
    getTestimonials(),
    getDemoPlots(),
    getFarmingVideos(),
  ]);
  const featured = await getFeaturedProducts(home.products.featuredSlugs);
  const featuredVideos = [...videos].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      <HomeHero hero={home.hero} contact={settings.contact} />
      {stories.length > 0 ? <StoriesTeaser section={home.stories} stories={stories} /> : <MeetTeam members={about.leadership} />}
      <HelpPaths paths={helpPaths({ hasVideos: videos.length > 0 })} />
      <LearnSection learn={home.learn} practices={home.practices} videos={featuredVideos} articles={articles} />
      <FeaturedProducts section={home.products} products={featured} />
      <ResultsTeaser section={home.results} plots={plots} />
      <OceaniaFarmer farmer={home.farmer} />
      <ContactInvite
        section={home.contact}
        contact={settings.contact}
        languages={settings.adviceLanguages}
        form={<FarmCallbackForm crops={crops} fallback={<ContactFallback contact={settings.contact} />} />}
      />
    </>
  );
}
