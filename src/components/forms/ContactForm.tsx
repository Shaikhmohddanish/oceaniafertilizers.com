'use client';

import { contactRoleLabels, contactRoles, contactTopicLabels, contactTopics } from '@/lib/validation/labels';
import { submitContact } from '@/server/forms/actions';

import { consentLabels } from './consent';
import { CheckboxField, SelectField, TextAreaField, TextField, type Option } from './fields';
import { FormShell } from './FormShell';
import { messages, phoneInput, stateOptions } from './options';
import { usePrefillFromQuery } from './usePrefillFromQuery';

const roleOptions: Option[] = contactRoles.map((value) => ({ value, label: contactRoleLabels[value] }));
const topicOptions: Option[] = contactTopics.map((value) => ({ value, label: contactTopicLabels[value] }));

type ContactFormProps = {
  products: Option[];
  defaultTopic?: string;
  defaultProduct?: string;
  fallback?: React.ReactNode;
};

export function ContactForm({ products, defaultTopic, defaultProduct, fallback }: ContactFormProps) {
  usePrefillFromQuery('contact', { topic: 'topic', product: 'product' });
  return (
    <FormShell
      id="contact"
      serverAction={submitContact}
      analyticsName="contact"
      submitLabel="Send message"
      successTitle="Message received"
      fallback={fallback}
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <TextField name="fullName" placeholder="First name and surname" label="Full name" autoComplete="name" maxLength={100} {...messages.name} />
        <TextField name="phone" label="Mobile number" {...phoneInput} {...messages.phone} />
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
        <SelectField name="role" label="I am" options={roleOptions} placeholder="Choose one" requiredMessage="Tell us who you are." />
        <SelectField
          name="topic"
          label="My message is about"
          options={topicOptions}
          defaultValue={defaultTopic}
          requiredMessage="Choose what your message is about."
        />
        <SelectField name="state" label="State" options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" {...messages.state} />
        <TextField name="district" placeholder="For example Guntur" label="District or city" optional autoComplete="address-level2" maxLength={80} />
        {products.length > 0 ? (
          <SelectField
            name="product"
            label="Product"
            optional
            options={products}
            defaultValue={defaultProduct}
            placeholder="Not about a specific product"
            className="sm:col-span-2"
          />
        ) : null}
        <TextAreaField
          name="message" placeholder="For example: the leaves on my turmeric are turning yellow at the tips. What should I check first?"
          label="Message"
          minLength={10}
          maxLength={2000}
          requiredMessage="Write your message."
          invalidMessage="Tell us a little more, at least 10 characters."
          className="sm:col-span-2"
        />
        <CheckboxField name="consentPrivacy" label={consentLabels.privacy} {...messages.consent} className="sm:col-span-2" />
      </div>
    </FormShell>
  );
}
