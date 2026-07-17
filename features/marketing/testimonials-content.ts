export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  rating: number;
}

/**
 * Curated/static for now — deliberately not wired to the `feedback` table
 * (unmoderated post-booking data, no "show publicly" flag) or a live Google
 * Places API (needs a key, has cost, not committed to). The shape mirrors a
 * plausible future DB row so swapping this for `listCuratedTestimonials()`
 * in lib/data/ later is a one-file change, not a rewrite.
 *
 * TODO(shop): replace with real reviews once supplied.
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Best fade I've had in years. The attention to detail is on another level — they take their time and it shows.",
    author: "James R.",
    role: "Regular, 2 years",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "Walked in nervous about a big color change, walked out feeling like a completely different person. Worth every minute.",
    author: "Priya K.",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Booking is effortless and they're never running late. Feels like a proper old-school barbershop with modern convenience.",
    author: "Marcus D.",
    role: "Regular, 4 years",
    rating: 5,
  },
];
