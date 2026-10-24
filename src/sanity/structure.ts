import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import type { StructureResolver } from 'sanity/structure';

import { PAGE_INTRO_KEYS } from './schemaTypes/pages';

/** The Studio menu, arranged for the people who run the website. */
export const structure: StructureResolver = (S, context) => {
  const singleton = (type: string, title: string) =>
    S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

  return S.list()
    .title('Oceania website')
    .items([
      S.listItem()
        .title('Website pages')
        .child(
          S.list()
            .title('Website pages')
            .items([
              singleton('homePage', 'Homepage'),
              singleton('aboutPage', 'About page'),
              singleton('partnerProgramme', 'Partner programme'),
              S.listItem()
                .title('Page openings')
                .child(
                  S.list()
                    .title('Page openings')
                    .items(
                      PAGE_INTRO_KEYS.map((page) =>
                        S.listItem()
                          .title(page.title)
                          .id(`pageIntro.${page.value}`)
                          .child(S.document().schemaType('pageIntro').documentId(`pageIntro.${page.value}`).title(page.title)),
                      ),
                    ),
                ),
              S.listItem()
                .title('Legal pages')
                .child(
                  S.list()
                    .title('Legal pages')
                    .items([
                      S.listItem()
                        .title('Privacy policy')
                        .id('legal.privacy-policy')
                        .child(S.document().schemaType('legalPage').documentId('legal.privacy-policy')),
                      S.listItem()
                        .title('Terms and conditions')
                        .id('legal.terms')
                        .child(S.document().schemaType('legalPage').documentId('legal.terms')),
                    ]),
                ),
              S.divider(),
              singleton('siteSettings', 'Site settings and contact details'),
            ]),
        ),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'product', title: 'Products', S, context }),
      S.listItem()
        .title('Product lists')
        .child(
          S.list()
            .title('Product lists')
            .items([
              S.documentTypeListItem('productCategory').title('Categories'),
              S.documentTypeListItem('applicationMethod').title('Application methods'),
              S.documentTypeListItem('crop').title('Crops'),
            ]),
        ),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'testimonial', title: 'Farmer stories', S, context }),
      orderableDocumentListDeskItem({ type: 'demoPlot', title: 'Demo plots', S, context }),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'galleryItem', title: 'Gallery', S, context }),
      S.documentTypeListItem('galleryCategory').title('Gallery categories'),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('articleCategory').title('Article topics'),
      S.documentTypeListItem('author').title('Authors'),
      orderableDocumentListDeskItem({ type: 'faq', title: 'Questions and answers', S, context }),
    ]);
};
