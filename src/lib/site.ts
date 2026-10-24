/**
 * Navigation. The header keeps five primary links readable at laptop widths;
 * Gallery, Join and Contact live in the footer and the mobile menu. To move
 * Gallery into the header, add it to `primaryNav`.
 */

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Field results', href: '/demo-plots' },
  { label: 'Farmer stories', href: '/farmer-stories' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const partnerLink: NavItem = { label: 'Become a partner', href: '/become-a-partner' };
export const contactLink: NavItem = { label: 'Talk to us', href: '/contact' };

/** Full list for the mobile menu, in reading order. */
export const mobileNav: NavItem[] = [
  { label: 'Products', href: '/products', description: 'The Oceania range' },
  { label: 'Field results', href: '/demo-plots', description: 'Demo plots, documented' },
  { label: 'Farmer stories', href: '/farmer-stories', description: 'In their own words' },
  { label: 'Insights', href: '/insights', description: 'Practices and guidance' },
  { label: 'About', href: '/about', description: 'Who we are and how we work' },
  { label: 'Gallery', href: '/gallery', description: 'From the field' },
  { label: 'Join Oceania', href: '/join-oceania', description: 'For farmers' },
  { label: 'Become a partner', href: '/become-a-partner', description: 'For distributors and dealers' },
  { label: 'Contact', href: '/contact', description: 'Talk to our team' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Products',
    items: [
      { label: 'All products', href: '/products' },
      { label: 'Halad Special', href: '/products/halad-special' },
      { label: 'WAVES', href: '/products/waves-mycorrhizal-biofertilizer' },
    ],
  },
  {
    title: 'From the field',
    items: [
      { label: 'Field results', href: '/demo-plots' },
      { label: 'Farmer stories', href: '/farmer-stories' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    title: 'Work with us',
    items: [
      { label: 'Become a partner', href: '/become-a-partner' },
      { label: 'Join Oceania', href: '/join-oceania' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Oceania', href: '/about' },
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms and conditions', href: '/terms' },
      { label: 'Image credits', href: '/image-credits' },
    ],
  },
];
