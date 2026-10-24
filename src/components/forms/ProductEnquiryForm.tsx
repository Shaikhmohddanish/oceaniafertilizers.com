'use client';

import type { Crop } from '@/content/types';
import { submitProductEnquiry } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, SelectField, TextAreaField, TextField } from './fields';
import { FormShell } from './FormShell';
import { acresInput, cropOptions, messages, phoneInput, stateOptions } from './options';

export function ProductEnquiryForm({
  product,
  crops,
  fallback,
}: {
  product: { slug: string; name: string };
  crops: Crop[];
  fallback?: React.ReactNode;
}) {
  return (
    <FormShell
      id={`enquiry-${product.slug}`}
      serverAction={submitProductEnquiry}
      analyticsName="product_enquiry"
      submitLabel={`Enquire about ${product.name}`}
      successTitle="Enquiry received"
      fallback={fallback}
    >
      <input type="hidden" name="product" value={product.slug} />
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <TextField name="fullName" placeholder="First name and surname" label="Full name" autoComplete="name" maxLength={100} {...messages.name} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <TextField name="district" placeholder="For example Erode" label="District or city" autoComplete="address-level2" maxLength={80} {...messages.district} />
        <SelectField name="crop" label="Crop" optional options={cropOptions(crops)} placeholder="Choose a crop" />
        <TextField name="area" label="Area in acres" optional {...acresInput} {...messages.acres} />
        <TextField
          name="email" placeholder="name@example.com"
          label="Email"
          type="email"
          autoComplete="email"
          optional
          maxLength={254}
          {...messages.email}
          className="sm:col-span-2"
        />
        <TextAreaField name="message" placeholder={`For example: how much ${product.name} should I use on 2 acres?`} label="Your question" optional rows={4} maxLength={1000} className="sm:col-span-2" />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutEnquiry} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
