/**
 * Navigation. The header keeps five primary links readable at laptop widths;
 * Gallery, Join, Contact and the partner programme live in the footer and the
 * mobile menu. Partner recruitment stays out of the header on purpose: the
 * site leads with the direct relationship with farmers.
 */

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: 'Learn', href: '/learn' },
  { label: 'Products', href: '/products' },
  { label: 'Field visits', href: '/field-visits' },
  { label: 'Farmer stories', href: '/farmer-stories' },
  { label: 'About', href: '/about' },
];

export const partnerLink: NavItem = { label: 'Become a partner', href: '/become-a-partner' };
export const adviceLink: NavItem = { label: 'Get crop advice', href: '/advice' };

/** Full list for the mobile menu, in reading order. */
export const mobileNav: NavItem[] = [
  { label: 'Get crop advice', href: '/advice', description: 'Tell us your crop; we call you back' },
  { label: 'Learn', href: '/learn', description: 'Farmer videos and guides' },
  { label: 'Products', href: '/products', description: 'Order or ask about a product' },
  { label: 'Field visits', href: '/field-visits', description: 'Book a visit or a demo plot' },
  { label: 'Farmer stories', href: '/farmer-stories', description: 'In their own words' },
  { label: 'About', href: '/about', description: 'Who we are and how we work' },
  { label: 'Gallery', href: '/gallery', description: 'From the field' },
  { label: 'Join Oceania', href: '/join-oceania', description: 'For farmers' },
  { label: 'Contact', href: '/contact', description: 'Talk to our team' },
  { label: 'Become a partner', href: '/become-a-partner', description: 'For distributors and dealers' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Learn',
    items: [
      { label: 'Farmer videos and guides', href: '/learn' },
      { label: 'Farmer stories', href: '/farmer-stories' },
      { label: 'Field visits and demos', href: '/field-visits' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'All products', href: '/products' },
      { label: 'Halad Special', href: '/products/halad-special' },
      { label: 'WAVES', href: '/products/waves-mycorrhizal-biofertilizer' },
    ],
  },
  {
    title: 'Talk to us',
    items: [
      { label: 'Get crop advice', href: '/advice' },
      { label: 'Join Oceania', href: '/join-oceania' },
      { label: 'Contact', href: '/contact' },
      { label: 'Become a partner', href: '/become-a-partner' },
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

export type HelpPath = { title: string; body: string; href: string };

/**
 * The four things someone can do next, offered on the homepage. Until farmer
 * videos are published, the last path offers the guides rather than promising videos.
 */
export function helpPaths({ hasVideos }: { hasVideos: boolean }): HelpPath[] {
  return [
    { title: 'Get crop advice', body: 'Tell us your crop and the problem. Our team calls you back.', href: '/advice' },
    { title: 'Order products', body: 'Choose the product and the pack. We confirm the price and delivery.', href: '/products' },
    { title: 'Book a field visit', body: 'A visit from our team, or a demo plot on your farm.', href: '/field-visits' },
    hasVideos
      ? { title: 'Watch farmer videos', body: 'Learn from farmers who have tried it.', href: '/learn' }
      : { title: 'Learn farming together', body: 'Practical guides on soil, water and crop care.', href: '/learn' },
  ];
}
