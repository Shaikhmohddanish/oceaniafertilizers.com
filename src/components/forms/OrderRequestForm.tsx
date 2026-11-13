'use client';

import { ContactActions } from '@/components/contact/ContactActions';
import type { SiteSettings } from '@/content/types';
import { submitOrderRequest } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, SelectField, TextAreaField, TextField } from './fields';
import { FormShell } from './FormShell';
import { messages, phoneInput, stateOptions } from './options';

/**
 * Direct ordering as an order request: the farmer chooses the pack and how
 * many, and the team calls to confirm the price and delivery. No payment online.
 */
export function OrderRequestForm({
  product,
  contact,
  fallback,
}: {
  product: { slug: string; name: string; packSizes: string[] };
  contact: SiteSettings['contact'];
  fallback?: React.ReactNode;
}) {
  const packOptions = product.packSizes.map((pack) => ({ value: pack, label: pack }));
  const onlyPack = packOptions.length === 1 ? packOptions[0]?.value : undefined;

  return (
    <FormShell
      id={`order-${product.slug}`}
      serverAction={submitOrderRequest}
      analyticsName="order_request"
      submitLabel="Send order request"
      successTitle="Order request received"
      fallback={fallback}
      successExtra={(state) => (
        <ContactActions
          contact={contact}
          place="order_success"
          whatsappMessage={`Hello Oceania, I sent an order request for ${product.name}. My reference is ${state.reference ?? ''}.`}
          className="mt-6"
        />
      )}
    >
      <input type="hidden" name="product" value={product.slug} />
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <SelectField name="pack" label="Pack" options={packOptions} defaultValue={onlyPack} placeholder="Choose a pack" requiredMessage="Choose a pack size." />
        <TextField
          name="quantity"
          label="Number of packs"
          type="number"
          inputMode="numeric"
          min={1}
          max={999}
          step={1}
          placeholder="For example 2"
          requiredMessage="Enter how many packs you need."
          invalidMessage="Enter a whole number from 1 to 999."
        />
        <TextField name="fullName" placeholder="First name and surname" label="Full name" autoComplete="name" maxLength={100} {...messages.name} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <TextField
          name="district"
          label="Village, town or district"
          placeholder="Where we should deliver"
          autoComplete="address-level2"
          maxLength={100}
          requiredMessage="Enter your village, town or district."
        />
        <TextField
          name="pinCode"
          label="PIN code"
          optional
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[1-9][0-9]{5}"
          maxLength={6}
          placeholder="6-digit PIN code"
          invalidMessage="Enter a 6-digit PIN code."
        />
        <TextAreaField
          name="notes"
          label="Notes"
          optional
          rows={3}
          maxLength={1000}
          placeholder="For example: deliver near the market, or a question about the dose."
          className="sm:col-span-2"
        />
        <CheckboxField name="consentContact" label={consentLabels.contactAboutOrder} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
