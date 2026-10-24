'use client';

import type { Crop } from '@/content/types';
import { farmerInterestLabels, farmerInterests } from '@/lib/validation/labels';
import { submitFarmerRegistration } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, ChoiceGroup, SelectField, TextField } from './fields';
import { FormShell } from './FormShell';
import { acresInput, cropOptions, messages, phoneInput, stateOptions } from './options';
import { usePrefillFromQuery } from './usePrefillFromQuery';

const interestOptions = farmerInterests.map((value) => ({ value, label: farmerInterestLabels[value] }));

export function FarmerForm({
  crops,
  defaultInterests = [],
  fallback,
}: {
  crops: Crop[];
  defaultInterests?: string[];
  fallback?: React.ReactNode;
}) {
  usePrefillFromQuery('join', { interest: 'interests' });
  return (
    <FormShell
      id="join"
      serverAction={submitFarmerRegistration}
      analyticsName="farmer_registration"
      submitLabel="Join the community"
      successTitle="Welcome to Oceania"
      fallback={fallback}
      successExtra={
        <p className="type-small mt-6 max-w-[48ch] text-ink-700">
          We will only contact you in the ways you agreed to. You can ask us to stop at any time.
        </p>
      }
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <TextField name="fullName" placeholder="First name and surname" label="Your name" autoComplete="name" maxLength={100} {...messages.name} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <TextField
          name="district" placeholder="For example Sangli"
          label="District or village"
          autoComplete="address-level2"
          maxLength={80}
          requiredMessage="Enter your district or village."
        />
        <SelectField name="crop" label="Main crop" options={cropOptions(crops)} placeholder="Choose a crop" {...messages.crop} />
        <TextField name="farmSize" label="Farm size in acres" optional {...acresInput} {...messages.acres} />
        <ChoiceGroup
          name="interests"
          type="checkbox"
          legend="I would like"
          optional
          options={interestOptions}
          defaultValues={defaultInterests}
          columns={2}
          className="sm:col-span-2"
        />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutCommunity} {...messages.consent} className="sm:col-span-2" />
        <CheckboxField name="consentWhatsapp" label={consentLabels.whatsapp} optional className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
