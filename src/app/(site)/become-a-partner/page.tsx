import type { Metadata } from 'next';

import { FaqList } from '@/components/content/FaqList';
import { ContactFallback } from '@/components/forms/ContactFallback';
import { PartnerForm } from '@/components/forms/PartnerForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { getFaqs, getPartnerProgramme, getSiteSettings } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const programme = await getPartnerProgramme();
  return pageMetadata({
    title: programme.seo?.title ?? 'Become a partner',
    description: programme.seo?.description ?? programme.hero.standfirst,
    path: '/become-a-partner',
  });
}

export default async function BecomeAPartnerPage() {
  const [programme, faqs, settings] = await Promise.all([getPartnerProgramme(), getFaqs('partner'), getSiteSettings()]);

  return (
    <>
      <PageHeader
        variant="split"
        title={programme.hero.headline}
        standfirst={programme.hero.standfirst}
        image={programme.hero.image}
        crumbs={[{ label: 'Become a partner', href: '/become-a-partner' }]}
      >
        <div className="mt-10">
          <ButtonLink href="#apply">Apply now</ButtonLink>
        </div>
      </PageHeader>

      <section aria-labelledby="types-title" className="section-space bg-paper">
        <div className="container-site grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="types-title" className="type-h2 max-w-[14ch] text-forest-900">
              Ways to work with Oceania
            </h2>
          </div>
          <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
            {programme.types.map((type) => (
              <div key={type.key} className="grid gap-2 border-t border-[color:var(--line-strong)] py-6 last:border-b sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8">
                <dt className="type-h3 text-forest-900">{type.title}</dt>
                <dd className="text-ink-700">{type.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="What to expect" className="section-space bg-ivory-50">
        <div className="container-site grid-site gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="type-h2 text-forest-900">{programme.lookFor.headline}</h2>
            <ul className="mt-8 space-y-4">
              {programme.lookFor.items.map((item) => (
                <li key={item} className="flex gap-4 text-ink-900">
                  <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 bg-gold-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <h2 className="type-h2 text-forest-900">{programme.process.headline}</h2>
            <ol className="mt-8">
              {programme.process.steps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-[color:var(--line-strong)] py-6">
                  <span className="type-numeral font-display text-[2rem] leading-none text-gold-500">{index + 1}</span>
                  <div>
                    <h3 className="type-h4 text-forest-900">{step.title}</h3>
                    <p className="mt-2 text-ink-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="type-small mt-6 border-l-2 border-gold-500 pl-5 text-ink-700">{programme.note}</p>
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section aria-labelledby="partner-faq-title" className="section-space bg-paper">
          <div className="container-site grid-site gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <h2 id="partner-faq-title" className="type-h2 text-forest-900">
                Before you apply
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      ) : null}

      <section id="apply" aria-labelledby="apply-title" className="section-space scroll-mt-24 bg-ivory-100">
        <div className="container-site grid-site gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <h2 id="apply-title" className="type-h1 text-forest-900">
                Your application
              </h2>
              <p className="mt-6 max-w-[34ch] text-ink-700">{programme.formIntro}</p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <PartnerForm types={programme.types} fallback={<ContactFallback contact={settings.contact} />} />
          </div>
        </div>
      </section>
    </>
  );
}
