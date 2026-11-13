import type { SiteSettings } from '@/content/types';

/** Formats an E.164 Indian number for display: +91 98000 00000. */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return e164;
}

/** A wa.me link with an optional prefilled message. */
export function whatsappHref(e164: string, message?: string): string {
  const digits = e164.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

export function formatAddress(address: SiteSettings['contact']['address']): string {
  if (!address) return '';
  const { line1, line2, city, district, state, pinCode } = address;
  const locality = [city, district].filter(Boolean).join(', ');
  const region = [state, pinCode].filter(Boolean).join(' ');
  return [line1, line2, locality, region].filter(Boolean).join(', ');
}

export type ContactChannel = 'whatsapp' | 'call' | 'advice';
export type ContactAction = { channel: ContactChannel; label: string; href: string; external?: boolean };

/**
 * The ways to reach the team. WhatsApp and call appear only once their numbers
 * are entered in Site settings; the crop advice form always works.
 */
export function contactActions(contact: SiteSettings['contact'], whatsappMessage?: string): ContactAction[] {
  const actions: ContactAction[] = [];
  if (contact.whatsapp) {
    actions.push({ channel: 'whatsapp', label: 'WhatsApp', href: whatsappHref(contact.whatsapp, whatsappMessage), external: true });
  }
  if (contact.phone) actions.push({ channel: 'call', label: 'Call', href: `tel:${contact.phone}` });
  actions.push({ channel: 'advice', label: 'Get advice', href: '/advice' });
  return actions;
}
