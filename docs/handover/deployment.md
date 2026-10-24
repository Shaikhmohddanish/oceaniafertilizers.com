# Deployment guide

For the developer or administrator who puts the website live and keeps it running. It covers the services in the order they are set up, the environment variables, the GoDaddy DNS records, the launch checklist and running costs.

Create every account in Oceania's name, with an Oceania email address, and add the developer as a member. That way the company keeps control when people change.

## 1. Services

| Service | Used for | Needed for launch |
| --- | --- | --- |
| Vercel (Pro plan) | Hosting, builds, preview deployments, logs | Yes |
| Neon | PostgreSQL database for enquiries | Yes. Forms refuse to report success without it |
| Sanity | Content editing (Studio at `/studio`) | Recommended. Without it the site uses the bundled content |
| Resend | Email notification to the team for each enquiry | Recommended. Enquiries are stored either way |
| A mailbox provider (Google Workspace, Zoho Mail or similar) | `info@` and team mailboxes | Before publishing an email address |
| Cloudflare Turnstile | Spam check on forms | Optional; add it if spam appears |
| Google Analytics 4 | Visit and enquiry statistics | Optional; see section 9 first |
| Google Search Console | Indexing and search performance | Yes, at launch |

The domain `oceaniafertilizers.com` is registered at GoDaddy and uses GoDaddy's nameservers. When this guide was written it showed a parked page and had no MX records, so no mailbox exists on it yet.

## 2. Get the code into a Git repository

The project folder is a Git repository with no commits yet. Create a private repository on GitHub (or GitLab or Bitbucket) under Oceania's organisation, then commit and push. Vercel deploys from that repository. Never commit `.env.local`; it is already in `.gitignore`.

## 3. Database (Neon)

1. Create a Neon project. Choose the region closest to India that Neon offers. At the time of writing that is Asia Pacific (Singapore), `aws-ap-southeast-1`; use Mumbai if Neon lists it. **A project's region cannot be changed later.**
2. Keep the default branch for production, and create a second branch called `preview` for Vercel preview deployments.
3. For each branch, copy two connection strings from the Connect dialog: the **pooled** string for the website and the **direct** (unpooled) string for migrations.
4. Create the tables on both branches from your own machine (Node.js 22.12 or later):

   ```
   DATABASE_URL="<direct connection string>" npm run db:migrate
   ```

   Pending migrations run in a single transaction. Run this again whenever a new file appears in `drizzle/`.

## 4. Content (Sanity)

1. At sanity.io/manage, create a project with a dataset called `production`. On the free plan, datasets are publicly readable. That is why the CMS has no fields for farmers' phone numbers or addresses. Drafts are never public.
2. **API, then CORS origins:** add each of these with **Allow credentials** ticked:
   - `https://oceaniafertilizers.com`
   - `http://localhost:3000`
   - your Vercel preview address pattern, for example `https://*-oceania.vercel.app`
3. **API, then Tokens:**
   - A **Viewer** token for the website, used as `SANITY_API_READ_TOKEN`. It powers draft previews.
   - A temporary **Editor** token for the one-off import below. Delete it when the import is done, and never add it to Vercel.
4. Import the bundled content (products, pages, the drafts awaiting approval, and images). Preview first, then import:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<id> SANITY_API_WRITE_TOKEN=<editor token> npm run sanity:seed -- --dry-run
   NEXT_PUBLIC_SANITY_PROJECT_ID=<id> SANITY_API_WRITE_TOKEN=<editor token> npm run sanity:seed
   ```

   The import never overwrites a document that already exists unless you add `-- --force`. Unconfirmed items arrive as drafts.
5. **API, then Webhooks:** after the site is live, create a webhook:
   - URL: `https://oceaniafertilizers.com/api/revalidate`
   - Method: POST
   - Dataset: `production`
   - Trigger on: create, update and delete. Leave drafts excluded.
   - Projection: `{_type, _id}`
   - Secret: a long random string, also set as `SANITY_REVALIDATE_SECRET` in Vercel

   Published changes then appear on the site within about a minute. Without the webhook, pages refresh at most an hour after a change.
6. **Members:** invite the Oceania editors with the Editor role.

## 5. Email for enquiries (Resend) and mailboxes

