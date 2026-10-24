# Content inventory and implementation checklist

Prepared 24 October 2026 from the files supplied in `docs/`. This is the working record of what is verified, what is only illustrative, and what is still missing. Source files in `docs/` are kept exactly as supplied.

## 1. Files reviewed

| File | What it is | Used for |
| --- | --- | --- |
| `OCEANIA WEBSITE SKELETON (1).xlsx` | 7 sheets (Homepage, Products Category Page, PDP page, Testimonials Page, About US page, Gallery Page, Contact Us Page) with 21 embedded images. Author: Uzair Khan, 6 Oct 2026. | Page structure, section order, Halad Special specification, layout references |
| `WhatsApp Image ... 17.19.05.jpeg` | Demo plots mockup (AI-generated imagery) | Layout reference for filters and field-result cards |
| `WhatsApp Image ... 17.19.06.jpeg`, `17.19.07.jpeg`, `17.19.07 (1).jpeg` | Three homepage mockup variants | Brand copy, section order, palette direction |
| `WhatsApp Image ... 17.19.07 (2).jpeg` | Marathi version of the homepage mockup | Evidence of regional-language intent |
| `IMG20261006113201 (1).jpg` | Real photograph (OnePlus 15R, 6 Oct 2026) of a WAVES Mycorrhizal Biofertilizer pouch | Product image for WAVES |

## 2. Verified product information

**Halad Special** (workbook, PDP sheet)
- Type: bio-stimulant
- Packaging: 5 litre can
- Dosage: 5 litres per acre
- Method of application: drenching or drip irrigation
- Description (verbatim from the client): "Halad Special is an advanced bio-stimulant formulated to support crop growth, stronger root development, improved stress tolerance, and yield and quality. Designed for application through drenching or drip irrigation, it helps deliver the product directly to the crop's root zone for effective uptake. Halad Special is suitable for farmers seeking a solution to strengthen plant performance throughout the crop cycle. Its formulation supports healthier plant development and efficient nutrient utilization, helping crops maintain growth under challenging conditions. With a recommended dosage of 5 Litre per acre, Halad Special is an easy-to-use addition to modern, scientific, and sustainable farming practices."
- Image: pack render embedded in the workbook (image10). It needs a final packshot.
- Not confirmed: suitable crops. The name ("halad" is turmeric) and the banner suggest turmeric, so this must be confirmed before it is published.

**WAVES Mycorrhizal Biofertilizer** (product photograph)
- Type: mycorrhizal biofertilizer
- Pack: stand-up pouch, net weight 300 gm
- Pack line: "Strong roots, higher yield"
- Not confirmed: dosage, application method, crops, and any link to Oceania branding (the front of the pack shows none).

## 3. Illustrative content (not published as fact)

- Six product names from the AI mockups: BINGOrhiza (mycorrhiza, labelled "BIVCORRHIZA" in one mockup), Sanjivani N (biofertilizer), JADUGAR (seaweed-based biostimulant), RUSTOM (humic acid), NUTRISAC (micronutrient), MICRON (soil nutrition). These go into the CMS as drafts, holding only the name and the one-line purpose shown in the mockup.
- Farmer testimonials and demo plots: every name (Santosh Patil, Ramesh Jadhav, Aakash More, Vilas Deshmukh, Prakash Shinde, Ganesh Kale and others), quote, phone number, address, acreage, date and result in the mockups. None of these are used.
- Gallery mockup products (RootShield Pro, Bio-Boost Ultra, YieldMax Granules) and the before/after photos from unrelated organisations. Not used.
- Reference screenshots for layout only: Squarespace feature cards, the Seven Miles coffee product grid, and the Secfi story and leadership pages.
- AI-generated images: hero farmers, the anatomy illustration, the Halad Special banner, and the "Our Story" banner. Not used.

## 4. Client-authored brand copy (used, subject to approval)

