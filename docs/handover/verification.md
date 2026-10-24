# Verification

What was tested, how, and the results, recorded on 25 October 2026 against the code as handed over. The last section lists what could not be tested until Oceania's accounts exist.

## 1. Automated checks

| Check | Command | Result |
| --- | --- | --- |
| ASCII only | `npm run check:ascii` | Passed (239 files) |
| Lint | `npm run lint` | No errors or warnings |
| Types | `npm run typecheck` | No errors |
| Unit tests | `npm test` | 56 passed, in 5 files |
| End-to-end tests | `npm run test:e2e` | 58 passed |
| Production build | `npm run build` | Passed. Every public page is static; the admin, API routes and the unsubscribe page render per request |
| Sanity schema | `npx sanity schema validate` | 0 errors, 0 warnings |
| Dependencies | `npm audit` | 18 advisories (3 high, 15 moderate, 0 critical), all in tooling. See section 6 |

### What the unit tests cover

- Indian identifiers: mobile number normalisation, PIN codes, GSTIN format and check character.
- Form validation schemas and their messages.
- Lead storage against a real in-memory Postgres (PGlite):
  - references, deduplication by day, rate limits and their pruning
  - notification status
  - newsletter subscription, unsubscribing by personal link and signing up again
  - staff unsubscribe, the subscriber export and lead deletion
- The publication rule: pending items never appear in production.
- Structured data: no prices, ratings or reviews on products; contact points only when they exist; video data only when complete.
- Output: CSV quoting with spreadsheet-formula neutralisation, the lead notification email (subject, text and HTML escaping), Turnstile verification against a mocked Cloudflare response, and hreflang alternates.

### What the end-to-end tests cover

They run against a production build in Google Chrome, with a temporary database and a clearly labelled test-fixture dataset.

- **Routes (21 tests):**
  - Every public page returns 200 with a single h1, a title, a description, a canonical link, a share image and `lang="en-IN"`, and has no console errors.
  - Unknown and unpublished pages return a real 404.
  - Production shows no pending content and no preview notice.
  - robots.txt allows the site and blocks the admin; the sitemap lists only published pages.
  - Structured data is present and has no prices or ratings.
  - The security headers below are sent.
  - The admin export returns 404 without a session, and the admin is marked noindex.
- **Links (1):** every internal link on every page resolves.
- **Forms (11):**
  - Validation messages and the error summary.
  - A stored submission with a reference, and duplicate detection.
  - The honeypot.
  - Submission without JavaScript: the page returns to the form with the outcome on screen.
  - PIN and GSTIN checks.
  - Pre-selected topics and products.
  - A partner application visible in the admin.
  - Newsletter sign-up and repeat sign-up.
  - Unsubscribing through the exported personal link, which asks for confirmation first.
  - Deleting a lead, which needs a ticked confirmation.
- **Interactions (7):**
  - The mobile menu traps focus, closes on Escape and returns focus.
  - The video player loads only when played and stops on close.
  - The before and after slider works by keyboard and by pointer.
  - The lightbox steps through photos by keyboard.
  - The product filter updates the list and the address.
  - Scroll reveals never leave content hidden.
  - The skip link moves focus.
- **Layout (2):** no horizontal scrolling at 320, 360, 390, 768, 1024, 1280, 1440 and 1920 px; touch targets of at least 24 px in the header and forms.
- **Accessibility (16):** an axe scan of every route and the 404 page against the WCAG 2.0, 2.1 and 2.2 A and AA rules: no violations.

## 2. Checks in a real browser, outside the suite

- **Cloudflare Turnstile**, using Cloudflare's published test keys:
  - With the always-pass keys, the widget loaded only after the first field was focused, produced a token in about 1.6 seconds, and the submission was stored (reference `OF-V9CJ5H`).
  - With the always-fail secret, the visitor saw "Your details were not sent. We could not complete the security check. Please try again." and nothing was stored.
  - With JavaScript switched off, the same message appeared, with the visitor's entries kept.
- **Google Analytics loader**, with a dummy measurement ID on a production build:
  - gtag.js was requested after the page load event.
  - All four Consent Mode storage types were denied.
  - No cookies were set.
  - The Content Security Policy raised no errors.
- **Visual review:** full-page screenshots of every page at 390 px and 1440 px were reviewed after the final changes (`node scripts/screenshots.mjs`).

## 3. Performance (Lighthouse 13)

Measured locally on a production build (`NEXT_PUBLIC_SITE_ENV=production`, bundled content), with Lighthouse's default mobile and desktop settings. Mobile simulates a mid-range phone on a slow 4G connection with a four-times slower processor. The image optimiser was warmed first, as a CDN would be in production.

