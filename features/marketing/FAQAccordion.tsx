import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/**
 * TODO(shop): provisional copy — confirm real cancellation window, walk-in
 * policy, payment methods, and parking details before launch.
 */
const FAQS = [
  {
    question: "What's your cancellation policy?",
    answer:
      "We ask for at least 24 hours' notice to cancel or reschedule. Late cancellations and no-shows may be subject to a fee — details are confirmed when you book.",
  },
  {
    question: "Do you take walk-ins?",
    answer:
      "We're appointment-first to keep wait times short, but we'll always try to fit walk-ins in between bookings when a chair is open. Booking ahead guarantees your slot.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Card and contactless payment in-shop. Payment is settled at the shop, not online.",
  },
  {
    question: "Is there parking nearby?",
    answer: "Yes — street parking is available directly outside, with a small lot around the corner.",
  },
];

/** Native <details name="faq"> — one-open-at-a-time accordion behavior, zero client JS. */
export function FAQAccordion() {
  return (
    <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
      </ScrollReveal>

      <div className="mt-8 flex flex-col divide-y divide-border rounded-[var(--radius)] border border-border bg-card">
        {FAQS.map((faq) => (
          <details key={faq.question} name="faq" className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius)] p-5 text-base font-medium text-card-foreground transition-colors marker:content-none hover:bg-primary/15">
              {faq.question}
              <ChevronDown
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-base ease-bds group-open:rotate-180 group-hover:text-primary"
              />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
