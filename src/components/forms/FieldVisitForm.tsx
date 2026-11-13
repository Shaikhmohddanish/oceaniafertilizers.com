'use client';

import type { Crop } from '@/content/types';
import { visitTypeLabels, visitTypes } from '@/lib/validation/labels';
import { submitFieldVisit } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, ChoiceGroup, SelectField, TextField } from './fields';
import { FormShell } from './FormShell';
import { acresInput, cropOptions, messages, phoneInput, stateOptions } from './options';

const visitOptions = visitTypes.map((value) => ({ value, label: visitTypeLabels[value] }));

/** Book a field visit: a visit from the team, a demo on the farm, or a visit to a demo plot nearby. */
export function FieldVisitForm({ crops, fallback }: { crops: Crop[]; fallback?: React.ReactNode }) {
  return (
    <FormShell
      id="field-visit"
      serverAction={submitFieldVisit}
      analyticsName="field_visit"
      submitLabel="Book a field visit"
      successTitle="Visit request received"
      fallback={fallback}
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <ChoiceGroup
          name="visitType"
          legend="I would like"
          type="radio"
          options={visitOptions}
          requiredMessage="Choose what you would like."
          className="sm:col-span-2"
        />
        <TextField name="fullName" placeholder="First name and surname" label="Full name" autoComplete="name" maxLength={100} {...messages.name} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <TextField name="district" placeholder="For example Sangli" label="District" autoComplete="address-level2" maxLength={80} {...messages.district} />
        <TextField name="location" placeholder="Where your farm is" label="Village or town" maxLength={100} requiredMessage="Enter your village or town." />
        <SelectField name="crop" label="Main crop" options={cropOptions(crops)} placeholder="Choose a crop" {...messages.crop} />
        <TextField name="area" label="Area in acres" optional {...acresInput} {...messages.acres} />
        <TextField name="preferredTime" label="When suits you" optional maxLength={80} placeholder="For example: after the first week of December" />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutVisit} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
