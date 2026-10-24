import type { HomePage } from '../types';

import { photo } from './media';

/*
 * Headlines marked "client" come from the Oceania mockups and workbook.
 * Supporting copy is written for approval and avoids claims that need evidence.
 */
export const homePage: HomePage = {
  hero: {
    eyebrow: "Let's understand farming",
    // Line breaks are deliberate: each line is set on its own.
    headline: 'Farming should\nnot be a game\nof guesswork.', // client
    standfirst:
      'Better farming begins with better understanding. Oceania develops agricultural inputs and helps farmers make better decisions about using them.',
    // The backdrop matches the sky along the top edge of the photo, so the hero blends into it.
    image: photo('paddy-eluru', { focal: { x: 0.5, y: 0.62 }, backdrop: '#eef5f6' }),
    primaryCta: { label: 'Explore products', href: '/products' },
    secondaryCta: { label: 'Talk to Oceania', href: '/contact' },
  },
  pillars: [
    'We develop effective agricultural inputs.', // client
    'We help farmers make better decisions.', // client
    'We work for more productive farms and a better tomorrow.', // client
  ],
  chapters: [
    {
      label: 'Who we are',
      title: 'An input company that starts with the field.',
      body: 'Oceania Fertilizers develops agricultural inputs for Indian farms, from biostimulants to biofertilizers. We want every product to do a clear job, and every farmer who uses it to know what that job is.',
      image: photo('sowing-raichur', { focal: { x: 0.45, y: 0.7 } }),
    },
    {
      label: 'The problem',
      title: 'Too many decisions are still made on guesswork.',
      body: 'Which input, how much and when. On many farms these choices rest on habit and hearsay. The cost shows up later: in the soil, in the crop and in the margin.',
      image: photo('paddy-sunset-nadia', { focal: { x: 0.5, y: 0.55 } }),
    },
    {
      label: 'Our approach',
      title: 'Understand first. Then decide.',
      body: 'Look at the soil, the crop stage and the conditions before choosing anything. Then match the input, the dose and the method to what the field needs. Our products and our advice are built around that way of working.',
      image: photo('turmeric-leaves', { focal: { x: 0.5, y: 0.4 } }),
    },
  ],
  products: {
    eyebrow: 'Our products',
    headline: 'Inputs that\nhave a purpose.', // client
    intro: 'A focused range of agricultural inputs. Each one has a clear job to do in the field, and a clear way to use it.',
    featuredSlugs: ['halad-special', 'waves-mycorrhizal-biofertilizer'],
  },
  farmer: {
    eyebrow: 'The Oceania farmer',
    headline: 'More than a farmer.\nA decision-maker.', // client
    body: 'We believe in farmers who observe, understand, ask, learn and take responsible decisions for a better future. Grounded in the land, driven by knowledge, responsible in action.', // client
    image: photo('broadcast-sunset', { focal: { x: 0.68, y: 0.5 } }),
    points: [
      { part: 'Head', meaning: 'for new ideas' },
      { part: 'Eyes', meaning: 'for what is happening in the field' },
      { part: 'Nose', meaning: 'for opportunities' },
      { part: 'Mind', meaning: 'for better farming decisions' },
      { part: 'Ears', meaning: 'for good advice' },
      { part: 'Shoulders', meaning: 'for responsibility' },
      { part: 'Heart', meaning: 'for the farm and the family' },
      { part: 'Backbone', meaning: 'for standing by each decision' },
      { part: 'Hands', meaning: 'for getting things done' },
      { part: 'Voice', meaning: 'for sharing what works' },
      { part: 'Legs', meaning: 'for growing the farm' },
      { part: 'Eyes', meaning: 'on the future' },
      { part: 'Feet', meaning: 'on the ground' },
      { part: 'A long view', meaning: 'for scientific farming' },
    ],
    cta: { label: 'I am an Oceania farmer', href: '/join-oceania' },
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
  partner: {
    eyebrow: 'Partner with Oceania',
    headline: 'Bring better inputs to the farmers you serve.',
    body: 'We are looking for distributors, dealers and retailers across India who know their farmers and want to offer products they can stand behind.',
    image: photo('sugarcane-western-ghats', { focal: { x: 0.5, y: 0.55 } }),
    cta: { label: 'Become a partner', href: '/become-a-partner' },
  },
  contact: {
    eyebrow: 'Contact us',
    headline: "Let's understand your farm.", // client
    body: 'Tell us about your crop and what you are trying to achieve. Our team will get in touch with you.', // client
  },
  seo: {
    title: 'Oceania Fertilizers | Biostimulants and biofertilizers for Indian farms',
    description:
      'Oceania Fertilizers develops agricultural inputs, including Halad Special bio-stimulant and WAVES mycorrhizal biofertilizer, for farms across India.',
  },
};
