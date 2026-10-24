import type { Metadata } from 'next';
import Link from 'next/link';

import { ArrowRightIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/brand/icons';
import { ContactFallback } from '@/components/forms/ContactFallback';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { getPageIntro, getProducts, getSiteSettings } from '@/content/repository';
import { formatAddress, formatPhone, whatsappHref } from '@/lib/contact';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getPageIntro('contact');
  return pageMetadata({ ...intro.seo, path: '/contact' });
}

const journeys = [
  { href: '/become-a-partner', title: 'Distributors, dealers and retailers', body: 'Apply to become an Oceania partner.' },
  { href: '/products', title: 'Questions about a product', body: 'Each product page has its own enquiry form.' },
  { href: '/join-oceania', title: 'Farmers', body: 'Join the Oceania farmer community.' },
];

export default async function ContactPage() {
  const [intro, settings, products] = await Promise.all([getPageIntro('contact'), getSiteSettings(), getProducts()]);
  const { contact } = settings;
  const address = formatAddress(contact.address);
  const productOptions = products.map((product) => ({ value: product.slug, label: product.name }));

  return (
    <>
      <PageHeader
        title={intro.title}
        standfirst={intro.standfirst}
        crumbs={[{ label: 'Contact', href: '/contact' }]}
      />

      <section aria-labelledby="contact-form-title" className="bg-ivory-50 pb-[var(--section-space)]">
        <div className="container-site grid-site gap-y-16 border-t border-[color:var(--line-strong)] pt-12 lg:pt-16">
          <div className="col-span-12 lg:col-span-7">
            <h2 id="contact-form-title" className="type-h3 mb-8 text-forest-900">
              Send us a message
            </h2>
            <ContactForm products={productOptions} fallback={<ContactFallback contact={contact} />} />
          </div>

          <aside className="col-span-12 lg:col-span-4 lg:col-start-9" aria-label="Other ways to reach us">
            {contact.phone || contact.whatsapp || contact.email || address ? (
              <div className="border-b border-[color:var(--line-strong)] pb-10">
                <h2 className="type-label text-ink-500">Reach us directly</h2>
                <ul className="mt-6 space-y-5">
                  {contact.whatsapp ? (
                    <li>
                      <a href={whatsappHref(contact.whatsapp, 'Hello Oceania, I have a question.')} className="group inline-flex items-start gap-4">
                        <WhatsAppIcon className="mt-0.5 text-gold-700" />
                        <span>
                          <span className="block font-semibold text-forest-900">WhatsApp</span>
                          <span className="link-draw text-ink-700">{formatPhone(contact.whatsapp)}</span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {contact.phone ? (
                    <li>
                      <a href={`tel:${contact.phone}`} className="inline-flex items-start gap-4">
                        <PhoneIcon className="mt-0.5 text-gold-700" />
                        <span>
                          <span className="block font-semibold text-forest-900">Phone</span>
                          <span className="link-draw text-ink-700">{formatPhone(contact.phone)}</span>
                          {contact.hours ? <span className="type-caption mt-1 block text-ink-500">{contact.hours}</span> : null}
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {contact.email ? (
                    <li>
                      <a href={`mailto:${contact.email}`} className="inline-flex items-start gap-4">
                        <MailIcon className="mt-0.5 text-gold-700" />
                        <span>
                          <span className="block font-semibold text-forest-900">Email</span>
                          <span className="link-draw text-ink-700">{contact.email}</span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {address ? (
                    <li className="text-ink-700">
                      <span className="block font-semibold text-forest-900">Office</span>
                      {address}
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className={contact.phone || contact.whatsapp || contact.email || address ? 'pt-10' : ''}>
              <h2 className="type-label text-ink-500">Looking for something specific?</h2>
              <ul className="mt-4">
                {journeys.map((journey) => (
                  <li key={journey.href} className="border-b border-[color:var(--line)]">
                    <Link href={journey.href} className="has-arrow group flex items-center justify-between gap-6 py-5">
                      <span>
                        <span className="block font-semibold text-forest-900">{journey.title}</span>
                        <span className="type-small mt-1 block text-ink-700">{journey.body}</span>
                      </span>
                      <ArrowRightIcon className="shrink-0 text-forest-800" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="type-small mt-10 border-l-2 border-gold-500 pl-5 text-ink-700">
                We work with farmers and partners across India. Wherever you farm, write to us and the right person in our team will reply.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
