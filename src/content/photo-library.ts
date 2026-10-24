import type { StaticImageData } from 'next/image';

import broadcastSunset from '@/assets/photos/broadcast-sunset.jpg';
import cottonRaichur from '@/assets/photos/cotton-raichur.jpg';
import cottonRamanathapuram from '@/assets/photos/cotton-ramanathapuram.jpg';
import dripKerala from '@/assets/photos/drip-kerala.jpg';
import groundnutSprinkler from '@/assets/photos/groundnut-sprinkler.jpg';
import mustardWheatPath from '@/assets/photos/mustard-wheat-path.jpg';
import paddyEluru from '@/assets/photos/paddy-eluru.jpg';
import paddySunsetNadia from '@/assets/photos/paddy-sunset-nadia.jpg';
import paddyThrissur from '@/assets/photos/paddy-thrissur.jpg';
import pearlMillet from '@/assets/photos/pearl-millet.jpg';
import redSoil from '@/assets/photos/red-soil.jpg';
import sowingRaichur from '@/assets/photos/sowing-raichur.jpg';
import sugarcaneWesternGhats from '@/assets/photos/sugarcane-western-ghats.jpg';
import sunderbansPaddy from '@/assets/photos/sunderbans-paddy.jpg';
import turmericBlackSoil from '@/assets/photos/turmeric-black-soil.jpg';
import turmericChamarajanagar from '@/assets/photos/turmeric-chamarajanagar.jpg';
import turmericLeaves from '@/assets/photos/turmeric-leaves.jpg';
import wheatPunjab from '@/assets/photos/wheat-punjab.jpg';

