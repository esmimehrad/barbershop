import type { MetadataRoute } from "next";

/**
 * Web app manifest — makes Fadehouse feel like an app when saved to the home
 * screen (Add to Home Screen), launching chrome-less in `standalone`.
 *
 * Colors mirror the design tokens in `styles/tokens.css` (`--bds-paper`).
 * Manifest values must be literals (a manifest can't read CSS custom
 * properties), so keep these in sync if the brand seam changes.
 *
 * Deliberately no service worker / offline — this is a bookmark-style home
 * screen web app, not a full installable PWA.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fadehouse — Barbershop & Lash Studio",
    short_name: "Fadehouse",
    description: "Book a precision haircut or lash appointment at Fadehouse.",
    start_url: "/",
    display: "standalone",
    background_color: "#121110", // = --bds-paper
    theme_color: "#121110", // = --bds-paper
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
