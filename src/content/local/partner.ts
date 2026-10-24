import type { PartnerProgramme } from '../types';

import { photo } from './media';

/*
 * Partner programme copy for client approval. No commercial promises:
 * margins, territories, exclusivity and terms are discussed directly.
 */
export const partnerProgramme: PartnerProgramme = {
  hero: {
    headline: 'Grow with Oceania.',
    standfirst:
      'We want to work with distributors, dealers and retailers who know their region and the farmers in it. If that sounds like you, we would like to hear from you.',
    image: photo('groundnut-sprinkler', { focal: { x: 0.5, y: 0.5 } }),
  },
  types: [
    {
      key: 'distributor',
      title: 'Distributor',
      description: 'You supply dealers and retailers across a district or a wider region.',
    },
    {
      key: 'dealer',
      title: 'Dealer',
      description: 'You sell agricultural inputs to farmers and smaller retailers from an established business.',
    },
    {
      key: 'retailer',
      title: 'Retailer',
      description: 'You run an agri-input shop that serves farmers directly.',
    },
    {
      key: 'sales-partner',
      title: 'Sales partner',
      description: 'You work with farmers in the field and want to represent Oceania products.',
    },
    {
      key: 'other',
      title: 'Other business partnership',
      description: 'Cooperatives, farmer producer organisations, institutions and companies with a different idea for working together.',
    },
  ],
  lookFor: {
    headline: 'What we look for',
    items: [
      'A working knowledge of farming and farmers in your area',
      'An established business, or a clear plan for one',
      'Interest in selling products for what they are actually for',
      'Willingness to share feedback from the field with our team',
    ],
  },
  process: {
    headline: 'What happens after you apply',
    steps: [
      { title: 'We read your application', body: 'Our business team reviews every application we receive.' },
      {
        title: 'We get in touch',
        body: 'We talk through your business, your region and the kind of partnership you have in mind.',
      },
      {
        title: 'We agree next steps',
        body: 'If there is a fit, we share the terms and the documents needed to begin.',
      },
    ],
  },
  note: 'We do not publish margins, territories or terms on this website. They depend on the partnership and are discussed directly.',
  formIntro: 'Tell us about yourself and your business. It takes about five minutes.',
  seo: {
    title: 'Become a partner: distributors, dealers and retailers',
    description:
      'Apply to become an Oceania Fertilizers distributor, dealer, retailer or sales partner. Tell us about your business and region and our team will get in touch.',
  },
};
