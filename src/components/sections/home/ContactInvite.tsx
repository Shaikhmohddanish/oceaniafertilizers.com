import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/brand/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage, SiteSettings } from '@/content/types';
import { formatPhone, whatsappHref } from '@/lib/contact';

/** "Let's understand your farm." The short farm callback form sits beside the invitation. */
export function ContactInvite({
  section,
  contact,
  form,
}: {
  section: HomePage['contact'];
  contact: SiteSettings['contact'];
  form?: React.ReactNode;
}) {
  const channels = [
    contact.whatsapp
      ? { href: whatsappHref(contact.whatsapp, 'Hello Oceania, I would like to talk about my farm.'), label: `WhatsApp ${formatPhone(contact.whatsapp)}`, Icon: WhatsAppIcon }
      : null,
    contact.phone ? { href: `tel:${contact.phone}`, label: formatPhone(contact.phone), Icon: PhoneIcon } : null,
    contact.email ? { href: `mailto:${contact.email}`, label: contact.email, Icon: MailIcon } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section aria-labelledby="contact-invite-title" className="section-space render-later bg-paper">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-12 lg:col-span-5" data-reveal="rise">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 id="contact-invite-title" className="type-h1 mt-6 max-w-[12ch] text-forest-900">
            <Lines text={section.headline} />
          </h2>
          <p className="type-lead mt-8 max-w-[32ch] text-ink-700">{section.body}</p>
          {channels.length > 0 ? (
            <ul className="mt-10 space-y-3">
              {channels.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a href={href} className="inline-flex items-center gap-3 font-medium text-forest-800 hover:text-forest-900">
                    <Icon className="text-gold-700" />
                    <span className="link-draw">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {form ?? (
            <div className="border-t border-[color:var(--line-strong)] pt-8">
              <p className="text-ink-700">Tell us about your crop and we will get back to you.</p>
              <ButtonLink href="/contact" className="mt-6">
                Talk to Oceania
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