- "Farming should not be a game of guesswork."
- "Better farming begins with better understanding."
- "Let's understand farming." (variants: "Let's understand the farming.")
- "Growth & Abundance" / "Farming is about growth and abundance."
- "We develop effective agricultural inputs." / "We help farmers make better decisions." / "We work for more productive farms and a better tomorrow."
- "Inputs that have a purpose."
- "Farmers who choose to understand before they decide."
- "More than a farmer. A decision-maker." / "We believe in farmers who observe, understand, ask, learn and take responsible decisions for a better future."
- Workbook: "A modern Oceania farmer, grounded in the land, driven by knowledge, responsible in action, and focused on a smarter, more sustainable future."
- The 14 anatomy lines (head for new ideas, eyes for what is happening in the field, nose for opportunities, mind for better farming decisions, ears for good advice, shoulders for responsibility, heart for the farm and family, backbone for standing by decisions, hands for getting things done, voice for sharing what is learned, legs for growing the farm, eyes on the future, feet on the ground, long view for scientific farming). These have been rewritten in gender-neutral form.
- "Let's understand your farm." / "Tell us about your crop and what you're trying to achieve."
- "Small changes. Big impact." with Soil health, Water management, Right product, Crop rotation, Sustainable farming.
- Footer tagline variants: "Premium Agri Input Solutions", "Better Crops, Brighter Future".

## 5. Conflicts found

| Topic | Versions found | Handling |
| --- | --- | --- |
| Logo | Green OCEANIA with a leaf on the I; gold brush-ring O; blue swoosh circle; green title-case script | Interim typographic wordmark until the official file arrives |
| Tagline | "Let's understand farming", "Growth & Abundance", "Premium Agri Input Solutions", "Better Crops, Brighter Future" | "Let's understand farming" leads (it appears most often); the others are held in the CMS |
| Location | Hingoli, Maharashtra (homepage mockups) vs Corporate Hub, Ahmedabad, Gujarat (contact mockup) | Not published until confirmed |
| Email | info@oceania.co.in vs info@oceaniafertilizers.com (the domain has no MX records yet) | Not published until confirmed |
| Phone | +91 98765 43210 and +91 99XXXX XXXX (both placeholders) | Not published |
| Company | A YouTube screenshot credits "Microbial Solutions Pvt Ltd Hingoli". A public listing shows a Hingoli biofertilizer and mycorrhiza maker active since 2017. | Relationship to be confirmed by the client |
| Geography | Every mockup location is in Maharashtra | Site is positioned for all of India; filters have no default state |
| Navigation | Workbook header includes "Login" | Omitted until a partner portal exists |

## 6. Missing (client to supply)

See `client-checklist.md` for the full list: logo files, verified contact details and legal entity, photography, testimonial videos with consent, demo-plot records, company story and leadership, partner programme details, specifications for WAVES and the six draft products, legal review, and service accounts.

## 7. Implementation checklist

- [x] Foundation: configs, design tokens, fonts, layout shell, UI primitives, ASCII check
- [x] Content layer: types, local seed (published and pending), repository, media credits
- [x] Temporary licensed photography with attribution; product images prepared
- [x] Homepage, reviewed at mobile and desktop widths
- [x] Products, product detail template, farmer stories, demo plots, about, gallery, partner, join, insights, contact, legal, credits, 404
- [x] Lead storage, form pipeline, notifications, Turnstile, admin (leads, newsletter list, deletion), newsletter unsubscribe
- [x] Sanity schemas, Studio, GROQ source, revalidation, draft mode, seed import. The schema validates with the Sanity CLI; the Studio, webhook, preview and import still need a real Sanity project to run against
- [x] SEO: metadata, JSON-LD, sitemap, robots, OG images, redirects, headers
- [x] Tests: unit, end-to-end, accessibility, overflow, Lighthouse (results in `verification.md`)
- [x] Handover documents: `cms-guide.md`, `deployment.md`, `verification.md`, `client-checklist.md` and the README
