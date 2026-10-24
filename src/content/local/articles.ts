import { readingMinutes } from '../text';
import type { Article } from '../types';

import { photo } from './media';
import { rt } from './rich-text';
import { articleCategories } from './taxonomy';

/*
 * Starter articles, written from cited public sources and kept general.
 * All three are pending until an agronomist reviews them, so they never
 * render in production until approved and published in the CMS.
 */

const author = { name: 'Oceania Fertilizers' };
const UPDATED = '2026-10-24';

type ArticleSeed = Omit<Article, 'readingMinutes'>;

const soilHealthCard: ArticleSeed = {
  id: 'article-soil-health-card',
  status: 'pending',
  slug: 'how-to-read-your-soil-health-card',
  title: 'How to read your Soil Health Card',
  excerpt:
    'The Soil Health Card reports on 12 measures of your soil. Here is what each group of results tells you, and how to use the card when you plan inputs.',
  standfirst:
    'A soil test is the most reliable place to start any input decision. The Soil Health Card puts the results on one page. Here is how to read it.',
  cover: photo('red-soil'),
  categories: [articleCategories.soilHealth],
  author,
  body: rt.doc(
    rt.p(
      "A Soil Health Card is a printed report on the condition of the soil in your field. It is issued under the Government of India's Soil Health Card scheme, which tests soil samples collected from farmers' fields and records the results on 12 parameters. The card also carries recommendations on fertiliser doses and soil amendments based on those results.",
    ),
    rt.h2('The 12 parameters, in four groups'),
    rt.bullets([
      '**Macronutrients:** nitrogen (N), phosphorus (P) and potassium (K). Crops need these in the largest amounts.',
      '**Secondary nutrient:** sulphur (S).',
      '**Micronutrients:** zinc (Zn), iron (Fe), copper (Cu), manganese (Mn) and boron (B). Crops need these in small amounts, but a shortage of any one can hold a crop back.',
      '**Physical and chemical parameters:** pH, electrical conductivity (EC) and organic carbon (OC).',
    ]),
    rt.h2('What the last three tell you'),
    rt.p(
      '**pH** shows how acidic or alkaline the soil is. It matters because it affects how available many nutrients are to the crop.',
    ),
    rt.p(
      '**Electrical conductivity (EC)** is an indicator of the salts dissolved in the soil. High values point to salinity, which makes it harder for crops to take up water.',
    ),
    rt.p(
      "**Organic carbon (OC)** is a measure of the soil's organic matter. Soils with more organic matter generally hold water and nutrients better.",
    ),
    rt.h2('Using the card when you plan inputs'),
    rt.numbered([
      'Read the nutrient results first and note which ones the card shows as low.',
      'Compare the recommended fertiliser doses on the card with what you usually apply.',
      'Check pH and EC before blaming a nutrient. A soil with a pH problem or high salts may not respond to more fertiliser.',
      'Add micronutrients where the card shows a need, rather than by habit.',
      'Keep your cards. Comparing one test with the next shows whether your soil is improving.',
    ]),
    rt.callout(
      'note',
      'The Soil Health Card portal is at soilhealth.dac.gov.in. Your local agriculture office or Krishi Vigyan Kendra can tell you how soil sampling works in your area.',
      'Getting your soil tested',
    ),
    rt.p(
      'If you would like to talk through your card and your input plan with our team, [get in touch](/contact).',
    ),
  ),
  sources: [
    {
      title: 'Soil Health Card',
      publisher: 'National Portal of India',
      url: 'https://www.india.gov.in/spotlight/soil-health-card',
    },
    {
      title: 'Soil Health Card scheme factsheet',
      publisher: 'Press Information Bureau, Government of India',
      url: 'https://www.pib.gov.in/FactsheetDetails.aspx?Id=148602',
    },
    {
      title: 'Soil Health Card portal',
      publisher: 'Department of Agriculture and Farmers Welfare',
      url: 'https://soilhealth.dac.gov.in/',
    },
  ],
  relatedProductSlugs: [],
  relatedArticleSlugs: ['what-mycorrhizal-fungi-do-for-crop-roots'],
  updatedAt: UPDATED,
  seo: {
    title: 'How to read your Soil Health Card: the 12 parameters explained',
    description:
      'What the 12 parameters on a Soil Health Card mean, from N, P and K to pH, EC and organic carbon, and how to use the card when you plan inputs.',
  },
};