| Page | Preset | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Mobile | 98 | 100 | 100 | 100 | 2.4 s | 0 | 60 ms |
| `/products` | Mobile | 97 | 100 | 100 | 100 | 2.6 s | 0 | 50 ms |
| `/products/halad-special` | Mobile | 97 | 100 | 100 | 100 | 2.6 s | 0 | 50 ms |
| `/insights` | Mobile | 97 | 100 | 100 | 100 | 2.4 s | 0 | 120 ms |
| `/become-a-partner` | Mobile | 99 | 100 | 100 | 100 | 2.1 s | 0 | 60 ms |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| `/products` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| `/products/halad-special` | Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms |
| `/insights` | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms |
| `/become-a-partner` | Desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |

**Against the targets:** performance 90+ and accessibility, best practices and SEO 95+ are met on every page. CLS is 0, under the 0.1 target. TBT is 50 to 120 ms, which suggests interaction delay well under 200 ms; INP itself needs real users to measure. **The 2.5 second LCP target is met on desktop and on three of the five pages on mobile; the product list and the product page measure 2.6 seconds on mobile.**

About the mobile LCP figure:

- In the unthrottled trace, the largest element, the hero photograph, appears at about 0.1 seconds. The 2.1 to 2.6 second figures are Lighthouse's model of a slow phone, and it counts all JavaScript that finished downloading before that first frame.
- About 130 KB (compressed) of that JavaScript is React and the Next.js router, which every page of this kind loads.
- Repeated runs vary by about 0.4 seconds, depending on whether the scripts happen to finish before the first frame.

What was changed to get here:

- The hero photo is preloaded at high priority and has no blur placeholder.
- No web fonts are downloaded: the site is set in Arial, which visitors' devices already have.
- Sections far down the homepage, and the footer, skip rendering until they are scrolled near.
- The chapter photos are served at quality 65.

Inlining the CSS was tried and reverted: it tripled the stylesheet inside the HTML and did not help.

**Real-user figures matter more than this lab number.** After launch, check PageSpeed Insights for the homepage and a product page. Once enough people have visited, its field data (Chrome UX Report) shows the LCP real visitors experience.

Reports: `reports/lighthouse/*.json` (not committed). Re-run with `npm run perf` against a running production build.

## 4. Accessibility

- An axe scan of every page passed, as above.
- Keyboard: a skip link; visible focus on light and dark surfaces; native dialogs with focus return; the slider is a native range input; the lightbox and menu close on Escape.
- `prefers-reduced-motion` switches off every animation, and every page is complete without animation or JavaScript.
- Forms: labels on every field, errors linked to their fields and listed in a summary that receives focus, and no reliance on placeholder text.
- Colour contrast of the colour pairs in use, measured with the WCAG formula:

| Use | Text or element | Background | Ratio |
| --- | --- | --- | --- |
| Headings and strong text | ink-900 `#1a1d18` | paper `#fbf9f4` | 16.19:1 |
| Body text | ink-700 `#3a3f36` | paper `#fbf9f4` | 10.27:1 |
| Body text on tinted sections | ink-700 `#3a3f36` | ivory-100 `#efe8da` | 8.86:1 |
| Captions, credits, meta | ink-500 `#5c6257` | paper `#fbf9f4` | 5.98:1 |
| Captions on tinted sections | ink-500 `#5c6257` | ivory-100 `#efe8da` | 5.16:1 |
| Display headings | forest-900 `#152a20` | paper `#fbf9f4` | 14.42:1 |
| Small labels | gold-700 `#7a5c1c` | paper `#fbf9f4` | 5.91:1 |
| Small labels on tinted sections | gold-700 `#7a5c1c` | ivory-100 `#efe8da` | 5.10:1 |
| Secondary text | moss-600 `#5e6a4d` | paper `#fbf9f4` | 5.48:1 |
| Field errors | error-700 `#9b3424` | paper `#fbf9f4` | 6.86:1 |
| Error summary | error-700 `#9b3424` | error-100 `#f6e3dc` | 5.82:1 |
| Primary button | ivory-50 `#f7f3ea` | forest-800 `#1e3a2b` | 11.19:1 |
| Text on dark sections and footer | ivory-50 `#f7f3ea` | botanical-950 `#0f1e17` | 15.56:1 |
| Secondary text on dark | sage-300 `#b4bda7` | botanical-950 `#0f1e17` | 8.85:1 |
| Captions on dark | sage-400 `#9da890` | botanical-950 `#0f1e17` | 6.93:1 |
| Labels on dark | gold-300 `#e2c988` | botanical-950 `#0f1e17` | 10.62:1 |
| Secondary text on the partner band | sage-300 `#b4bda7` | forest-900 `#152a20` | 7.79:1 |
| Inverse button on dark | forest-900 `#152a20` | ivory-50 `#f7f3ea` | 13.70:1 |
| Placeholder text in form fields | ink-500 `#5c6257` | field fill on paper / ivory-100 | 6.19:1 / 5.93:1 |
| Placeholder text on dark | sage-400 `#9da890` | botanical-950 `#0f1e17` | 6.93:1 |
| Form field outline (non-text, needs 3:1) | ink at 55% | paper / ivory-100 | 3.78:1 / 3.62:1 |
| Form field outline on dark (non-text) | ivory at 45% | botanical-950 / forest-900 | 4.13:1 / 3.94:1 |
| Focus ring on light (non-text) | forest-800 `#1e3a2b` | paper `#fbf9f4` | 11.77:1 |
| Focus ring on dark (non-text) | gold-300 `#e2c988` | botanical-950 `#0f1e17` | 10.62:1 |

