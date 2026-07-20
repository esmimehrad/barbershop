"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface StaffMediaProps {
  /** Server-rendered photo (FigureImage) — shown on mobile, no-JS, and while the video is absent. */
  photo: ReactNode;
  /** Public path to the barber's action clip, or null if none exists yet. */
  videoSrc: string | null;
  poster?: string;
  name: string;
}

/**
 * Team media slot: the barber's action video on desktop, their photo on
 * mobile. The video is only mounted on wide screens, so phones never download
 * it (saves data) and simply keep the lighter photo. The clip is filmed on
 * black and sits `object-contain` on a black backdrop with no border, so the
 * letterbox merges into the background and the barber appears to float.
 */
export function StaffMedia({ photo, videoSrc, poster, name }: StaffMediaProps) {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (desktop && videoSrc) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius)] bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${name} at work`}
        />
      </div>
    );
  }

  return <>{photo}</>;
}
