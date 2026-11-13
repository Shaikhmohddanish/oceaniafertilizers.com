import { MailIcon } from '@/components/brand/icons';
import { ContactActions } from '@/components/contact/ContactActions';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Lines } from '@/components/ui/Lines';
import type { HomePage, SiteSettings } from '@/content/types';

/** Connect: "Let's understand your farm." The crop advice form sits beside WhatsApp and call. */
export function ContactInvite({
  section,
  contact,
  languages,
  form,
}: {
  section: HomePage['contact'];
  contact: SiteSettings['contact'];
  /** For example "English and Marathi". */
  languages?: string;
  form?: React.ReactNode;
}) {

  return (
    <section aria-labelledby="contact-invite-title" className="section-space render-later bg-surface">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-12 lg:col-span-5" data-reveal="rise">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 id="contact-invite-title" className="type-h1 mt-6 max-w-[12ch] text-pine-700">
            <Lines text={section.headline} />
          </h2>
          <p className="type-lead mt-8 max-w-[32ch] text-ink-700">{section.body}</p>
          {languages ? <p className="mt-6 font-bold text-ink-900">Advice in {languages}.</p> : null}
          <ContactActions
            contact={contact}
            place="home_connect"
            whatsappMessage="Hello Oceania, I would like to talk about my farm."
            className="mt-8"
          />
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-pine-700">
              <MailIcon />
              <span className="link-draw">{contact.email}</span>
            </a>
          ) : null}
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {form ?? (
            <div className="border-t border-[color:var(--line-strong)] pt-8">
              <p className="text-ink-700">Tell us about your crop and we will get back to you.</p>
              <ButtonLink href="/advice" className="mt-6">
                Get crop advice
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
