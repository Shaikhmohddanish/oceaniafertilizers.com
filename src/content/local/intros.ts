import type { PageIntro, PageIntroKey } from '../types';

import { photo } from './media';

/* Openings for the listing pages. Copy written for client approval. */
export const pageIntros: Record<PageIntroKey, PageIntro> = {
  products: {
    key: 'products',
    title: 'The Oceania\nrange.',
    standfirst:
      'Agricultural inputs for Indian farms. Each one has a stated purpose, a pack size and a clear way to use it. If you are not sure which fits your crop, our team can help.',
    image: photo('turmeric-chamarajanagar', { focal: { x: 0.5, y: 0.6 } }),
    seo: {
      title: 'Products: biostimulants and biofertilizers',
      description:
        'The Oceania Fertilizers range of agricultural inputs for Indian farms, including Halad Special bio-stimulant and WAVES mycorrhizal biofertilizer.',
    },
  },
  demoPlots: {
    key: 'demoPlots',
    title: 'Demo plots,\ndocumented.',
    standfirst:
      'Each record shows a real plot: the crop, the products used, what they were compared with, and what was observed. Published only with the farmer\'s permission.',
    image: photo('cotton-raichur', { focal: { x: 0.5, y: 0.5 } }),
    seo: {
      title: 'Demo plots and field results',
      description:
        'Documented demo plots from farms using Oceania Fertilizers inputs: crop, treatment, comparison plot, season and observed results.',
    },
  },
  farmerStories: {
    key: 'farmerStories',
    title: 'In their\nown words.',
    standfirst:
      'Farmers who have used Oceania inputs, talking about their crops, their decisions and what they saw in the field.',
    image: photo('sunderbans-paddy', { focal: { x: 0.5, y: 0.55 } }),
    seo: {
      title: 'Farmer stories',
      description:
        'Video stories from farmers who use Oceania Fertilizers inputs, recorded and published with their permission.',
    },
  },
  gallery: {
    key: 'gallery',
    title: 'From the\nfield.',
    standfirst: 'Photographs from farms, demonstrations and farmer meetings, with the place and date for each.',
    seo: {
      title: 'Gallery',
      description: 'Photographs from Oceania Fertilizers field visits, demonstrations, farmer meetings and products.',
    },
  },
  insights: {
    key: 'insights',
    title: 'Better decisions\nstart here.',
    standfirst:
      'Practical notes on soil health, crop nutrition, water and biological inputs. Written to be useful, with sources you can check.',
    image: photo('wheat-punjab', { focal: { x: 0.5, y: 0.5 } }),
    seo: {
      title: 'Insights: soil health, crop nutrition and good practice',
      description:
        'Practical articles on soil health, crop nutrition, fertigation and biological inputs for Indian farms, with sources.',
    },
  },
  contact: {
    key: 'contact',
    title: 'Talk to\nOceania.',
    standfirst:
      'Questions about a product, your crop or working with us. Send a message and the right person in our team will reply.',
    seo: {
      title: 'Contact Oceania Fertilizers',
      description:
        'Contact Oceania Fertilizers about products, crops or partnership. Farmers, dealers and distributors across India.',
    },
  },
  join: {
    key: 'join',
    title: 'For farmers\nwho want to know more.',
    standfirst:
      'Register with the Oceania farmer community to hear about guidance for your crop, demo plots and farmer meetings, in the ways you choose.',
    image: photo('sowing-raichur', { focal: { x: 0.45, y: 0.65 } }),
    seo: {
      title: 'Join the Oceania farmer community',
      description:
        'Register as an Oceania farmer for crop guidance, demo plots and farmer meetings. You choose how we contact you.',
    },
  },
};
