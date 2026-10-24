'use client';

import type { Crop } from '@/content/types';
import { submitFarmCallback } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, SelectField, TextField } from './fields';
import { FormShell } from './FormShell';
import { acresInput, cropOptions, messages, phoneInput, stateOptions } from './options';

/** The short "Let's understand your farm" form on the homepage. */
export function FarmCallbackForm({ crops, fallback }: { crops: Crop[]; fallback?: React.ReactNode }) {
  return (
    <FormShell
      id="farm-callback"
      serverAction={submitFarmCallback}
      analyticsName="farm_callback"
      submitLabel="Talk to Oceania"
      successTitle="We will call you"
      fallback={fallback}
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <TextField name="fullName" placeholder="First name and surname" label="Your name" autoComplete="name" maxLength={100} {...messages.name} className="sm:col-span-2" />
        <TextField
          name="location" placeholder="Where your farm is"
          label="Village or town"
          autoComplete="address-level2"
          maxLength={100}
          requiredMessage="Enter your village or town."
        />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <SelectField name="crop" label="Main crop" options={cropOptions(crops)} placeholder="Choose a crop" {...messages.crop} />
        <TextField name="area" label="Area in acres" optional {...acresInput} {...messages.acres} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} className="sm:col-span-2" />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutEnquiry} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
