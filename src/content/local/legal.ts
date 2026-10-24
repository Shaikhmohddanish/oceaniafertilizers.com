import type { LegalPage } from '../types';

import { rt } from './rich-text';

/*
 * Drafts prepared for legal review. They describe what this website actually
 * does with data. "approved: false" shows a visible review notice on the page.
 */

export const privacyPolicy: LegalPage = {
  slug: 'privacy-policy',
  title: 'Privacy policy',
  summary: 'What we collect through this website, why, who processes it and the choices you have.',
  lastUpdated: '2026-10-24',
  approved: false,
  body: rt.doc(
    rt.h2('Who we are'),
    rt.p(
      'This website is run by Oceania Fertilizers ("Oceania", "we", "us"). This policy explains how we handle personal data collected through oceaniafertilizers.com, in line with the Digital Personal Data Protection Act, 2023.',
    ),
    rt.h2('What we collect'),
    rt.p('We collect only what you choose to give us through our forms:'),
    rt.bullets([
      '**Contact details:** your name, mobile number and, on some forms, your email address.',
      '**Location:** your state and district, city or village, and for partner applications your PIN code.',
      '**Farm details:** your main crop, farm size and areas of interest, if you choose to share them.',
      '**Business details:** for partner applications, your business name, partnership interest, experience and GSTIN (optional).',
      '**Your message** and the consent choices you make on the form.',
    ]),
    rt.p('When you submit a form we also record:'),
    rt.bullets([
      'the page you submitted it from, and campaign tags in the link you followed, if any;',
      'your browser type;',
      'a one-way, salted hash of your IP address, used only to block spam and repeated submissions. We do not store your IP address itself.',
    ]),
    rt.h2('Why we use it'),
    rt.bullets([
      'to reply to your enquiry or product question;',
      'to review a partner application and contact you about it;',
      'to contact you about the Oceania farmer community, if you register and agree to be contacted;',
      'to send you WhatsApp or newsletter updates, only if you separately opt in;',
      'to keep the website secure and protect our forms from abuse.',
    ]),
    rt.p(
      'We process your data on the basis of the consent you give when you submit a form. You can withdraw consent at any time; every newsletter includes a link to unsubscribe. Withdrawing consent does not affect processing that happened before you withdrew it.',
    ),
    rt.h2('Who processes it for us'),
    rt.p('We use service providers to run this website. They process data on our behalf and only for these purposes:'),
    rt.bullets([
      '**Website hosting:** Vercel.',
      '**Database for form submissions:** Neon (managed PostgreSQL).',
      '**Email notifications to our team:** Resend.',
      '**Spam protection on forms:** Cloudflare Turnstile, when enabled.',
      '**Website content management:** Sanity. It stores website content, not your form submissions.',
    ]),
    rt.p(
      'Videos on this website are hosted on YouTube. A video player loads only when you choose to play a video, using YouTube\'s privacy-enhanced mode. We do not sell your personal data.',
    ),
    rt.h2('Cookies'),
    rt.p(
      'This website does not set cookies for visitors. Our staff areas use essential cookies only: one keeps authorised staff signed in to view enquiries, and one lets content editors preview changes before they are published. If we add analytics in future, we will update this policy before doing so.',
    ),
    rt.h2('How long we keep it'),
    rt.p(
      'We keep enquiry and application records for as long as we need them to respond to you and to manage any relationship that follows. We review stored records at least once a year and delete those we no longer need.',
    ),
    rt.h2('How we protect it'),
    rt.p(
      'Data travels to our servers over an encrypted connection. Access to form submissions is limited to authorised staff through a password-protected area.',
    ),
    rt.h2('Your rights'),
    rt.p('Under the Digital Personal Data Protection Act, 2023, you can ask us to:'),
    rt.bullets([
      'give you a summary of the personal data we hold about you and how we use it;',
      'correct, complete or update your data;',
      'erase your data, where we no longer need it for the purpose you gave it for;',
      'stop contacting you, by withdrawing your consent.',
    ]),
    rt.p(
      'You can also nominate another person to exercise these rights on your behalf in the event of your death or incapacity. To make a request or raise a concern, use our [contact form](/contact) and choose "Privacy request". If you are not satisfied with our response, you may complain to the Data Protection Board of India.',
    ),
    rt.h2('Children'),
    rt.p('Our forms are meant for adults. If you are under 18, please do not submit personal data through this website.'),
    rt.h2('Changes to this policy'),
    rt.p('If we change how we handle personal data, we will update this page and the date at the top.'),
  ),
};

export const termsPage: LegalPage = {
  slug: 'terms',
  title: 'Terms and conditions',
  summary: 'The terms that apply when you use this website.',
  lastUpdated: '2026-10-24',
  approved: false,
  body: rt.doc(
    rt.h2('About these terms'),
    rt.p(
      'These terms apply to your use of oceaniafertilizers.com, run by Oceania Fertilizers ("Oceania", "we", "us"). By using the website you accept them.',
    ),
    rt.h2('Product information'),
    rt.p(
      'Product information on this website is general. It is not advice for a particular farm. Always read the product label and follow its instructions, and ask our team if you are unsure whether a product suits your crop.',
    ),
    rt.p(
      'Results from any agricultural input depend on soil, weather, crop, timing and management. Field results and farmer experiences shown on this website describe what was observed in those fields and are not a guarantee of results elsewhere.',
    ),
    rt.h2('Enquiries and applications'),
    rt.p(
      'Sending an enquiry, registering as a farmer or applying to become a partner does not create a contract or any obligation on either side. Any partnership is subject to a separate written agreement.',
    ),
    rt.p('We do not sell products or take payments through this website.'),
    rt.h2('Using the website'),
    rt.p(
      'You may use the website for your own information. Please do not misuse it, for example by submitting false information, attempting to disrupt it or trying to access areas you are not authorised to use.',
    ),
    rt.h2('Intellectual property'),
    rt.p(
      'The Oceania name, product names, text and design of this website belong to Oceania or its licensors. Some photographs are used under the licences shown on our [image credits](/image-credits) page.',
    ),
    rt.h2('Links and embedded content'),
    rt.p(
      'The website links to and embeds content from other websites, such as YouTube. We are not responsible for the content or privacy practices of those websites.',
    ),
    rt.h2('Liability'),
    rt.p(
      'We work to keep the information on this website accurate and up to date, but we cannot guarantee that it is complete or free of errors. To the extent permitted by law, we are not liable for loss arising from reliance on general information on this website.',
    ),
    rt.h2('Governing law'),
    rt.p('These terms are governed by the laws of India.'),
    rt.h2('Changes'),
    rt.p('We may update these terms. The date at the top of the page shows when they last changed.'),
  ),
};

export const legalPages: LegalPage[] = [privacyPolicy, termsPage];
