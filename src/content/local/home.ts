import type { HomePage } from '../types';

import { photo } from './media';

/*
 * Headlines marked "client" come from the Oceania mockups, the workbook or the
 * client's notes on the brand and mobile proposal (7 November 2026). Supporting
 * copy is written for approval and avoids claims that need evidence.
 */
export const homePage: HomePage = {
  hero: {
    // Line breaks are deliberate: each line is set on its own.
    headline: "Let's understand\nfarming together.", // client
    standfirst: 'Crop advice, quality inputs, field visits and farmer videos, direct from Oceania.',
    image: photo('paddy-eluru', { focal: { x: 0.42, y: 0.62 } }),
    primaryCta: { label: 'Get crop advice', href: '/advice' },
    secondaryCta: { label: 'See products', href: '/products' },
  },
  learn: {
    headline: 'Learn farming together.', // client
    intro: 'Short videos and notes on soil, water, nutrition and crop care, from farmers and our team.',
  },
  products: {
    eyebrow: 'Our products',
    headline: 'Inputs that\nhave a purpose.', // client
    intro: 'A focused range of agricultural inputs. Each one has a clear job to do in the field, and a clear way to use it.',
    featuredSlugs: ['halad-special', 'waves-mycorrhizal-biofertilizer'],
  },
  farmer: {
    eyebrow: 'The Oceania farmer',
    headline: 'More than a farmer.\nA decision-maker.', // client
    body: 'Oceania farmers learn before they decide. They watch their fields, ask questions and share what works.',
    image: photo('broadcast-sunset', { focal: { x: 0.68, y: 0.5 } }),
    points: [
      { title: 'Learn', body: 'Understand the soil and the crop before choosing an input.' },
      { title: 'Ask', body: 'Check your doubts with our team before you spend.' },
      { title: 'Share', body: 'Pass on what worked, and what did not.' },
    ],
    cta: { label: 'Join the farmer community', href: '/join-oceania' },
  },
  stories: {
    eyebrow: "Farmers' experiences",
    headline: 'Farmers who choose to understand before they decide.', // client
  },
  results: {
    eyebrow: 'Field results',
    headline: 'Demo plots, documented plot by plot.',
    intro: 'Each record lists the crop, the treatment, what it was compared with and what was observed.',
  },
  practices: {
    eyebrow: 'Good farming practices',
    headline: 'Small changes. Big impact.', // client
    intro: 'Simple practices for healthier soil, stronger crops and more sustainable farming.', // client
    topics: [
      { title: 'Soil health', body: 'Test your soil regularly and keep it in balance.' },
      { title: 'Water management', body: 'Use water efficiently and avoid over-irrigation.' },
      { title: 'Right product', body: 'Choose the right input for the right crop stage.' },
      { title: 'Crop rotation', body: 'Keep soil fertile and reduce pest pressure.' },
      { title: 'Sustainable farming', body: 'Protect today, for tomorrow.' },
    ],
  },
  contact: {
    eyebrow: 'Contact us',
    headline: "Let's understand your farm.", // client
    body: 'Tell us about your crop and what you are trying to achieve. Our team will get in touch with you.', // client
  },
  seo: {
    title: "Oceania Fertilizers | Let's understand farming together",
    description:
      'Crop advice, quality inputs, field visits and farmer videos from Oceania Fertilizers, for farms across India. Halad Special bio-stimulant and WAVES mycorrhizal biofertilizer.',
  },
};