Form field outlines were darkened during final checks. They had been 1.9:1, which is below the 3:1 that WCAG 1.4.11 asks for. Automated tools do not test this.

## 5. Security and privacy

- **Headers (checked by the end-to-end suite):**
  - A Content Security Policy on every page except the Studio
  - HSTS
  - `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`
  - `X-Robots-Tag: noindex` on the admin, the Studio and non-production builds

  The Studio loads Sanity's own scripts and connects to Sanity's servers. A policy for it could not be tested without a real Sanity project, so it was left out rather than risk breaking the editor. It still gets the other headers.
- **Secrets:** only `NEXT_PUBLIC_*` values reach the browser. The repository contains no keys or passwords; `.env.local`, `.data/` and the build folders are ignored by Git.
- **Admin:**
  - The password is compared in constant time, and sign-in attempts are rate-limited.
  - The session cookie is signed, `httpOnly`, `secure` and `sameSite=strict`.
  - Every admin page, action and export checks the session itself. The export returns 404 without one.
- **Personal data:**
  - Raw IP addresses are never stored, only a salted hash used for rate limiting.
  - Logs never contain form contents or request headers.
  - CSV exports neutralise spreadsheet formulas.
  - Staff can delete a lead, which supports erasure requests.
  - Newsletter subscribers can unsubscribe by a personal link, which asks for confirmation, so email link scanners cannot unsubscribe anyone.
- **Honesty rules:**
  - The forms report success only after the database insert.
  - The Studio blocks publishing farmer stories and demo plots without recorded consent.
  - No invented people, numbers, results or reviews appear anywhere, including structured data.

## 6. Dependency audit

`npm audit` reports 18 advisories: 3 high and 15 moderate, none critical. All of them are in tooling, not in code the website runs:

| Package | Pulled in by | Role |
| --- | --- | --- |
| js-yaml 3.13.1, smol-toml 1.5.2 | `@vercel/frameworks`, used by the Sanity CLI | Command-line tool |
| undici 7.29.1 (via `@module-federation`), uuid 10.0.0 (via `typeid-js`) | The Sanity CLI | Command-line tool |
| undici 7.29.1 | jsdom, an optional dependency of Vitest | Tests only |
| esbuild 0.18 | drizzle-kit | Migration generator, development only |

The Sanity client that the website uses on the server runs undici 7.30.1, which is outside the affected range. The only fix npm offers is downgrading Sanity to version 5, a breaking change, so it was not applied. Check again when Sanity publishes updates (`npm update sanity`, then `npm audit`).

## 7. Not yet verified: these need Oceania's accounts

| Item | Why it is not verified yet |
| --- | --- |
| Sanity Studio sign-in, editing, publishing, the Preview tool, the webhook and the content import | Need a Sanity project. The schema validates and the import was dry-run (71 documents, 17 images) |
| `npm run db:migrate` against Neon | Needs a Neon database. The same migrations run on every local start and in every test |
| Email delivery through Resend | Needs a verified sending domain. The email content is unit tested; without a key, leads are stored and marked "Email off" |
| Vercel deployment, the domain, HTTPS and the `www` redirect | Need the Vercel project and GoDaddy DNS access. The redirect rule is in place |
| Turnstile with Oceania's own widget | Tested only with Cloudflare's test keys |
| Google Analytics data and Search Console | Need the Google accounts, and analytics needs the privacy policy update first |
| Field performance (real users) | Needs the live site and visitors |
