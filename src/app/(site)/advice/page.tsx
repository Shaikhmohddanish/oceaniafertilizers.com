import type { Metadata } from 'next';

import { ContactActions } from '@/components/contact/ContactActions';
import { ContactFallback } from '@/components/forms/ContactFallback';
import { FarmCallbackForm } from '@/components/forms/FarmCallbackForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { getCrops, getPageIntro, getProducts, getSiteSettings } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('advice');
  return pageMetadata({ ...intro.seo, path: '/advice' });
}

/** Crop advice: the call-back form, with WhatsApp and call alongside once their numbers are set. */
export default async function AdvicePage() {
  const [intro, settings, crops, products] = await Promise.all([getPageIntro('advice'), getSiteSettings(), getCrops(), getProducts()]);
  const productOptions = products
    .filter((product) => product.status === 'published')
    .map((product) => ({ value: product.slug, label: product.name }));

  return (
    <>
      <PageHeader title={intro.title} standfirst={intro.standfirst} crumbs={[{ label: 'Get crop advice', href: '/advice' }]}>
        {settings.adviceLanguages ? <p className="mt-6 font-bold text-ink-900">Advice in {settings.adviceLanguages}.</p> : null}
        <ContactActions
          contact={settings.contact}
          place="advice"
          whatsappMessage="Hello Oceania, I would like advice for my crop."
          className="mt-6"
        />
      </PageHeader>

      <section aria-labelledby="advice-form-title" className="bg-paper pb-[var(--section-space)]">
        <div className="container-site">
          <div className="grid-site gap-y-10 border-t border-[color:var(--line-strong)] pt-10">
            <div className="col-span-12 lg:col-span-4">
              <h2 id="advice-form-title" className="type-h2 text-pine-700">
                Ask for a call back
              </h2>
              <p className="mt-4 max-w-[36ch] text-ink-700">
                Tell us about your crop and where you farm. Someone from our team will call you to understand the problem
                before suggesting anything.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <FarmCallbackForm id="advice" crops={crops} products={productOptions} fallback={<ContactFallback contact={settings.contact} />} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
