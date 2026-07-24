# Home-screen web app (Add to Home Screen) — Next.js 16 App Router

**Goal:** make Fadehouse feel like an app when a user saves it to their phone home screen and launches it — chrome-less, correct icon/name/color, safe-area aware. This is a **bookmark-style** home-screen web app.

**Explicitly NOT in scope:** service workers, offline caching, `beforeinstallprompt` install prompts, WebAPK/installability engineering, Serwist/Workbox. Data stays live/network (correct for booking availability). Without a service worker, Android treats "Add to Home screen" as a shortcut/bookmark rather than a WebAPK install — **that is the intended behavior.**

> None of this exists in the repo yet. Add it when a mobile task first needs it — don't scaffold speculatively. Pull real values from `styles/tokens.css`; don't hardcode hex.

---

## 1. Web manifest — `app/manifest.ts`

Next.js metadata route (no dependency). Colors mirror the live tokens (`--bds-paper` `#121110`, `--bds-gold` `#d7a13c`):

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fadehouse — Barbershop & Lash Studio",
    short_name: "Fadehouse",
    description: "Precision cuts and lash artistry. Book your seat at Fadehouse.",
    start_url: "/",
    display: "standalone",   // launches chrome-less from the home screen
    background_color: "#121110", // = --bds-paper (splash bg)
    theme_color: "#121110",      // = --bds-paper (status/UI tint)
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      // maskable helps Android crop cleanly (harmless even without WebAPK install)
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

Add PNG icons under `public/icons/` (192 & 512, plus a maskable 512 with safe padding). An `apple-touch-icon` (180×180) at `app/apple-icon.png` is auto-served by Next.js for the iOS home-screen icon.

## 2. Apple + theme meta — `app/layout.tsx`

iOS does not read the manifest for standalone launch; it needs apple meta. Extend the existing `metadata`/`viewport` exports (don't duplicate them):

```ts
export const metadata: Metadata = {
  // ...existing title/description...
  appleWebApp: {
    capable: true,            // launch chrome-less on iOS from home screen
    title: "Fadehouse",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121110",     // = --bds-paper
  viewportFit: "cover",       // REQUIRED for env(safe-area-inset-*) to report real insets
};
```

## 3. Safe-area & full-height CSS

Because `viewportFit: "cover"` lets content run under the notch/home indicator:

- Height: use `100dvh` / `100svh`, **never** `100vh` (avoids the mobile URL-bar jump).
- Insets: pad fixed top bars and bottom nav with `env(safe-area-inset-top/bottom/left/right)`.
- Standalone-only affordances (e.g. an in-app back button, hiding a "open in browser" hint) can be gated with the media query:

```css
@media (display-mode: standalone) {
  /* shown only when launched from the home screen */
}
```

Prefer expressing padding via `--bds-space-*` combined with the inset, e.g. `padding-bottom: calc(var(--bds-space-4) + env(safe-area-inset-bottom))`.

## 4. How users save it (document, don't force)
- **iOS Safari:** Share → *Add to Home Screen*. (No programmatic prompt exists; the apple meta above makes the launch chrome-less.)
- **Android Chrome:** ⋮ menu → *Add to Home screen*.
- Optional: a subtle, dismissible in-app hint (small client island) pointing users to the above — **no forced/modal prompt**.

## 5. If true offline is ever wanted later (out of scope now)
Add a minimal service worker (e.g. via **Serwist**) with a network-first strategy for `/book` and Supabase data so availability stays fresh, and precache only the static shell. Treat this as a separate, product-approved task — not part of the home-screen setup.

## 6. Testing
- **Chrome DevTools → device mode** at 375px; **Application → Manifest** panel to confirm the manifest and icons parse and `display: standalone` is set.
- **`claude-in-chrome` MCP tools** for live mobile-viewport checks / screenshots.
- Verify safe-area padding visually on a notch device profile.
- No Lighthouse-PWA / installability gate — installability is not the goal.
