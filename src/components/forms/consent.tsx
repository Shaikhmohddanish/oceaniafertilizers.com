import Link from 'next/link';

/* Consent wording, kept in one place so every form says the same thing. */

export function PrivacyLink() {
  return (
    <Link href="/privacy-policy" target="_blank" className="link-inline font-medium">
      privacy policy<span className="sr-only"> (opens in a new tab)</span>
    </Link>
  );
}

export const consentLabels = {
  privacy: (
    <>
      I have read the <PrivacyLink /> and agree that Oceania may use these details to respond to me.
    </>
  ),
  contactAboutEnquiry: (
    <>
      Oceania may contact me by phone about this enquiry. I have read the <PrivacyLink />.
    </>
  ),
  contactAboutCommunity: (
    <>
      Oceania may contact me by phone about the farmer community. I have read the <PrivacyLink />.
    </>
  ),
  whatsapp: <>Send me occasional updates on WhatsApp. You can stop them at any time.</>,
};