const mycorrhiza: ArticleSeed = {
  id: 'article-mycorrhiza',
  status: 'pending',
  slug: 'what-mycorrhizal-fungi-do-for-crop-roots',
  title: 'What mycorrhizal fungi do for crop roots',
  excerpt:
    'Most crops form a partnership with soil fungi that extend their reach for nutrients. How the partnership works, and what to keep in mind when you use a mycorrhizal biofertilizer.',
  standfirst:
    'The roots you can see are not the whole story. Many crops share their root zone with fungi that reach much further into the soil.',
  cover: photo('turmeric-black-soil'),
  categories: [articleCategories.biologicalInputs, articleCategories.cropNutrition],
  author,
  body: rt.doc(
    rt.p(
      'Many crop plants form a partnership with arbuscular mycorrhizal (AM) fungi, which live in and around their roots. The plant supplies the fungi with sugars. In return, the fungi grow fine threads, called hyphae, out into the soil and gather nutrients the roots cannot easily reach.',
    ),
    rt.h2('Why it matters for phosphorus'),
    rt.p(
      'Phosphorus moves very little in soil. As a root takes it up, a zone forms around the root where phosphorus runs short. Research on AM fungi shows that their hyphal network can extend this zone, drawing phosphate from up to several centimetres from the root surface, further than the root reaches on its own.',
    ),
    rt.h2('Crops that do not form the partnership'),
    rt.p(
      'Not every crop is a host. The mustard and cabbage family (Brassicaceae), which includes mustard, cabbage and cauliflower, does not form this association. A mycorrhizal product will not work for these crops in the same way, so check the crop before you apply one.',
    ),
    rt.h2('Using a mycorrhizal biofertilizer well'),
    rt.bullets([
      '**Follow the label.** Dose, method and timing differ from product to product.',
      '**Place it where the roots are.** The fungi have to meet living roots to form the partnership.',
      '**Treat it as a living product.** Store it as the label directs and use it before the expiry date.',
      '**Ask before mixing.** Check before combining a biological product with fungicides or other chemicals.',
      '**Keep testing your soil.** If a nutrient is seriously short, the soil still needs correcting.',
    ]),
    rt.callout(
      'caution',
      'The benefit from mycorrhizal fungi depends on the soil, the crop, the fungi already present in the field and how the crop is managed. Results seen on one farm will not always repeat on another.',
      'A note on results',
    ),
    rt.product(
      'waves-mycorrhizal-biofertilizer',
      'WAVES',
      'Mycorrhizal biofertilizer, supplied in a 300 gm pouch. Ask our team whether it suits your crop.',
    ),
  ),
  sources: [
    {
      title:
        'Roles of arbuscular mycorrhizas in plant phosphorus nutrition (Smith, Jakobsen, Gronlund and Smith, Plant Physiology 156(3), 2011)',
      publisher: 'American Society of Plant Biologists',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3135927/',
    },
  ],
  relatedProductSlugs: ['waves-mycorrhizal-biofertilizer'],
  relatedArticleSlugs: ['how-to-read-your-soil-health-card', 'fertigation-feeding-crops-through-the-drip-line'],
  updatedAt: UPDATED,
  seo: {
    title: 'What mycorrhizal fungi do for crop roots',
    description:
      'How arbuscular mycorrhizal fungi help crops reach phosphorus, which crops do not form the partnership, and how to use a mycorrhizal biofertilizer well.',
  },
};

