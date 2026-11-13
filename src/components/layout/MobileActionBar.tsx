'use client';

import Link from 'next/link';

import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from '@/components/brand/icons';
import type { SiteSettings } from '@/content/types';
import { track } from '@/lib/analytics';
import { contactActions } from '@/lib/contact';

/**
 * On phones, a person is always one tap away: WhatsApp and call when their
 * numbers are set, and the crop advice form always. The spacer keeps the bar
 * from covering the end of the page; --action-bar-height (globals.css) also
 * keeps focused fields and anchors clear of it. Keep the two in step.
 */
export function MobileActionBar({ contact }: { contact: SiteSettings['contact'] }) {
  const actions = contactActions(contact);
  const cell = 'flex min-h-14 flex-1 items-center justify-center gap-2 px-3 text-[0.9375rem] font-bold';

  return (
    <>
      <div aria-hidden="true" className="h-[var(--action-bar-height)] lg:hidden" />
      <nav
        aria-label="Contact Oceania"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[color:var(--line-on-dark)] bg-pine-900 pb-[env(safe-area-inset-bottom)] text-paper lg:hidden"
      >
        {actions.map((action) =>
          action.channel === 'advice' ? (
            <Link
              key={action.channel}
              href={action.href}
              onClick={() => track('contact_click', { channel: action.channel, place: 'mobile_bar' })}
              className={`${cell} bg-clay-300 text-ink-900`}
            >
              {action.label}
              <ArrowRightIcon size={18} />
            </Link>
          ) : (
            <a
              key={action.channel}
              href={action.href}
              {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => track('contact_click', { channel: action.channel, place: 'mobile_bar' })}
              className={`${cell} border-r border-[color:var(--line-on-dark)]`}
            >
              {action.channel === 'whatsapp' ? <WhatsAppIcon /> : <PhoneIcon />}
              {action.label}
            </a>
          ),
        )}
      </nav>
    </>
  );
}
