"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Service } from "@/lib/data/services";
import { RazorSpinner } from "@/components/ui/razor-spinner";
import { HeroContent } from "@/features/marketing/HeroContent";
import { HeroIntro } from "@/features/marketing/HeroIntro";

const FRAME_COUNT = 120;
const framePath = (n: number) => `/hero-sequence/frame-${String(n).padStart(4, "0")}.webp`;
/** Scroll distance (in viewport heights) the sequence plays across. */
const SEQUENCE_HEIGHT_VH = 180;

/**
 * Desktop landing hero (≥ 768px) — the original cinematic scroll-scrubbed frame
 * sequence. First-paints as `StaticHero` (real headline/CTA/image for SEO, no-JS,
 * and hydration), then, if motion is allowed, upgrades to the canvas sequence.
 * Self-contained: editing this file cannot affect the mobile hero. Only the
 * headline/CTA overlay (`HeroContent`) is shared.
 */
export function HeroDesktop({ services }: { services: Service[] }) {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    // One-time read of a browser-only preference on mount — unknown during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setEnhanced(true);
  }, []);

  if (!enhanced) return <StaticHero services={services} />;
  return <CinematicHero services={services} />;
}

/**
 * Single-image hero — the desktop first-paint and reduced-motion / no-JS
 * fallback. Also the neutral SSR fallback used by the `Hero` selector before it
 * knows the viewport.
 */
export function StaticHero({ services }: { services: Service[] }) {
  return (
    <section id="hero" className="relative isolate flex min-h-[92dvh] items-end overflow-hidden">
      <Image
        src="/images/hero-final.jpg"
        alt="Fadehouse barber station, finished cut"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bds-paper-deep)]/90 via-[var(--bds-paper-deep)]/35 to-[var(--bds-paper-deep)]/10" />
      <div className="px-4 pb-16 pt-32 sm:px-6 sm:pb-24">
        <HeroContent services={services} />
      </div>
    </section>
  );
}

/**
 * Cinematic scroll-scrubbed frame sequence. Pinning uses plain CSS
 * `position: sticky`, not GSAP's pin plugin — vertical scroll only, always.
 * GSAP ScrollTrigger only measures progress and drives which frame is drawn.
 */
function CinematicHero({ services }: { services: Service[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(-1);
  const [ready, setReady] = useState(false);
  const [introShown, setIntroShown] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    if (containerRef.current) {
      containerRef.current.style.height = `${SEQUENCE_HEIGHT_VH}vh`;
    }

    // Fade the intro booking prompt in on the next frame (not on scroll).
    const introTimer = requestAnimationFrame(() => setIntroShown(true));

    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const img = images[index];
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    }

    function loadFrame(i: number) {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = framePath(i + 1);
        images[i] = img;
      });
    }

    async function loadFrames() {
      // Fast first paint: load a small lead-in batch before revealing the canvas.
      await Promise.all(Array.from({ length: Math.min(8, FRAME_COUNT) }, (_, i) => loadFrame(i)));
      if (cancelled) return;
      setReady(true);
      drawFrame(0);
      currentFrameRef.current = 0;

      for (let i = 8; i < FRAME_COUNT; i++) {
        if (cancelled) return;
        await loadFrame(i);
      }
    }
    loadFrames();

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const index = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * FRAME_COUNT));
        if (index !== currentFrameRef.current) {
          currentFrameRef.current = index;
          drawFrame(index);
        }
        if (overlayRef.current) {
          // Overlay text reveals only in the sequence's final stretch, once the
          // frame lands on the "finished client, negative space" hero portrait.
          const p = Math.min(1, Math.max(0, (self.progress - 0.82) / 0.18));
          overlayRef.current.style.opacity = String(p);
          overlayRef.current.style.transform = `translateY(${(1 - p) * 20}px)`;
          // Only capture clicks once actually revealed — otherwise this opacity:0
          // layer sits on top of the intro and swallows its button taps.
          overlayRef.current.style.pointerEvents = p > 0.5 ? "auto" : "none";
        }
        if (introRef.current) {
          // Intro booking prompt vanishes over the first stretch of scroll.
          // At rest (progress 0) hand control back to the mount fade-in class.
          if (self.progress > 0) {
            const io = Math.max(0, 1 - self.progress / 0.14);
            introRef.current.style.opacity = String(io);
            introRef.current.style.pointerEvents = io < 0.5 ? "none" : "auto";
          } else {
            introRef.current.style.opacity = "";
            introRef.current.style.pointerEvents = "";
          }
        }
      },
    });

    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(introTimer);
      trigger.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="hero" aria-label="Fadehouse — cinematic introduction">
      <div ref={containerRef} style={{ height: `${SEQUENCE_HEIGHT_VH}vh` }} className="relative">
        <div className="sticky top-0 h-dvh w-full overflow-hidden bg-[var(--bds-paper-deep)]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

          {!ready ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RazorSpinner label="Loading Fadehouse" />
            </div>
          ) : null}

          {/* Immediate booking prompt — fades in on load, fades out on scroll. */}
          <div
            ref={introRef}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[var(--bds-paper-deep)]/70 via-[var(--bds-paper-deep)]/30 to-[var(--bds-paper-deep)]/70 transition-opacity duration-slow ease-bds ${
              introShown ? "opacity-100" : "opacity-0"
            }`}
          >
            <HeroIntro />
          </div>

          <div
            ref={overlayRef}
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 flex flex-col justify-end gap-6 bg-gradient-to-t from-[var(--bds-paper-deep)]/90 via-[var(--bds-paper-deep)]/25 to-transparent px-4 pb-16 pt-32 sm:px-6 sm:pb-24"
          >
            <HeroContent services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
