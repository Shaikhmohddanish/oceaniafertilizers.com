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
