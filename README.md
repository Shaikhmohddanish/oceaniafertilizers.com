# Oceania Fertilizers website

The website for Oceania Fertilizers (oceaniafertilizers.com): brand, product information and lead generation for farmers, dealers and partners across India.

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- Sanity for content, with the Studio embedded at `/studio`
- PostgreSQL for enquiries (Neon in production, PGlite locally), Drizzle ORM
- Resend for lead notification emails, Cloudflare Turnstile for spam protection (optional)
- A small leads admin at `/admin`

Handover documents are in `docs/handover/`. Start with `verification.md` for what has been tested, and `client-checklist.md` for what Oceania still needs to supply.

## Quick start

Requires Node.js 22.12 or later.

```
npm install
npm run dev
```

Open http://localhost:3000. No services or `.env.local` are needed to run the site:

- Content comes from the bundled seed in `src/content/local/`. Items not yet confirmed by Oceania are marked "Pending approval" and never appear on the production deployment.
- Forms save to an embedded Postgres database (PGlite) in `.data/pglite/`, migrated automatically on first use.
- Notification emails are skipped; the stored lead is marked `not_configured`.
- `/studio` shows a setup notice until a Sanity project is configured.

To try the leads admin locally, copy `.env.example` to `.env.local`, set `ADMIN_PASSWORD` (12+ characters) and `ADMIN_SESSION_SECRET` (32+ random characters), restart, and open `/admin`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build`, `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check:ascii` | Fails on any non-ASCII character in code, copy or docs (see Conventions) |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Builds the site with test fixtures, then runs the Playwright suite (routes, links, forms, interactions, layout, accessibility) on port 3100 with the installed Google Chrome |
| `npm run verify` | ASCII check, lint, typecheck, unit tests and build |
| `npm run perf` | Lighthouse (mobile and desktop) on key pages of a running server. Set `BASE_URL`; `PAGES` and `PRESETS` narrow the run. Reports go to `reports/lighthouse/` |
| `npm run db:generate` | Writes a SQL migration to `drizzle/` after a change to `src/server/db/schema.ts` |
| `npm run db:migrate` | Applies the migrations to `DATABASE_URL` |
| `npm run sanity:seed` | Imports the bundled content into Sanity. `-- --dry-run` previews; `-- --force` overwrites existing documents |
| `node scripts/screenshots.mjs / /products` | Full-page screenshots at phone and desktop widths into `reports/screenshots/` |

For realistic Lighthouse numbers, measure a production build: `NEXT_PUBLIC_SITE_ENV=production npm run build && npm start`, then `BASE_URL=http://localhost:3000 npm run perf`.

## How the code is organised

```
src/app/(site)/          Public pages. Statically generated; refreshed by the Sanity webhook.
src/app/(admin)/admin/   Leads admin: password protected, never indexed, rendered per request.
src/app/studio/          Embedded Sanity Studio.
src/app/api/             Sanity webhook (revalidate), draft preview on/off, leads CSV export.
src/content/             Domain types and the content repository. The bundled seed lives in local/.
src/sanity/              Sanity client, GROQ queries and mappers, schema types, Studio menu.
src/server/              Server-only code: database, form pipeline and actions, email, spam
                         protection, admin session.
src/lib/                 Validation (zod), Indian identifiers (mobile, PIN code, GSTIN), SEO
                         helpers, site configuration, analytics, locales.
src/components/          UI components grouped by area.
src/styles/globals.css   Design tokens and the few global styles.
drizzle/                 SQL migrations. Commit new ones.
tests/unit, tests/e2e    Vitest and Playwright suites.
scripts/                 Seed import, migrations, Lighthouse, screenshots, ASCII check.
```

### Content sources

`src/content/repository.ts` is the only way pages read content. It uses Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and the bundled seed otherwise, and returns the same types either way. Every item is published or pending: pending means a draft in Sanity, or `status: 'pending'` in the seed. Pending items are visible, with a marker, on local and preview builds, and never on production. Production is the build where `NEXT_PUBLIC_SITE_ENV`, or Vercel's `NEXT_PUBLIC_VERCEL_ENV`, is `production`. Only production is indexable.

### Forms

Each form is a Server Action with server-side zod validation. Forms work as plain form posts before JavaScript loads; once JavaScript is running they validate in the browser and show an error summary. Each submission goes through `src/server/forms/pipeline.ts`:

1. Honeypot field and a minimum fill time.
2. Turnstile, when configured. The widget loads only after someone starts filling in a form.
3. Rate limit by a salted hash of the IP address. Raw IP addresses are never stored.
4. Deduplication: the same form, contact and day is reported as "already received".
5. Insert into `leads`. Partner applications also appear in the `partner_applications` view.
6. Email notification after the response, recorded as `sent`, `failed` or `not_configured`.

The visitor sees a success message, with a reference such as `OF-7K2M9Q`, only after the insert has committed. On Vercel, a missing `DATABASE_URL` is an error, so production can never pretend to save.

### Rules the code enforces

- Product structured data has no prices, ratings or reviews.
- Farmer stories and demo plots cannot be published in the Studio without a recorded consent and its date.
- The CMS has no fields for farmers' phone numbers or addresses. The free Sanity plan's datasets are publicly readable.
- Contact details, social links and the WhatsApp number appear only once they are entered in Site settings.
- Analytics loads only on production, only when a measurement ID is set, and without cookies.

## Conventions

- ASCII only in code, site copy and documentation, at the client's request. `npm run check:ascii` enforces it and also catches HTML entities for curly quotes and dashes. Icons and arrows are SVG.
- Colours, type and spacing are tokens in `src/styles/globals.css`. Tailwind's default palette is switched off.
- Motion is CSS only plus one small observer (`src/components/motion/RevealObserver.tsx`), and it respects reduced-motion settings.
- Sections far down the homepage, and the footer, use `render-later` (`content-visibility: auto`) so the first screen paints sooner. Tools that read off-screen content may need `.render-later { content-visibility: visible }` first; the Playwright and screenshot scripts already do this.
- Type: Arial throughout, at the client's request, with bold headings. It is already installed on Windows, macOS and iOS (Android shows its standard sans), so no web fonts are downloaded. Share images and the favicon are drawn with Arimo, an open-licence typeface designed to match Arial (SIL Open Font License, files and licence in `src/fonts/og/`).

## Environment variables

Every variable is listed and explained in `.env.example`. Only `NEXT_PUBLIC_*` values reach the browser; everything else is read on the server through `src/lib/env.ts`.

## Deployment

See `docs/handover/deployment.md`: Vercel, the GoDaddy DNS records, Neon, Sanity, Resend, Turnstile, Google Analytics, Search Console, and costs.

## Images

The photographs on the site are temporary. They come from Wikimedia Commons under CC BY-SA, CC BY and CC0 licences, are credited under each photo and on `/image-credits`, and show no identifiable people. The product images are the client's own. Replace the photographs with Oceania's own when they are available.
# oceaniafertilizers.com