export type PhotoCredit = {
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

export type LibraryPhoto = {
  image: StaticImageData;
  alt: string;
  caption: string;
  region: string;
  credit: PhotoCredit;
  /** Temporary licensed imagery, to be replaced by commissioned photography. */
  temporary: true;
};

const BY_SA_4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const BY_SA_3 = { license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' };
const BY_SA_2 = { license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' };
const BY_4 = { license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' };
const BY_2 = { license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' };
const CC0 = { license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const photoLibrary = {
  'paddy-eluru': {
    image: paddyEluru,
    alt: 'Young paddy crop stretching to the horizon at sunrise, with two lone trees on the skyline.',
    caption: 'Paddy fields at sunrise near Eluru, West Godavari, Andhra Pradesh.',
    region: 'Andhra Pradesh',
    credit: { author: 'iMahesh', sourceUrl: commons('Paddy_Fields_near_Eluru.jpg'), ...BY_SA_4 },
    temporary: true,
  },
  'sunderbans-paddy': {
    image: sunderbansPaddy,
    alt: 'Green paddy beside a still pond under a hazy morning sun.',
    caption: 'Paddy and pond, Satjelia village, Sundarbans, West Bengal.',
    region: 'West Bengal',
    credit: {
      author: 'Ankur P',
      sourceUrl: commons('Satjelia_Village_(Sunderbans)_(38294973672).jpg'),
      ...BY_2,
    },
    temporary: true,
  },
  'turmeric-black-soil': {
    image: turmericBlackSoil,
    alt: 'Young turmeric shoots coming up in rows of dark soil.',
    caption: 'Turmeric shoots in black soil, Jamthi Khurd, Hingoli district, Maharashtra.',
    region: 'Maharashtra',
    credit: { author: 'Albert Deccan', sourceUrl: commons('Turmeric_farm.jpg'), ...BY_SA_3 },
    temporary: true,
  },
  'turmeric-leaves': {
    image: turmericLeaves,
    alt: 'Broad turmeric leaves lit from behind by low sun.',
    caption: 'Turmeric field, Salem district, Tamil Nadu.',
    region: 'Tamil Nadu',
    credit: {
      author: 'Thamizhpparithi Maari',
      sourceUrl: commons('%22amazing_Turmeric_field%22.jpg'),
      ...BY_SA_3,
    },
    temporary: true,
  },
  'turmeric-chamarajanagar': {
    image: turmericChamarajanagar,
    alt: 'A dense turmeric crop with coconut palms behind it.',
    caption: 'Turmeric farm, Chamarajanagar district, Karnataka.',
    region: 'Karnataka',
    credit: {
      author: 'T. R. Shankar Raman',
      sourceUrl: commons('Turmeric_farm_in_Chamarajanagar_District_IMG20170828084158.jpg'),
      ...BY_SA_3,
    },
    temporary: true,
  },
  'sugarcane-western-ghats': {
    image: sugarcaneWesternGhats,
    alt: 'Sugarcane fields edged by trees, with the hills of the Western Ghats behind.',
    caption: 'Sugarcane fields, Chafawade village, Western Ghats, Maharashtra.',
    region: 'Maharashtra',
    credit: {
      author: 'akshaybapat4',
      sourceUrl: commons('Trees_and_sugarcane_fields,_Western_Ghats,_Maharashtra_(2013).jpg'),
      ...BY_SA_4,
    },
    temporary: true,
  },
  'wheat-punjab': {
    image: wheatPunjab,
    alt: 'Ears of wheat in close focus against a soft background.',
    caption: 'Wheat, Punjab.',
    region: 'Punjab',
    credit: { author: 'Satpal Dandiwal', sourceUrl: commons('Wheat_in_Punjab,_India.jpg'), ...BY_SA_4 },
    temporary: true,
  },
  'mustard-wheat-path': {
    image: mustardWheatPath,
    alt: 'A narrow earth path between flowering mustard and green wheat.',
    caption: 'Mustard and wheat, Aloona Tola, Ludhiana district, Punjab.',
    region: 'Punjab',
    credit: {
      author: 'D.aspis9394',
      sourceUrl: commons('Aloona_Tola_(mustard_in_wheat_field_).JPG'),
      ...BY_SA_3,
    },
    temporary: true,
  },
  'cotton-raichur': {
    image: cottonRaichur,
    alt: 'Open cotton bolls on a plant, with the rest of the field in soft focus.',
    caption: 'Cotton ready for picking, Raichur, Karnataka, December 2024.',
    region: 'Karnataka',
    credit: {
      author: 'Nabina Chakraborty, WELL Labs',
      sourceUrl: commons('Closeup_image_of_a_cotton_field_in_Raichur_Karnataka.jpg'),
      ...BY_SA_4,
    },
    temporary: true,
  },
  'cotton-ramanathapuram': {
    image: cottonRamanathapuram,
    alt: 'A single open cotton boll among green leaves.',
    caption: 'Cotton, Ramanathapuram, Tamil Nadu.',
    region: 'Tamil Nadu',
    credit: {
      author: 'Karthik Jeyaraman',
      sourceUrl: commons('Cotton_plants,_cotton_fields_of_Ramanathapuram_Tamilnadu.jpg'),
      ...BY_4,
    },
    temporary: true,
  },
  'groundnut-sprinkler': {
    image: groundnutSprinkler,
    alt: 'A sprinkler watering a groundnut field in evening light, with palms on the horizon.',
    caption: 'Groundnut under sprinkler irrigation in the evening.',
    region: 'India',
    credit: { author: 'Deepan Raja M', sourceUrl: commons('Groundnut_field.jpg'), ...BY_SA_4 },
    temporary: true,
  },
  'sowing-raichur': {
    image: sowingRaichur,
    alt: 'Farmers sowing behind a bullock-drawn plough, seen from the waist down, feet in freshly turned soil.',
    caption: 'Sowing groundnut and black-eyed peas behind a bullock plough, Raichur district, Karnataka.',
    region: 'Karnataka',
    credit: {
      author: 'Nanditha Gogate, WELL Labs',
      sourceUrl: commons('Manual_tilling_and_sowing_in_Raichur,_Karnataka.jpg'),
      ...BY_SA_4,
    },
    temporary: true,
  },
  'pearl-millet': {
    image: pearlMillet,
    alt: 'Heads of pearl millet standing in a field.',
    caption: 'Pearl millet (bajra).',
    region: 'India',
    credit: { author: 'Dinesh Valke', sourceUrl: commons('Pennisetum_glaucum_(4657009324).jpg'), ...BY_SA_2 },
    temporary: true,
  },
  'paddy-thrissur': {
    image: paddyThrissur,
    alt: 'Paddy turning gold, seen close up.',
    caption: 'Paddy at Eravathour, Thrissur, Kerala.',
    region: 'Kerala',
    credit: {
      author: 'Augustus Binu',
      sourceUrl: commons('Paddy_Field_at_Eravathour_Thrissur.jpg'),
      ...BY_SA_3,
    },
    temporary: true,
  },
  'paddy-sunset-nadia': {
    image: paddySunsetNadia,
    alt: 'Newly transplanted paddy seedlings in a flooded field at sunset, with palms on the horizon.',
    caption: 'New paddy plantation at sunset, Ruppur village, Nadia district, West Bengal.',
    region: 'West Bengal',
    credit: {
      author: 'Abhijit Kar Gupta',
      sourceUrl: commons('End_of_Winter._New_plantation._Paddy_field._Sunset_(16527970625).jpg'),
      ...BY_2,
    },
    temporary: true,
  },
  'drip-kerala': {
    image: dripKerala,
    alt: 'Drip lines and valves running between vegetable rows trained on bamboo.',
    caption: 'Drip irrigation, Cherthala, Kerala.',
    region: 'Kerala',
    credit: { author: 'Vis M', sourceUrl: commons('Drip_irrigation_in_Kerala.jpg'), ...BY_SA_4 },
    temporary: true,
  },
  'broadcast-sunset': {
    image: broadcastSunset,
    alt: 'Silhouette of a farmer standing in a flooded field at sunset, broadcasting by hand.',
    caption: 'Broadcasting by hand at sunset, Tamil Nadu.',
    region: 'Tamil Nadu',
    credit: { author: 'Guru Ethic', sourceUrl: commons('Sunsets_with_farmer.jpg'), ...CC0 },
    temporary: true,
  },
  'red-soil': {
    image: redSoil,
    alt: 'Spinach leaves in close focus with a bank of red soil behind.',
    caption: 'Spinach in red soil.',
    region: 'India',
    credit: { author: 'Cut angles', sourceUrl: commons('Red_soil_spinach.jpg'), ...BY_SA_4 },
    temporary: true,
  },
} satisfies Record<string, LibraryPhoto>;

export type PhotoId = keyof typeof photoLibrary;
