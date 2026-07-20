import { Cormorant_Garamond, Montserrat } from "next/font/google";

/**
 * Luxury pairing, self-hosted by next/font at build time (no runtime request):
 * an elegant high-contrast serif for display headings + a clean geometric sans
 * for everything else. Deliberately replaces the design system's Bevan/Archivo
 * (a heavy vintage slab that read as jumbled next to the sans) — the client
 * wants one cohesive, upscale voice. Same as the black/gold override, this is a
 * conscious brand decision for this build, wired through the same
 * `--bds-font-display` / `--bds-font-body` token seam so nothing downstream
 * changes.
 */
export const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const bodyFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
