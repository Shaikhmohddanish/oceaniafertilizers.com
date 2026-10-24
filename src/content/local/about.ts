import type { AboutPage } from '../types';

import { photo } from './media';
import { rt } from './rich-text';

/*
 * Positioning copy for client approval. It states intent and principles only.
 * "Our story" and leadership stay empty until the client supplies them, so the
 * page renders those sections only when real content exists.
 */
export const aboutPage: AboutPage = {
  hero: {
    headline: 'Better farming\nbegins with better\nunderstanding.',
    standfirst:
      'Oceania Fertilizers is an agricultural inputs company built on one idea: every decision on a farm should rest on understanding, not guesswork.',
    image: photo('sunderbans-paddy', { focal: { x: 0.5, y: 0.55 } }),
  },
  purpose: {
    headline: 'Why we exist',
    body: rt.doc(
      rt.p(
        'Every season, a farmer makes dozens of decisions about inputs: which product, how much, how and when. Too often those decisions are made with little to go on.',
      ),
      rt.p(
        'Our work is to develop inputs that do a clear job, and to share the knowledge that helps farmers use them well. A good product used badly is still a bad decision. We care about both halves.',
      ),
    ),
  },
  approach: {
    headline: 'How we work',
    intro: 'Four steps, in the same order every time.',
    steps: [
      { title: 'Understand', body: 'Start with the soil, the crop stage and the conditions in the field.' },
      { title: 'Choose', body: 'Pick the input that answers a real need in that field.' },
      { title: 'Apply', body: 'Use the right dose, by the right method, at the right time.' },
      { title: 'Observe', body: 'Watch what changes, record it, and carry the lesson into the next season.' },
    ],
  },
  principles: {
    headline: 'What we hold to',
    items: [
      {
        title: 'Claims we can stand behind',
        body: 'We describe what a product is for and how to use it. We do not promise results we have not seen.',
      },
      {
        title: "Respect for the farmer's judgement",
        body: 'Farmers know their land. Our role is to add knowledge, not to replace experience.',
      },
      {
        title: 'Responsibility to the soil',
        body: 'Good farming has to work next season too, not just this one.',
      },
      {
        title: 'Open about what we know',
        body: 'When we do not have an answer yet, we say so.',
      },
    ],
  },
  leadership: [],
  vision: {
    headline: 'Our vision for Indian agriculture',
    body: 'Farms where decisions are made with confidence. Farmers who are grounded in the land, driven by knowledge, responsible in action and focused on a smarter, more sustainable future.',
    image: photo('mustard-wheat-path', { focal: { x: 0.5, y: 0.6 } }),
  },
  seo: {
    title: 'About Oceania Fertilizers',
    description:
      'Oceania Fertilizers is an agricultural inputs company built on one idea: every decision on a farm should rest on understanding, not guesswork.',
  },
};
