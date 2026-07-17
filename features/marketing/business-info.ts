/**
 * Single seam for shop-level facts with no DB home yet (no business_hours
 * table exists — staff_availability/holiday_closure are per-staff, not
 * shop-wide) and no real value supplied by the shop yet. Contact, the
 * footer, and StructuredData all read from here so filling in the real
 * address/phone/hours later is a one-file edit that keeps the visible page,
 * the JSON-LD, and the OG tags consistent (NAP consistency matters for local
 * SEO — see docs/design/LANDING_PAGE_SPEC-v0_0_2.md §9).
 *
 * TODO(shop): replace every value below with the real business info before
 * launch. These are clearly-provisional placeholders, not real data.
 */
export const businessInfo = {
  name: "Fadehouse",
  tagline: "Precision cuts. Old-world craft.",
  phone: "+1 (555) 010-2947",
  phoneDisplay: "(555) 010-2947",
  email: "hello@fadehouse.example",
  address: {
    line1: "128 Maple Street",
    locality: "Riverside",
    region: "CA",
    postalCode: "92501",
    country: "US",
  },
  hours: [
    { label: "Mon – Fri", value: "9:00 AM – 7:00 PM" },
    { label: "Saturday", value: "9:00 AM – 5:00 PM" },
    { label: "Sunday", value: "Closed" },
  ],
  social: {
    instagram: undefined as string | undefined,
    google: undefined as string | undefined,
  },
  domain: "https://fadehouse.example",
} as const;

export function formatAddress(): string {
  const { line1, locality, region, postalCode } = businessInfo.address;
  return `${line1}, ${locality}, ${region} ${postalCode}`;
}
