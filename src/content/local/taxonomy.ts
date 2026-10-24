import type { ApplicationMethod, ArticleCategory, Crop, GalleryCategory, ProductCategory } from '../types';

export const productCategories = {
  biostimulants: {
    slug: 'biostimulants',
    title: 'Biostimulants',
    description: 'Inputs that work on the plant itself, supporting growth and the way it uses nutrients.',
  },
  mycorrhizalBiofertilizers: {
    slug: 'mycorrhizal-biofertilizers',
    title: 'Mycorrhizal biofertilizers',
    description: 'Biological inputs built on fungi that associate with plant roots.',
  },
  biofertilizers: {
    slug: 'biofertilizers',
    title: 'Biofertilizers',
    description: 'Inputs that carry beneficial micro-organisms to the soil or seed.',
  },
  humicAcid: {
    slug: 'humic-acid',
    title: 'Humic acid',
    description: 'Soil conditioners based on humic substances.',
  },
  micronutrients: {
    slug: 'micronutrients',
    title: 'Micronutrients',
    description: 'Nutrients crops need in small amounts, such as zinc, iron and boron.',
  },
  soilNutrition: {
    slug: 'soil-nutrition',
    title: 'Soil nutrition',
    description: 'Products applied to the soil to correct or maintain its nutrient balance.',
  },
} satisfies Record<string, ProductCategory>;

export const applicationMethods = {
  drenching: {
    slug: 'drenching',
    title: 'Drenching',
    description: 'Applied as a solution poured on the soil around the plant, so it reaches the root zone.',
  },
  fertigation: {
    slug: 'fertigation',
    title: 'Drip irrigation (fertigation)',
    description: 'Dissolved and delivered through the drip system with irrigation water.',
  },
  soilApplication: {
    slug: 'soil-application',
    title: 'Soil application',
    description: 'Mixed into or spread on the soil.',
  },
  foliar: {
    slug: 'foliar',
    title: 'Foliar spray',
    description: 'Sprayed on the leaves.',
  },
  seedTreatment: {
    slug: 'seed-treatment',
    title: 'Seed treatment',
    description: 'Coated on seed before sowing.',
  },
} satisfies Record<string, ApplicationMethod>;

/** Crops offered in forms and filters. A list of options, not a claim about any product. */
export const crops: Crop[] = [
  { slug: 'paddy', title: 'Paddy (rice)' },
  { slug: 'wheat', title: 'Wheat' },
  { slug: 'cotton', title: 'Cotton' },
  { slug: 'soybean', title: 'Soybean' },
  { slug: 'sugarcane', title: 'Sugarcane' },
  { slug: 'turmeric', title: 'Turmeric' },
  { slug: 'maize', title: 'Maize' },
  { slug: 'pulses', title: 'Pulses (tur, chana, moong, urad)' },
  { slug: 'groundnut', title: 'Groundnut' },
  { slug: 'millets', title: 'Millets (bajra, jowar, ragi)' },
  { slug: 'mustard', title: 'Mustard' },
  { slug: 'onion', title: 'Onion' },
  { slug: 'chilli', title: 'Chilli' },
  { slug: 'tomato', title: 'Tomato' },
  { slug: 'potato', title: 'Potato' },
  { slug: 'vegetables', title: 'Other vegetables' },
  { slug: 'banana', title: 'Banana' },
  { slug: 'grapes', title: 'Grapes' },
  { slug: 'pomegranate', title: 'Pomegranate' },
  { slug: 'fruits', title: 'Other fruit crops' },
  { slug: 'plantation', title: 'Plantation crops (tea, coffee, coconut, arecanut)' },
  { slug: 'other', title: 'Other' },
];

export const articleCategories = {
  soilHealth: { slug: 'soil-health', title: 'Soil health' },
  cropNutrition: { slug: 'crop-nutrition', title: 'Crop nutrition' },
  biologicalInputs: { slug: 'biological-inputs', title: 'Biological inputs' },
  waterManagement: { slug: 'water-management', title: 'Water management' },
  farmingPractices: { slug: 'farming-practices', title: 'Farming practices' },
  seasonalGuidance: { slug: 'seasonal-guidance', title: 'Seasonal guidance' },
} satisfies Record<string, ArticleCategory>;

export const galleryCategories = {
  fields: { slug: 'fields', title: 'Farms and fields' },
  applications: { slug: 'product-applications', title: 'Product applications' },
  demonstrations: { slug: 'field-demonstrations', title: 'Field demonstrations' },
  events: { slug: 'events', title: 'Events and farmer meetings' },
  products: { slug: 'product-photography', title: 'Product photography' },
} satisfies Record<string, GalleryCategory>;