1. Choose a mailbox provider for `info@oceaniafertilizers.com` and any team addresses, and add its MX and SPF records in GoDaddy (section 8). Only then publish an email address in Site settings.
2. In Resend, add a sending domain. A subdomain such as `send.oceaniafertilizers.com` keeps website email separate from the mailboxes. Copy every record Resend shows into GoDaddy, wait for **Verified**, then create an API key with sending access only.
3. Set:
   - `RESEND_API_KEY`
   - `LEADS_NOTIFY_FROM`, for example `Oceania website <website@send.oceaniafertilizers.com>`
   - `LEADS_NOTIFY_TO`: the people who should receive enquiries, comma separated

   Each email sets the visitor as Reply-To when they gave an email address, so the team can simply reply.
4. The free Resend plan allows 100 emails a day. If a notification fails, the enquiry is still stored, and the admin list shows "Failed" in its "Email sent" column.

## 6. Spam check (Cloudflare Turnstile, optional)

1. In the Cloudflare dashboard, open Turnstile and add a widget for `oceaniafertilizers.com` in Managed mode. The DNS does not need to move to Cloudflare.
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for Production, then redeploy. The site key is built into the page, so changing it needs a new deployment.
3. On Preview, either leave both empty or use Cloudflare's published test keys.

The widget loads only after a visitor starts filling in a form. With JavaScript switched off, a protected form cannot pass the check, and the visitor is told their details were not sent.

## 7. Hosting (Vercel)

1. The Pro plan is required: the free Hobby plan is for non-commercial use only.
2. Import the Git repository. Keep the Next.js defaults, and set Node.js to 22.x or later in Settings, then General.
3. **Settings, then Functions, then Function region:** pick the region next to the Neon database: Singapore (`sin1`), or Mumbai (`bom1`) if the database is in Mumbai. Pages themselves are static and served from Vercel's network close to visitors. Only form submissions and the admin run in this region.
4. Add the environment variables in section 10, then deploy.
5. **Settings, then Domains:** add `oceaniafertilizers.com` and `www.oceaniafertilizers.com`. Make the apex domain primary and redirect `www` to it (permanent). The site also redirects `www` itself, as a safeguard.

## 8. DNS records at GoDaddy

In GoDaddy, open My Products, then the domain, then DNS:

1. Remove the parked-page records and any forwarding.
2. Add the website records exactly as Vercel shows them in its Domains screen. Typically these are an `A` record for `@` and a `CNAME` for `www`.
3. Add the mailbox provider's `MX` records and its SPF `TXT` record for `@`. A name can have only one SPF record; merge if needed.
4. Add Resend's records for the sending subdomain (DKIM `TXT`, plus `MX` and `TXT` for bounces).
5. Recommended: add a DMARC record at `_dmarc`, starting with `v=DMARC1; p=none; rua=mailto:<a mailbox you read>`, and tighten it once mail is flowing.
6. For Search Console, add the `TXT` verification record it gives you (section 9).

Changes usually apply within an hour, sometimes longer. Vercel issues the HTTPS certificate automatically once the records resolve.

## 9. Search Console and Google Analytics

**Search Console** (at launch)
1. Add a Domain property for `oceaniafertilizers.com` and verify it with the DNS `TXT` record. If you use a URL-prefix property instead, its HTML-tag code goes in `GOOGLE_SITE_VERIFICATION`.
2. Submit `https://oceaniafertilizers.com/sitemap.xml`.

