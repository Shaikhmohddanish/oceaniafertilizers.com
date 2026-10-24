import Link from 'next/link';

import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/brand/icons';
import { Wordmark } from '@/components/brand/Wordmark';
import type { SiteSettings } from '@/content/types';
import { formatAddress, formatPhone, whatsappHref } from '@/lib/contact';
import { footerNav } from '@/lib/site';

const socialLabels: Record<SiteSettings['social'][number]['platform'], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
};

export function SiteFooter({ settings, newsletter }: { settings: SiteSettings; newsletter?: React.ReactNode }) {
  const { contact } = settings;
  const address = formatAddress(contact.address);
  const hasContact = Boolean(contact.phone || contact.whatsapp || contact.email || address);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark render-later bg-botanical-950 text-ivory-50">
      <div className="container-site pt-20 pb-10 lg:pt-28">
        <div className="grid-site gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <Link href="/" className="inline-block">
              <Wordmark tone="ivory" size="lg" />
              <span className="sr-only">, home</span>
            </Link>
            <p className="type-h3 mt-10 max-w-[16ch] text-ivory-50">{settings.tagline}.</p>
            <p className="type-small mt-4 max-w-[42ch] text-sage-300">{settings.description}</p>

            {hasContact ? (
              <ul className="type-small mt-8 space-y-3">
                {contact.phone ? (
                  <li>
                    <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-3 hover:text-gold-300">
                      <PhoneIcon className="text-gold-300" />
                      {formatPhone(contact.phone)}
                    </a>
                  </li>
                ) : null}
                {contact.whatsapp ? (
                  <li>
                    <a href={whatsappHref(contact.whatsapp)} className="inline-flex items-center gap-3 hover:text-gold-300">
                      <WhatsAppIcon className="text-gold-300" />
                      WhatsApp {formatPhone(contact.whatsapp)}
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:text-gold-300">
                      <MailIcon className="text-gold-300" />
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {address ? <li className="text-sage-300">{address}</li> : null}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="type-label text-gold-300">{group.title}</h2>
                <ul className="type-small mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-draw text-ivory-50/90 hover:text-ivory-50">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {newsletter || settings.social.length > 0 || settings.whatsappChannelUrl ? (
          <div className="rule-on-dark mt-16 grid-site gap-y-10 pt-10">
            {newsletter ? <div className="col-span-12 lg:col-span-6">{newsletter}</div> : null}
            {settings.social.length > 0 || settings.whatsappChannelUrl ? (
              <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                <h2 className="type-label text-gold-300">Follow Oceania</h2>
                <ul className="type-small mt-5 flex flex-wrap gap-x-6 gap-y-3">
                  {settings.social.map((item) => (
                    <li key={item.url}>
                      <a href={item.url} className="link-draw" rel="noopener noreferrer" target="_blank">
                        {socialLabels[item.platform]}
                      </a>
                    </li>
                  ))}
                  {settings.whatsappChannelUrl ? (
                    <li>
                      <a href={settings.whatsappChannelUrl} className="link-draw" rel="noopener noreferrer" target="_blank">
                        WhatsApp channel
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="type-caption mt-14 flex flex-col gap-2 text-sage-300 sm:flex-row sm:justify-between">
          <p>Copyright {year} {settings.legalName ?? settings.siteName}.</p>
          <p>Agricultural inputs for farms across India.</p>
        </div>
      </div>
    </footer>
  );
}
