import type { SiteSettings } from '../types';

/*
 * Contact details, legal entity and social profiles are intentionally empty:
 * the supplied mockups conflict (Hingoli vs Ahmedabad, two email addresses,
 * placeholder phone numbers). The site hides every empty field. Fill these in
 * the CMS once the client confirms them.
 */
export const siteSettings: SiteSettings = {
  siteName: 'Oceania Fertilizers',
  shortName: 'Oceania',
  tagline: "Let's understand farming together", // client, 7 November 2026
  description:
    'Oceania Fertilizers develops agricultural inputs for farms across India and helps farmers make better decisions about using them.',
  contact: {},
  social: [],
  // From the founder brief in the brand and mobile proposal; to be confirmed.
  adviceLanguages: 'English and Marathi',
};
