import { businessInfo } from "@/features/marketing/business-info";

/**
 * LocalBusiness/HairSalon JSON-LD — docs/design/LANDING_PAGE_SPEC-v0_0_2.md §9.
 * Address/phone/hours are the same placeholder values as business-info.ts;
 * they must be replaced together (NAP consistency) once real data lands.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: businessInfo.name,
    description: businessInfo.tagline,
    url: businessInfo.domain,
    telephone: businessInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address.line1,
      addressLocality: businessInfo.address.locality,
      addressRegion: businessInfo.address.region,
      postalCode: businessInfo.address.postalCode,
      addressCountry: businessInfo.address.country,
    },
    openingHoursSpecification: businessInfo.hours
      .filter((h) => h.value !== "Closed")
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.label,
        description: h.value,
      })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
