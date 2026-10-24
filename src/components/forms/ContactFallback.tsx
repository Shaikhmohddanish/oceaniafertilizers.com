import type { SiteSettings } from '@/content/types';
import { formatPhone, whatsappHref } from '@/lib/contact';

/**
 * Shown when a form cannot be sent. Lists direct channels only when verified
 * contact details exist in site settings; otherwise renders nothing.
 */
export function ContactFallback({ contact }: { contact: SiteSettings['contact'] }) {
  const channels = [
    contact.phone ? (
      <a key="phone" href={`tel:${contact.phone}`} className="link-inline font-medium">
        call {formatPhone(contact.phone)}
      </a>
    ) : null,
    contact.whatsapp ? (
      <a key="whatsapp" href={whatsappHref(contact.whatsapp)} className="link-inline font-medium">
        message us on WhatsApp
      </a>
    ) : null,
    contact.email ? (
      <a key="email" href={`mailto:${contact.email}`} className="link-inline font-medium">
        email {contact.email}
      </a>
    ) : null,
  ].filter(Boolean);

  if (channels.length === 0) return null;
  return (
    <p>
      You can also{' '}
      {channels.map((channel, index) => (
        <span key={index}>
          {index > 0 ? (index === channels.length - 1 ? ' or ' : ', ') : null}
          {channel}
        </span>
      ))}
      .
    </p>
  );
}
