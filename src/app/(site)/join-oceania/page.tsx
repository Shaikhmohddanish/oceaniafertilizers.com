import type { Metadata } from 'next';

import { ContactFallback } from '@/components/forms/ContactFallback';
import { FarmerForm } from '@/components/forms/FarmerForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { TextLink } from '@/components/ui/Button';
import { getCrops, getPageIntro, getSiteSettings } from '@/content/repository';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('join');
  return pageMetadata({ ...intro.seo, path: '/join-oceania' });
}

/* What registering means. Copy for client approval; no promises of free services. */
const expectations = [
  { title: 'Guidance for your crop', body: 'Notes and advice that match the crop you grow and the season you are in.' },
  { title: 'Demo plots', body: 'A chance to see documented results nearby, or to host a demo plot on your own farm.' },
  { title: 'Farmer meetings', body: 'Word of field days and farmer meetings when they are planned in your area.' },
  { title: 'Only the contact you choose', body: 'We contact you by phone about the community. WhatsApp updates are a separate choice.' },
];

export default async function JoinOceaniaPage() {
  const [intro, crops, settings] = await Promise.all([getPageIntro('join'), getCrops(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        variant="split"
        title={intro.title}
        standfirst={intro.standfirst}
        image={intro.image}
        crumbs={[{ label: 'Join Oceania', href: '/join-oceania' }]}
      />

      <section aria-labelledby="expect-title" className="section-space bg-paper">
        <div className="container-site">
          <h2 id="expect-title" className="type-h2 max-w-[20ch] text-forest-900">
            What you can expect as an Oceania farmer
          </h2>
          <ul className="mt-12 grid gap-x-[var(--column-gap)] border-t border-[color:var(--line-strong)] sm:grid-cols-2 lg:grid-cols-4">
            {expectations.map((item, index) => (
              <li
                key={item.title}
                data-reveal="rise"
                style={{ ['--reveal-index' as string]: index }}
                className="border-b border-[color:var(--line)] py-8 lg:border-b-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8"
              >
                <h3 className="type-h3 text-forest-900">{item.title}</h3>
                <p className="mt-3 text-ink-700">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="register" aria-labelledby="register-title" className="section-space bg-ivory-100">
        <div className="container-site grid-site gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="register-title" className="type-h1 text-forest-900">
              Join the community
            </h2>
            <p className="mt-6 max-w-[34ch] text-ink-700">It takes about two minutes. Only the fields marked optional can be skipped.</p>
            <p className="type-small mt-8 max-w-[34ch] text-ink-500">
              Run a shop or a distribution business?{' '}
              <TextLink href="/become-a-partner" className="text-forest-800" arrow={false}>
                Apply to become a partner
              </TextLink>{' '}
              instead.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <FarmerForm crops={crops} fallback={<ContactFallback contact={settings.contact} />} />
          </div>
        </div>
      </section>
    </>
  );
}
