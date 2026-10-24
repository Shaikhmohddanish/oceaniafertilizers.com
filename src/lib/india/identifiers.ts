/**
 * Indian mobile numbers. Accepts common ways of writing a number
 * (98765 43210, 098765 43210, +91 98765-43210) and returns E.164,
 * or null when it is not a valid 10-digit mobile number starting 6 to 9.
 */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return `+91${digits}`;
}

/** Six-digit PIN code; the first digit is never zero. */
export function isValidPinCode(input: string): boolean {
  return /^[1-9]\d{5}$/.test(input.trim());
}

const GSTIN_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** The GSTIN check character: a mod-36 checksum over the first 14 characters. */
export function gstinCheckCharacter(first14: string): string {
  let sum = 0;
  for (let index = 0; index < 14; index += 1) {
    const value = GSTIN_CHARSET.indexOf(first14[index] ?? '');
    const product = value * (index % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }
  return GSTIN_CHARSET[(36 - (sum % 36)) % 36] ?? '';
}

/** Validates the GSTIN format, the state code range and the check character. */
export function isValidGstin(input: string): boolean {
  const gstin = input.trim().toUpperCase();
  if (!GSTIN_PATTERN.test(gstin)) return false;
  const stateCode = Number(gstin.slice(0, 2));
  if (stateCode < 1 || (stateCode > 38 && stateCode !== 97 && stateCode !== 99)) return false;
  return gstinCheckCharacter(gstin.slice(0, 14)) === gstin[14];
}
