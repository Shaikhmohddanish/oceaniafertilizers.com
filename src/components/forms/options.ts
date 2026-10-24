import type { Crop } from '@/content/types';
import { STATES_AND_UNION_TERRITORIES } from '@/lib/india/states';

import type { Option } from './fields';

export const stateOptions: Option[] = STATES_AND_UNION_TERRITORIES.map((name) => ({ value: name, label: name }));

/** Crops are stored by their readable name so lead records read naturally. */
export function cropOptions(crops: Crop[]): Option[] {
  return crops.map((crop) => ({ value: crop.title, label: crop.title }));
}

export const messages = {
  name: { requiredMessage: 'Enter your full name.' },
  phone: {
    requiredMessage: 'Enter your mobile number.',
    invalidMessage: 'Enter a 10-digit Indian mobile number.',
  },
  email: {
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter a valid email address, for example name@example.com.',
  },
  state: { requiredMessage: 'Choose your state or union territory.' },
  district: { requiredMessage: 'Enter your district or city.' },
  crop: { requiredMessage: 'Choose your main crop.' },
  acres: { invalidMessage: 'Enter the area in acres, for example 2.5.' },
  consent: { requiredMessage: 'Please confirm to continue.' },
};

/** Shared input attributes for an Indian mobile number. */
export const phoneInput = {
  type: 'tel',
  inputMode: 'tel',
  autoComplete: 'tel-national',
  placeholder: '10-digit mobile number',
  // Browsers compile pattern with the v flag, so the hyphen in a class is escaped.
  pattern: '(\\+?91[\\s\\-]?|0)?[6-9][0-9]{4}[\\s\\-]?[0-9]{5}',
  maxLength: 16,
} as const;

export const acresInput = {
  type: 'number',
  inputMode: 'decimal',
  min: 0.1,
  max: 100000,
  step: 'any',
  placeholder: 'For example 2.5',
} as const;