const fertigation: ArticleSeed = {
  id: 'article-fertigation',
  status: 'pending',
  slug: 'fertigation-feeding-crops-through-the-drip-line',
  title: 'Fertigation: feeding crops through the drip line',
  excerpt:
    'Fertigation delivers nutrients with irrigation water, straight to the root zone. Done well it saves effort and fertiliser. Done carelessly it blocks emitters. The basics.',
  standfirst:
    'Putting inputs through a drip system is one of the most precise ways to feed a crop, as long as the system and the products are treated with care.',
  cover: photo('drip-kerala'),
  categories: [articleCategories.waterManagement, articleCategories.cropNutrition],
  author,
  body: rt.doc(
    rt.p(
      'Fertigation means applying fertilisers and other water-soluble inputs through the irrigation system, usually drip. The input is dissolved, injected into the line and carried with the water to the root zone.',
    ),
    rt.h2('Why farmers use it'),
    rt.bullets([
      'Nutrients arrive in the root zone, where the crop takes them up.',
      'Doses can be split across the season instead of applied all at once.',
      'It saves the labour of spreading inputs by hand.',
    ]),
    rt.h2('What can go wrong'),
    rt.p(
      'The main risk is blockage. Drip emitters have very small openings. Once they are clogged with undissolved fertiliser or deposits, they can be difficult or impossible to clear.',
    ),
    rt.p(
      'Some inputs react with each other, or with the minerals in hard water, to form solids. Phosphate fertilisers are the best-known example: mixed into water that is high in calcium or magnesium, they can form insoluble calcium phosphate that clogs the system.',
    ),
    rt.h2('Good practice'),
    rt.numbered([
      '**Use only fully water-soluble products** made for fertigation. Fertilisers that do not dissolve completely, such as single super phosphate, are not suitable.',
      '**Know your water.** Hard or alkaline water makes deposits more likely. A water test helps you plan.',
      '**Keep incompatible products apart.** Do not mix calcium products with phosphate or sulphate products. Inject them separately, from separate tanks.',
      '**Run clean water before and after.** Let the system reach its normal pressure before injecting, and flush the lines afterwards so no input is left in the pipes.',
      '**Look after filters and laterals.** Clean filters and flush the lines regularly.',
      '**Read the label** of every product before putting it through a drip system.',
    ]),
    rt.product(
      'halad-special',
      'Halad Special',
      'Bio-stimulant applied through drenching or drip irrigation at 5 litres per acre.',
    ),
  ),
  sources: [
    {
      title: 'Agriculture FAQs: irrigation management',
      publisher: 'TNAU Agritech Portal, Tamil Nadu Agricultural University',
      url: 'https://agritech.tnau.ac.in/agriculture/agri_faqs_irrigationmgt.html',
    },
    {
      title: 'Chemigation: chemicals and compatibility (Information sheet 5.6)',
      publisher: 'South African Sugarcane Research Institute',
      url: 'https://sasri.org.za/wp-content/uploads/Information_Sheets/IS_5.6-Irrig-Chemigation-chemicals.pdf',
    },
    {
      title: 'Fertigation: the basics of injecting fertilizer for field-grown tomatoes',
      publisher: 'Mississippi State University Extension',
      url: 'https://extension.msstate.edu/publications/fertigation-the-basics-injecting-fertilizer-for-field-grown-tomatoes',
    },
    {
      title: 'Fertigation in drip systems, part 1',
      publisher: 'Extension AUS',
      url: 'https://extensionaus.com.au/irrigatingag/fertigation-in-drip-systems-part-1/',
    },
  ],
  relatedProductSlugs: ['halad-special'],
  relatedArticleSlugs: ['how-to-read-your-soil-health-card'],
  updatedAt: UPDATED,
  seo: {
    title: 'Fertigation basics: feeding crops through the drip line',
    description:
      'What fertigation is, why farmers use it, how emitters get blocked and the good practice that keeps a drip system working: soluble inputs, compatibility, flushing.',
  },
};

export const articles: Article[] = [soilHealthCard, mycorrhiza, fertigation].map((article) => ({
  ...article,
  readingMinutes: readingMinutes(article.body),
}));
