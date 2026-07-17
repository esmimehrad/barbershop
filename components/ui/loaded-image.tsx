"use client";

import { useState } from "react";
import Image from "next/image";
import { RazorSpinner } from "@/components/ui/razor-spinner";

export interface LoadedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * Real-photo rendering for FigureImage: shows the razor spinner until the
 * image has actually loaded, then fades it in with a subtle hover zoom (the
 * "photo breathes" luxury-site touch). Split out as its own client island so
 * FigureImage itself can stay a server component for the placeholder path,
 * which needs no client JS at all.
 */
export function LoadedImage({ src, alt, fill = true, sizes, priority }: LoadedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--bds-paper-deep),var(--bds-paper-raised))]">
          <RazorSpinner />
        </div>
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes ?? "100vw"}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-[opacity,transform] duration-slow ease-bds hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
