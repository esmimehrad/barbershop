import { Camera, ImageIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageExists } from "@/lib/media/image-exists";
import { LoadedImage } from "@/components/ui/loaded-image";

type PlaceholderVariant = "hero" | "portrait" | "gallery" | "wide";

const placeholderIcon: Record<PlaceholderVariant, typeof ImageIcon> = {
  hero: ImageIcon,
  portrait: User,
  gallery: Camera,
  wide: ImageIcon,
};

export interface FigureImageProps {
  /** Public-relative path, e.g. "/images/hero.jpg" — typically DB-sourced or a static slot. */
  src?: string | null;
  alt: string;
  placeholderVariant?: PlaceholderVariant;
  className?: string;
  /** Override the placeholder background (default is the warm paper gradient) — e.g. "bg-black". */
  placeholderClassName?: string;
  /** Forwarded to next/image; set true only for the single largest above-fold image. */
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

/**
 * Server-rendered image slot that degrades to an on-brand placeholder — same
 * aspect ratio, zero layout shift — when `src` is empty or the file isn't on
 * disk yet. Every landing-page image goes through this so the page looks
 * intentional before real photography lands, and "lights up" automatically
 * (no code change) once files are dropped into public/images/.
 */
export function FigureImage({
  src,
  alt,
  placeholderVariant = "wide",
  className,
  placeholderClassName,
  priority,
  sizes,
  fill = true,
}: FigureImageProps) {
  const hasImage = imageExists(src);
  const Icon = placeholderIcon[placeholderVariant];

  if (!hasImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          placeholderClassName ?? "bg-[linear-gradient(135deg,var(--bds-paper-deep),var(--bds-paper-raised))]",
          className,
        )}
      >
        <Icon
          aria-hidden="true"
          className="h-1/5 w-1/5 min-h-6 min-w-6 max-h-10 max-w-10 text-[var(--bds-ink-soft)] opacity-40 sm:max-h-14 sm:max-w-14"
          strokeWidth={1.25}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <LoadedImage src={src as string} alt={alt} fill={fill} sizes={sizes} priority={priority} />
    </div>
  );
}
