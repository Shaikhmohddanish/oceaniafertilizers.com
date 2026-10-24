/**
 * Locale readiness. The site is published in English for India (en-IN). The
 * client's mockups include Marathi, and Hindi is the other likely addition.
 *
 * To add a language:
 * 1. Set `enabled: true` for it below.
 * 2. Add app/(site)/[locale]/... routes that reuse the existing page components
 *    with translated content. English stays at the root, without a prefix.
 * 3. Load that script's fonts in the locale's layout only, so English pages
 *    never download them.
 * Every page's metadata then gains hreflang alternates through pageMetadata.
 */
export type Locale = {
  code: string;
  /** Value for <html lang> and hreflang. */
  htmlLang: string;
  /** URL prefix; empty for the default language. */
  pathPrefix: string;
  name: string;
  enabled: boolean;
};

export const locales: readonly Locale[] = [
  { code: 'en', htmlLang: 'en-IN', pathPrefix: '', name: 'English', enabled: true },
  { code: 'mr', htmlLang: 'mr-IN', pathPrefix: '/mr', name: 'Marathi', enabled: false },
  { code: 'hi', htmlLang: 'hi-IN', pathPrefix: '/hi', name: 'Hindi', enabled: false },
];

export const defaultLocale = locales[0];

/** hreflang alternates for a page path, or undefined while only one language is live. */
export function languageAlternates(path: string, available: readonly Locale[] = locales): Record<string, string> | undefined {
  const live = available.filter((locale) => locale.enabled);
  if (live.length < 2) return undefined;
  const localised = (locale: Locale) => (locale.pathPrefix && path === '/' ? locale.pathPrefix : `${locale.pathPrefix}${path}`);
  return {
    ...Object.fromEntries(live.map((locale) => [locale.htmlLang, localised(locale)])),
    'x-default': path,
  };
}
