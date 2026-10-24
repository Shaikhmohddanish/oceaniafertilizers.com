import type { Product } from '../types';

import { productImages } from './media';
import { rt } from './rich-text';
import { applicationMethods, productCategories } from './taxonomy';

/*
 * Published products use only verified client information:
 * - Halad Special: specification and description from the workbook (PDP sheet).
 * - WAVES: what is printed on the pack in the client's photograph.
 * The six products named only in the AI mockups are pending drafts with the
 * mockup one-liner. They never render in production.
 */

const UPDATED = '2026-10-24';

const haladSpecial: Product = {
  id: 'product-halad-special',
  status: 'published',
  slug: 'halad-special',
  name: 'Halad Special',
  purpose: 'Bio-stimulant for the root zone, applied by drenching or drip irrigation.',
  tagline: 'For vigorous growth, higher yield & better quality',
  category: productCategories.biostimulants,
  applicationMethods: [applicationMethods.drenching, applicationMethods.fertigation],
  image: productImages.haladSpecial,
  featured: true,
  order: 1,
  intro:
    "An advanced bio-stimulant, applied through drenching or drip irrigation so it reaches the crop's root zone directly.",
  description: rt.doc(
    rt.p(
      'Halad Special is an advanced bio-stimulant formulated to support crop growth, stronger root development, improved stress tolerance, and yield and quality.',
    ),
    rt.p(
      "Designed for application through drenching or drip irrigation, it helps deliver the product directly to the crop's root zone for effective uptake. Halad Special is suitable for farmers seeking a solution to strengthen plant performance throughout the crop cycle.",
    ),
    rt.p(
      'Its formulation supports healthier plant development and efficient nutrient utilization, helping crops maintain growth under challenging conditions. With a recommended dosage of 5 litres per acre, Halad Special is an easy-to-use addition to modern, scientific and sustainable farming practices.',
    ),
  ),
  packSizes: ['5 litre can'],
  dosage: [{ value: '5 litres per acre', method: 'Drenching or drip irrigation' }],
  applicationNotes: rt.doc(
    rt.p(
      'Apply through drenching or through the drip irrigation system, so the product is delivered to the root zone.',
    ),
  ),
  suitableCrops: [],
  features: [
    'Applied through drenching or drip irrigation',
    'Delivered directly to the root zone for effective uptake',
    'One recommended dosage: 5 litres per acre',
    'Supplied in a 5 litre can',
  ],
  benefits: [
    'Supports crop growth and healthier plant development',
    'Supports stronger root development',
    'Supports stress tolerance, helping crops maintain growth under challenging conditions',
    'Supports efficient nutrient utilization',
    'Supports yield and quality',
  ],
  images: [productImages.haladSpecial],
  relatedProductSlugs: ['waves-mycorrhizal-biofertilizer'],
  seo: {
    title: 'Halad Special bio-stimulant, 5 litre can',
    description:
      'Halad Special is a bio-stimulant applied by drenching or drip irrigation at 5 litres per acre. See packaging, application and how to enquire.',
  },
  updatedAt: UPDATED,
};

const waves: Product = {
  id: 'product-waves',
  status: 'published',
  slug: 'waves-mycorrhizal-biofertilizer',
  name: 'WAVES',
  purpose: 'Mycorrhizal biofertilizer, supplied in a 300 gm pouch.',
  tagline: 'Strong roots, higher yield',
  category: productCategories.mycorrhizalBiofertilizers,
  applicationMethods: [],
  image: productImages.waves,
  featured: true,
  order: 2,
  intro: 'A mycorrhizal biofertilizer, supplied in a 300 gm stand-up pouch.',
  description: rt.doc(
    rt.p(
      'WAVES is a mycorrhizal biofertilizer. It is supplied in a 300 gm stand-up pouch carrying the line "Strong roots, higher yield".',
    ),
    rt.p(
      'The right dose and method depend on your crop and how you irrigate. Ask our team for guidance on using WAVES on your farm.',
    ),
  ),
  packSizes: ['300 gm pouch'],
  dosage: [],
  suitableCrops: [],
  features: [],
  benefits: [],
  images: [productImages.waves],
  relatedProductSlugs: ['halad-special'],
  seo: {
    title: 'WAVES Mycorrhizal Biofertilizer, 300 gm',
    description:
      'WAVES is a mycorrhizal biofertilizer from Oceania Fertilizers, supplied in a 300 gm pouch. Ask our team about dosage and application for your crop.',
  },
  updatedAt: UPDATED,
};

type PendingSeed = {
  slug: string;
  name: string;
  purpose: string;
  category: Product['category'];
};

const pendingSeeds: PendingSeed[] = [
  {
    slug: 'bingorhiza',
    name: 'BINGOrhiza',
    purpose: 'Builds stronger roots and improves nutrient and water uptake.',
    category: productCategories.mycorrhizalBiofertilizers,
  },
  {
    slug: 'sanjivani-n',
    name: 'Sanjivani N',
    purpose: 'Beneficial microbes for improved soil and plant nutrition.',
    category: productCategories.biofertilizers,
  },
  {
    slug: 'jadugar',
    name: 'JADUGAR',
    purpose: 'Seaweed-based plant growth enhancer.',
    category: productCategories.biostimulants,
  },
  {
    slug: 'rustom',
    name: 'RUSTOM',
    purpose: 'Improves soil health and nutrient availability.',
    category: productCategories.humicAcid,
  },
  {
    slug: 'nutrisac',
    name: 'NUTRISAC',
    purpose: 'Essential nutrients for balanced crop growth.',
    category: productCategories.micronutrients,
  },
  {
    slug: 'micron',
    name: 'MICRON',
    purpose: 'Key minerals for healthier crops and better yield.',
    category: productCategories.soilNutrition,
  },
];

const pendingProducts: Product[] = pendingSeeds.map((seed, index) => ({
  id: `product-${seed.slug}`,
  status: 'pending',
  slug: seed.slug,
  name: seed.name,
  purpose: seed.purpose,
  category: seed.category,
  applicationMethods: [],
  featured: false,
  order: 10 + index,
  description: rt.doc(
    rt.p(
      'This product appears in the website mockups but has not yet been confirmed by Oceania. Its name and purpose come from the mockup and need approval, and specifications will be added once supplied.',
    ),
  ),
  packSizes: [],
  dosage: [],
  suitableCrops: [],
  features: [],
  benefits: [],
  images: [],
  relatedProductSlugs: [],
  updatedAt: UPDATED,
}));

export const products: Product[] = [haladSpecial, waves, ...pendingProducts];
