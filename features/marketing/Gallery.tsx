import type { GalleryImage } from "@/lib/data/gallery";
import { FigureImage } from "@/components/ui/figure-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const PLACEHOLDER_COUNT = 6;

function GalleryGroup({ title, images }: { title: string; images: GalleryImage[] }) {
  // No DB rows yet (or none for this group) — ship placeholder tiles rather than
  // an empty/missing section, so the gallery never looks broken pre-launch.
  const tiles: { id: string; url: string | null; alt: string }[] =
    images.length > 0
      ? images.map((img) => ({ id: img.id, url: img.url, alt: img.alt_text }))
      : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
          id: `${title}-placeholder-${i}`,
          url: null,
          alt: `${title} photo coming soon`,
        }));

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4 columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
        {tiles.map((tile, i) => (
          <ScrollReveal key={tile.id} delayMs={Math.min(i * 40, 280)} className="break-inside-avoid">
            <FigureImage
              src={tile.url}
              alt={tile.alt}
              placeholderVariant="gallery"
              className="aspect-square w-full rounded-[var(--radius)]"
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function Gallery({ work, space }: { work: GalleryImage[]; space: GalleryImage[] }) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">Gallery</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          A look at the work, and the space it happens in.
        </p>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <GalleryGroup title="Work" images={work} />
        <GalleryGroup title="Space" images={space} />
      </div>
    </section>
  );
}
