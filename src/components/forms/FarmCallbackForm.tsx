'use client';

import type { Crop } from '@/content/types';
import { submitFarmCallback } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, SelectField, TextField, type Option } from './fields';
import { FormShell } from './FormShell';
import { acresInput, cropOptions, messages, phoneInput, stateOptions } from './options';
import { usePrefillFromQuery } from './usePrefillFromQuery';

/**
 * Crop advice: "Let's understand your farm" on the homepage, and the form on
 * /advice. With products, it offers an optional product, prefilled from ?product=.
 */
export function FarmCallbackForm({
  crops,
  products,
  id = 'farm-callback',
  fallback,
}: {
  crops: Crop[];
  products?: Option[];
  id?: string;
  fallback?: React.ReactNode;
}) {
  usePrefillFromQuery(id, { product: 'product' });
  return (
    <FormShell
      id={id}
      serverAction={submitFarmCallback}
      analyticsName="farm_callback"
      submitLabel="Ask for a call back"
      successTitle="We will call you"
      fallback={fallback}
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <TextField name="fullName" placeholder="First name and surname" label="Your name" autoComplete="name" maxLength={100} {...messages.name} className="sm:col-span-2" />
        <TextField
          name="location"
          placeholder="Where your farm is"
          label="Village or town"
          autoComplete="address-level2"
          maxLength={100}
          requiredMessage="Enter your village or town."
        />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <SelectField name="crop" label="Main crop" options={cropOptions(crops)} placeholder="Choose a crop" {...messages.crop} />
        <TextField name="area" label="Area in acres" optional {...acresInput} {...messages.acres} />
        {products && products.length > 0 ? (
          <SelectField name="product" label="Product" optional options={products} placeholder="Not about a specific product" className="sm:col-span-2" />
        ) : null}
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} className="sm:col-span-2" />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutEnquiry} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