**Google Analytics 4** (optional)
1. **First update the privacy policy.** It currently says the site uses no analytics. The built-in loader runs GA4 without cookies: all Consent Mode storage is denied and Google signals are off. The policy still has to say that analytics is used. Agree the wording during the legal review.
2. Create a GA4 property (time zone India, currency INR) and a web data stream for `https://oceaniafertilizers.com`. Keep enhanced measurement on, including page changes from browser history.
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` for Production only, then redeploy. The script loads after the page is idle and never on preview builds.
4. Mark `generate_lead` as a key event. It is sent only after an enquiry has been stored, with the form name and never the form's contents. `video_play` is sent when a farmer story starts playing.

## 10. Environment variables

`.env.example` explains each one. Generate random secrets with `openssl rand -base64 48`.

| Variable | Production | Preview |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://oceaniafertilizers.com` (required) | Leave empty; the deployment's own address is used |
| `NEXT_PUBLIC_SITE_ENV` | `production` | Leave empty; Vercel's own setting marks it as a preview |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id | Same |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Same |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-10-01` | Same |
| `SANITY_API_READ_TOKEN` | Viewer token | Same |
| `SANITY_REVALIDATE_SECRET` | Random | Not needed |
| `DATABASE_URL` | Neon production branch, pooled | Neon `preview` branch, pooled |
| `IP_HASH_SALT` | Random, 32+ characters | A different random value |
| `RESEND_API_KEY`, `LEADS_NOTIFY_FROM`, `LEADS_NOTIFY_TO` | Set | Leave empty, so test enquiries do not email the team |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Real keys, if used | Empty or Cloudflare test keys |
| `ADMIN_PASSWORD` | 12+ characters, shared only with staff who handle enquiries | A different value |
| `ADMIN_SESSION_SECRET` | Random, 32+ characters | A different value |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Only after the policy update | Never |
| `GOOGLE_SITE_VERIFICATION` | Only for a URL-prefix property | Not needed |
| `SANITY_API_WRITE_TOKEN`, `E2E_FIXTURES`, `PGLITE_DATA_DIR` | Never on Vercel | Never on Vercel |

Keep "Automatically expose System Environment Variables" switched on in Vercel; the site reads `NEXT_PUBLIC_VERCEL_ENV` and `NEXT_PUBLIC_VERCEL_URL`. Changing an environment variable takes effect on the next deployment.

Preview deployments show content still awaiting approval, with a marker, and are never indexed. Only production hides unapproved items and allows search engines.

## 11. Launch checklist

- [ ] Database migrated on both branches; `DATABASE_URL` set for Production and Preview
- [ ] Sanity content imported, reviewed and approved items published; webhook created
- [ ] Contact details confirmed and entered in Site settings
- [ ] Privacy policy and terms reviewed by a lawyer and marked approved
- [ ] Resend domain verified; a real test enquiry sent from the live site arrives by email and shows in `/admin`
- [ ] Admin password shared only with the people who handle enquiries
- [ ] `https://oceaniafertilizers.com/robots.txt` allows crawling and lists the sitemap; `www` redirects to the apex
- [ ] Sitemap submitted in Search Console
- [ ] PageSpeed Insights run on the homepage and one product page, mobile and desktop
- [ ] Old links checked: `/testimonials`, `/about-us`, `/contact-us`, `/blog` and `/business-opportunity` redirect to their new pages

## 12. Running the site

- **Logs:** Vercel, then the project, then Logs. Server errors are written as single JSON lines, for example `"event":"request_error"` or `"event":"database_unavailable"`, which are easy to filter. Request headers and form contents are never logged.
- **Secrets:** to rotate `ADMIN_SESSION_SECRET`, change it and redeploy; everyone is signed out. Change `ADMIN_PASSWORD` when someone with access leaves. `IP_HASH_SALT` can be rotated at any time; it only affects rate limiting.
- **Backups:** Neon keeps a restore window that depends on the plan. Check it, and export the leads CSV periodically if you want an extra copy.
- **Data retention:** the privacy policy promises a yearly review. Delete records that are no longer needed from the admin.
- **Updates:** run `npm outdated` and `npm audit` every few months, update in a branch, and check the preview deployment before merging. `npm run verify` and `npm run test:e2e` must pass.

## 13. Running costs

Approximate, from each provider's published pricing in October 2026. Check the pricing pages before signing up; prices change.

| Service | Plan | Cost |
| --- | --- | --- |
| Vercel | Pro | About US$20 per team member per month, including US$20 of usage credit. A site of this size should stay within it |
| Neon | Free, or Launch | Free plan to start. Launch is billed by use with no monthly minimum |
| Sanity | Free, or Growth | Free covers 20 users and public datasets. Growth is about US$15 per user per month |
| Resend | Free, or Pro | Free covers 3,000 emails a month (100 a day). Pro is about US$20 a month for 50,000 |
| Cloudflare Turnstile | Free | Free |
| Google Analytics 4, Search Console | Free | Free |
| Mailbox provider | Per user | Varies by provider and plan |
| Domain | GoDaddy renewal | Existing |
