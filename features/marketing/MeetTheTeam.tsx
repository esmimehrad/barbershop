import Link from "next/link";
import type { Staff } from "@/lib/data/staff";
import { FigureImage } from "@/components/ui/figure-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function MeetTheTeam({ staff }: { staff: Staff[] }) {
  return (
    <section id="team" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">Meet the team</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Every chair is held by someone who trained for it, not just filled it.
        </p>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member, i) => {
          const track = member.role === "lash_specialist" ? "eyelash" : "haircut";
          return (
            <ScrollReveal key={member.id} delayMs={Math.min(i * 80, 320)}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm transition-[box-shadow,transform,border-color,background-color] duration-slow ease-bds hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:shadow-md">
                <FigureImage
                  src={member.portrait_url}
                  alt={member.name}
                  placeholderVariant="portrait"
                  className="aspect-[4/5] w-full"
                />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-semibold text-card-foreground">{member.name}</h3>
                  {member.specialty ? (
                    <p className="text-sm font-medium text-primary">{member.specialty}</p>
                  ) : null}
                  <p className="flex-1 text-sm text-muted-foreground">
                    {member.bio ?? "Details coming soon."}
                  </p>
                  <Link
                    href={`/book?track=${track}&staffId=${member.id}`}
                    className="mt-2 text-sm font-medium text-primary transition-colors hover:text-[var(--bds-gold-deep)] hover:underline"
                  >
                    Book with {member.name.split(" ")[0]} →
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
