import type {
  AboutPage,
  Article,
  ArticleCategory,
  Crop,
  DemoPlot,
  Faq,
  GalleryCategory,
  GalleryItem,
  HomePage,
  LegalPage,
  PageIntro,
  PageIntroKey,
  PartnerProgramme,
  Product,
  ProductCategory,
  SiteSettings,
  Testimonial,
} from './types';

/** The contract every content source (local seed, Sanity) implements. */
export interface ContentSource {
  getSiteSettings(): Promise<SiteSettings>;
  getHomePage(): Promise<HomePage>;
  getAboutPage(): Promise<AboutPage>;
  getPartnerProgramme(): Promise<PartnerProgramme>;
  getProducts(): Promise<Product[]>;
  getProductCategories(): Promise<ProductCategory[]>;
  getCrops(): Promise<Crop[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getDemoPlots(): Promise<DemoPlot[]>;
  getGalleryItems(): Promise<GalleryItem[]>;
  getGalleryCategories(): Promise<GalleryCategory[]>;
  getArticles(): Promise<Article[]>;
  getArticleCategories(): Promise<ArticleCategory[]>;
  getLegalPage(slug: LegalPage['slug']): Promise<LegalPage | null>;
  getPageIntro(key: PageIntroKey): Promise<PageIntro>;
  getFaqs(): Promise<Faq[]>;
}
