import 'server-only';

import { testFixturesEnabled } from '@/lib/env';

import type { ContentSource } from '../source';

import { aboutPage } from './about';
import { articles } from './articles';
import { demoPlots, galleryItems, testimonials } from './collections';
import { faqs } from './faqs';
import { fixtureDemoPlots, fixtureGallery, fixtureTestimonials } from './fixtures';
import { homePage } from './home';
import { pageIntros } from './intros';
import { legalPages } from './legal';
import { partnerProgramme } from './partner';
import { products } from './products';
import { siteSettings } from './settings';
import { articleCategories, crops, galleryCategories, productCategories } from './taxonomy';

/** Content bundled with the code, used until Sanity credentials are configured. */
export const localSource: ContentSource = {
  getSiteSettings: async () => siteSettings,
  getHomePage: async () => homePage,
  getAboutPage: async () => aboutPage,
  getPartnerProgramme: async () => partnerProgramme,
  getProducts: async () => products,
  getProductCategories: async () => Object.values(productCategories),
  getCrops: async () => crops,
  getTestimonials: async () => (testFixturesEnabled() ? [...testimonials, ...fixtureTestimonials] : testimonials),
  getDemoPlots: async () => (testFixturesEnabled() ? [...demoPlots, ...fixtureDemoPlots] : demoPlots),
  getGalleryItems: async () => (testFixturesEnabled() ? [...galleryItems, ...fixtureGallery] : galleryItems),
  getGalleryCategories: async () => Object.values(galleryCategories),
  getArticles: async () => articles,
  getArticleCategories: async () => Object.values(articleCategories),
  getLegalPage: async (slug) => legalPages.find((page) => page.slug === slug) ?? null,
  getFaqs: async () => faqs,
  getPageIntro: async (key) => pageIntros[key],
};
