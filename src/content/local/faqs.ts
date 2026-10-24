import type { Faq } from '../types';

import { rt } from './rich-text';

/* Only questions whose answers this website itself can guarantee. */
export const faqs: Faq[] = [
  {
    id: 'faq-partner-gstin',
    topic: 'partner',
    order: 1,
    question: 'Do I need a GSTIN to apply?',
    answer: rt.doc(
      rt.p(
        'No. The GSTIN field on the application form is optional. If your business has one, adding it helps our team review your application.',
      ),
    ),
  },
  {
    id: 'faq-partner-data',
    topic: 'partner',
    order: 2,
    question: 'What happens to the information I share?',
    answer: rt.doc(
      rt.p(
        'We use it to review your application and to contact you about it. We do not sell it. Our [privacy policy](/privacy-policy) explains how it is stored and how you can ask us to correct or delete it.',
      ),
    ),
  },
];
