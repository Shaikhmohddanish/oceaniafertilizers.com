'use client';

import type { PartnershipType } from '@/content/types';
import { experienceLabels, experienceLevels } from '@/lib/validation/labels';
import { submitPartnerApplication } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, ChoiceGroup, SelectField, TextAreaField, TextField } from './fields';
import { FormShell } from './FormShell';
import { messages, phoneInput, stateOptions } from './options';

const experienceOptions = experienceLevels.map((value) => ({ value, label: experienceLabels[value] }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-[color:var(--line-strong)] pt-8 first:border-t-0 first:pt-0">
      <legend className="type-h3 float-left mb-6 w-full text-forest-900">{title}</legend>
      <div className="clear-both grid gap-x-6 gap-y-6 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function PartnerForm({ types, fallback }: { types: PartnershipType[]; fallback?: React.ReactNode }) {
  return (
    <FormShell
      id="partner"
      serverAction={submitPartnerApplication}
      analyticsName="partner_application"
      submitLabel="Send application"
      successTitle="Application received"
      fallback={fallback}
      successExtra={
        <p className="type-small mt-6 max-w-[48ch] text-ink-700">
          Keep your reference handy. If you need to add anything, reply to our team when they contact you, or send a
          message from the contact page with your reference.
        </p>
      }
    >
      <div className="space-y-12">
        <Section title="About you">
          <TextField name="fullName" placeholder="First name and surname" label="Full name" autoComplete="name" maxLength={100} {...messages.name} />
          <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
          <TextField
            name="email" placeholder="name@example.com"
            label="Email"
            type="email"
            autoComplete="email"
            maxLength={254}
            {...messages.email}
            className="sm:col-span-2"
          />
        </Section>

        <Section title="Your business">
          <TextField
            name="businessName" placeholder="Your shop, company or group"
            label="Business or organisation name"
            autoComplete="organization"
            maxLength={120}
            requiredMessage="Enter your business or organisation name."
            className="sm:col-span-2"
          />
          <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
          <TextField name="district" placeholder="For example Indore" label="District or city" autoComplete="address-level2" maxLength={80} {...messages.district} />
          <TextField
            name="pinCode" placeholder="6-digit PIN code"
            label="PIN code"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            requiredMessage="Enter your PIN code."
            invalidMessage="Enter a 6-digit PIN code."
          />
          <TextField
            name="gstin" placeholder="For example 22AAAAA0000A1Z5"
            label="GSTIN"
            optional
            hint="15 characters, if your business is registered."
            autoCapitalize="characters"
            maxLength={15}
            spellCheck={false}
          />
        </Section>

        <Section title="The partnership">
          <ChoiceGroup
            name="partnershipType"
            type="radio"
            legend="I am interested in becoming a"
            options={types.map((type) => ({ value: type.key, label: type.title, description: type.description }))}
            columns={2}
            requiredMessage="Choose the partnership you are interested in."
            className="sm:col-span-2"
          />
          <SelectField
            name="experience"
            label="Experience with agricultural inputs"
            options={experienceOptions}
            requiredMessage="Tell us how long you have worked with agricultural inputs."
            className="sm:col-span-2"
          />
          <TextAreaField
            name="experienceSummary" placeholder="For example: we cover three talukas and mostly serve cotton and soybean growers."
            label="Tell us about your business"
            optional
            hint="For example the areas you cover, the crops your customers grow and the brands you work with."
            rows={4}
            maxLength={1000}
            className="sm:col-span-2"
          />
          <TextAreaField name="message" placeholder="Questions for us, or a good time to call you" label="Anything else" optional rows={3} maxLength={2000} className="sm:col-span-2" />
        </Section>

        <CheckboxField name="consentPrivacy" label={consentLabels.privacy} {...messages.consent} />
      </div>
    </FormShell>
  );
}
