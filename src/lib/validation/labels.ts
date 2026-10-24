/*
 * Option lists and their labels for the forms. Kept free of zod so client
 * components can import them without shipping the validation library.
 */

export const contactRoles = ['farmer', 'dealer-distributor', 'retailer', 'company', 'other'] as const;
export const contactTopics = ['product', 'partnership', 'general', 'experience', 'privacy', 'other'] as const;

export const contactRoleLabels: Record<(typeof contactRoles)[number], string> = {
  farmer: 'A farmer',
  'dealer-distributor': 'A dealer or distributor',
  retailer: 'A retailer',
  company: 'A company or institution',
  other: 'Something else',
};

export const contactTopicLabels: Record<(typeof contactTopics)[number], string> = {
  product: 'A product question',
  partnership: 'Becoming a partner',
  general: 'A general enquiry',
  experience: 'Sharing my experience with Oceania products',
  privacy: 'Privacy request',
  other: 'Something else',
};

export const experienceLevels = ['new', 'under-2', '2-5', '5-10', 'over-10'] as const;

export const experienceLabels: Record<(typeof experienceLevels)[number], string> = {
  new: 'New to agricultural inputs',
  'under-2': 'Less than 2 years',
  '2-5': '2 to 5 years',
  '5-10': '5 to 10 years',
  'over-10': 'More than 10 years',
};

export const farmerInterests = ['crop-guidance', 'demo-plot', 'field-days', 'product-information', 'share-experience'] as const;

export const farmerInterestLabels: Record<(typeof farmerInterests)[number], string> = {
  'crop-guidance': 'Guidance for my crop',
  'demo-plot': 'Hosting a demo plot on my farm',
  'field-days': 'Farmer meetings and field days',
  'product-information': 'Information about Oceania products',
  'share-experience': 'Sharing my experience',
};
