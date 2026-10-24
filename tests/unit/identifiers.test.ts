import { describe, expect, it } from 'vitest';

import { gstinCheckCharacter, isValidGstin, isValidPinCode, normaliseIndianMobile } from '@/lib/india/identifiers';
import { isIndianRegion, STATES_AND_UNION_TERRITORIES } from '@/lib/india/states';

describe('normaliseIndianMobile', () => {
  it.each([
    ['98765 43210', '+919876543210'],
    ['9876543210', '+919876543210'],
    ['09876543210', '+919876543210'],
    ['+91 98765-43210', '+919876543210'],
    ['91 6000000000', '+916000000000'],
  ])('accepts %s', (input, expected) => {
    expect(normaliseIndianMobile(input)).toBe(expected);
  });

  it.each(['5876543210', '98765', '98765432101', 'abcdefghij', '', '+44 7700 900123'])('rejects %s', (input) => {
    expect(normaliseIndianMobile(input)).toBeNull();
  });
});

describe('isValidPinCode', () => {
  it('accepts six digits that do not start with zero', () => {
    expect(isValidPinCode('431513')).toBe(true);
    expect(isValidPinCode(' 560001 ')).toBe(true);
  });

  it('rejects other values', () => {
    expect(isValidPinCode('031513')).toBe(false);
    expect(isValidPinCode('43151')).toBe(false);
    expect(isValidPinCode('4315130')).toBe(false);
    expect(isValidPinCode('43A513')).toBe(false);
  });
});

describe('GSTIN', () => {
  const first14 = '27ABCDE1234F1Z';
  const valid = `${first14}${gstinCheckCharacter(first14)}`;

  it('accepts a GSTIN with the correct check character', () => {
    expect(isValidGstin(valid)).toBe(true);
    expect(isValidGstin(valid.toLowerCase())).toBe(true);
  });

  it('rejects a wrong check character', () => {
    const wrong = valid.slice(0, 14) + (valid[14] === 'A' ? 'B' : 'A');
    expect(isValidGstin(wrong)).toBe(false);
  });

  it('rejects bad formats and state codes', () => {
    expect(isValidGstin('27ABCDE1234F1Y5')).toBe(false); // 14th character must be Z
    expect(isValidGstin('ABCDE1234F1Z5')).toBe(false);
    const badState = `00ABCDE1234F1Z`;
    expect(isValidGstin(`${badState}${gstinCheckCharacter(badState)}`)).toBe(false);
  });
});

describe('states and union territories', () => {
  it('lists 28 states and 8 union territories', () => {
    expect(STATES_AND_UNION_TERRITORIES).toHaveLength(36);
    expect(isIndianRegion('Tamil Nadu')).toBe(true);
    expect(isIndianRegion('Ladakh')).toBe(true);
    expect(isIndianRegion('Tamilnadu')).toBe(false);
  });
});
