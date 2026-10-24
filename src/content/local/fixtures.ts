import type { DemoPlot, GalleryItem, Testimonial } from '../types';

import { photo } from './media';
import { galleryCategories } from './taxonomy';

/*
 * TEST FIXTURES ONLY. Loaded when E2E_FIXTURES=1 outside Vercel, so automated
 * tests can exercise the video dialog, the comparison slider and the lightbox.
 * Every label says "Test fixture" so these can never pass for real content.
 */

export const fixtureTestimonials: Testimonial[] = [
  {
    id: 'fixture-testimonial-1',
    status: 'published',
    farmerName: 'Test fixture farmer',
    district: 'Test district',
    state: 'Test state',
    crop: { slug: 'turmeric', title: 'Turmeric' },
    products: [{ slug: 'halad-special', name: 'Halad Special' }],
    video: { provider: 'youtube', id: 'aqz-KE-bpKQ', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', durationSeconds: 38 },
    poster: photo('turmeric-chamarajanagar', { alt: 'Test fixture poster image.' }),
    quote: 'Test fixture quote used by automated checks.',
    summary: 'Test fixture summary.',
    featured: true,
    order: 1,
  },
];

export const fixtureDemoPlots: DemoPlot[] = [
  {
    id: 'fixture-plot-1',
    status: 'published',
    title: 'Test fixture plot',
    crop: { slug: 'turmeric', title: 'Turmeric' },
    products: [{ slug: 'halad-special', name: 'Halad Special' }],
    state: 'Test state',
    district: 'Test district',
    season: 'kharif',
    year: 2026,
    treatment: 'Test fixture treatment.',
    comparison: 'Test fixture comparison plot.',
    observations: ['Test fixture observation.'],
    before: photo('turmeric-black-soil', { alt: 'Test fixture before image.' }),
    after: photo('turmeric-chamarajanagar', { alt: 'Test fixture after image.' }),
    farmerName: 'Test fixture farmer',
    order: 1,
  },
];

export const fixtureGallery: GalleryItem[] = [
  {
    id: 'fixture-gallery-1',
    status: 'published',
    image: photo('cotton-raichur', { alt: 'Test fixture gallery image one.' }),
    title: 'Test fixture image one',
    category: galleryCategories.fields,
    order: 1,
  },
  {
    id: 'fixture-gallery-2',
    status: 'published',
    image: photo('wheat-punjab', { alt: 'Test fixture gallery image two.' }),
    title: 'Test fixture image two',
    category: galleryCategories.fields,
    order: 2,
  },
];
