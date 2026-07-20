import Link from "next/link";
import type { Staff } from "@/lib/data/staff";
import { FigureImage } from "@/components/ui/figure-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaffMedia } from "@/features/marketing/StaffMedia";
import { Tilt3D } from "@/features/marketing/Tilt3D";
import { imageExists } from "@/lib/media/image-exists";

/** Slug a staff name to its media filename, e.g. "Marco Bianchi" → "marco". */
function staffSlug(name: string): string {
  return name.trim().toLowerCase().split(/\s+/)[0]?.replace(/[^a-z0-9]/g, "") ?? "";
}

export function MeetTheTeam({ staff }: { staff: Staff[] }) {
  return (
    <section id="team" className="bg-black px-4 py-12 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-2xl text-[var(--bds-ink)] sm:text-4xl">Meet the team</h2>
          <p className="mt-2 max-w-xl text-[var(--bds-ink-soft)]">
            Every chair is held by someone who trained for it, not just filled it.
          </p>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10 sm:gap-8">
          {staff.map((member, i) => {
            const track = member.role === "lash_specialist" ? "eyelash" : "haircut";
            // Desktop shows an action clip (public/videos/staff/<slug>.mp4) when present.
            const slug = staffSlug(member.name);
            const videoSrc = slug ? `/videos/staff/${slug}.mp4` : null;
            const posterSrc = slug ? `/videos/staff/${slug}-poster.jpg` : null;
            const hasVideo = videoSrc ? imageExists(videoSrc) : false;

            return (
              <ScrollReveal
                key={member.id}
                delayMs={Math.min(i * 80, 320)}
                className="w-[calc(50%-0.5rem)] sm:w-80 lg:w-96"
              >
                <Tilt3D className="h-full">
                  <div className="flex h-full flex-col gap-3 [transform-style:preserve-3d]">
                    <div style={{ transform: "translateZ(40px)" }}>
                      <StaffMedia
                        name={member.name}
                        videoSrc={hasVideo ? videoSrc : null}
                        poster={posterSrc && imageExists(posterSrc) ? posterSrc : undefined}
                        photo={
                          <FigureImage
                            src={member.portrait_url}
                            alt={member.name}
                            placeholderVariant="portrait"
                            placeholderClassName="bg-black"
                            className="aspect-square w-full rounded-[var(--radius)]"
                          />
                        }
                      />
                    </div>
                    <div
                      className="flex flex-1 flex-col items-center gap-1.5 px-0.5 text-center sm:gap-2"
                      style={{ transform: "translateZ(18px)" }}
                    >
                      <h3 className="text-base font-semibold text-[var(--bds-ink)] sm:text-lg">
                        {member.name}
                      </h3>
                      {member.specialty ? (
                        <p className="text-xs font-medium text-primary sm:text-sm">
                          {member.specialty}
                        </p>
                      ) : null}
                      <p className="line-clamp-3 flex-1 text-sm text-[var(--bds-ink-soft)] sm:line-clamp-none">
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
                </Tilt3D>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
