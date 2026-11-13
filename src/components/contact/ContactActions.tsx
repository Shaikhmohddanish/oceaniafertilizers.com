'use client';

import { PhoneIcon, WhatsAppIcon } from '@/components/brand/icons';
import type { SiteSettings } from '@/content/types';
import { track } from '@/lib/analytics';
import { contactActions, formatPhone } from '@/lib/contact';

/**
 * WhatsApp and call links, shown only when the numbers are set in Site
 * settings. Renders nothing otherwise; the crop advice form is always the fallback.
 */
export function ContactActions({
  contact,
  place,
  tone = 'light',
  whatsappMessage,
  className = '',
}: {
  contact: SiteSettings['contact'];
  /** Where on the site the links sit, for analytics. */
  place: string;
  tone?: 'light' | 'dark';
  whatsappMessage?: string;
  className?: string;
}) {
  const actions = contactActions(contact, whatsappMessage).filter((action) => action.channel !== 'advice');
  if (actions.length === 0) return null;
  const color = tone === 'dark' ? 'text-paper' : 'text-pine-700';

  return (
    <ul className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${className}`}>
      {actions.map((action) => (
        <li key={action.channel}>
          <a
            href={action.href}
            {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={() => track('contact_click', { channel: action.channel, place })}
            className={`inline-flex min-h-11 items-center gap-2 font-bold ${color}`}
          >
            {action.channel === 'whatsapp' ? <WhatsAppIcon /> : <PhoneIcon />}
            <span className="link-draw">
              {action.channel === 'whatsapp' ? 'WhatsApp us' : `Call ${contact.phone ? formatPhone(contact.phone) : ''}`}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
