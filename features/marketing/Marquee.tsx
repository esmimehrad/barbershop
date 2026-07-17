const ITEMS = ["Fadehouse", "Precision Cuts", "Lash Studio", "Book Your Seat"];

/** Decorative brand ribbon — pure CSS loop, no JS. Purely ambient; conveys no unique content. */
export function Marquee() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[var(--bds-line)] bg-[var(--bds-paper-deep)] py-4"
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {track.map((item, i) => (
          <span
            key={i}
            className="font-display flex items-center gap-8 text-2xl tracking-wide text-[var(--bds-ink)]/70 sm:text-3xl"
          >
            {item}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
