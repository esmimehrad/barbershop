# features/marketing/ — Fadehouse landing page sections

One component per landing section, composed by `app/(marketing)/page.tsx`. Server Components by default; a handful of files are `'use client'` for real interactivity (`Hero`, `MobileMenuToggle`, `MobileBookBar`, `Preloader`, `BeforeAfterSlider`, `SmoothScrollProvider`).

**Theme**: this surface deliberately overrides `design-system/TOKENS.md`'s cream-paper-light-default and navy-secondary — the client wants a permanently black/charcoal background with a gold (not red) primary, no OS-driven light variant. See the header comment in `styles/tokens.css`. Because of this, raw `var(--bds-ink)` / `var(--bds-paper)` usages in this folder mean the *opposite* of what you'd guess from their names in a typical light-default system — `ink` is the light text color, `paper`/`paper-deep` are the dark surface colors. Check a component's existing usage before copying a pattern from `docs/design/` or the design-system reference, which still assume light-default.

## Files
- `Nav.tsx` / `MobileMenuToggle.tsx` — sticky nav, replaces the shared `AppHeader` on this surface only. Logo is `components/ui/scissors-mark.tsx`, not an image file — see below.
- `SmoothScrollProvider.tsx` — wraps the whole marketing layout in Lenis inertia scrolling, synced to GSAP's ticker so Hero's ScrollTrigger stays frame-accurate. Scoped to this route group only (mounts/unmounts with it) — booking and dashboard keep native scroll. Skips entirely under `prefers-reduced-motion`.
- `Preloader.tsx` — first-visit-only brand moment, hard 1.5s cap.
- `Hero.tsx` — cinematic scroll-scrubbed frame sequence (GSAP ScrollTrigger drives a `<canvas>`, pinned via plain CSS `position: sticky`, not GSAP's pin plugin). 120 webp frames in `public/hero-sequence/`, extracted from a source video the user supplied (see `public/images/README.md`). Falls back to a single static frame (`StaticHero`, same file) under `prefers-reduced-motion`. `HeroContent.tsx` holds the headline/CTA/service-chip overlay shared by both variants.
- `Services.tsx`, `SloganMoment.tsx`, `About.tsx`, `MeetTheTeam.tsx`, `EyelashShowcase.tsx`, `Gallery.tsx`, `Testimonials.tsx`, `FAQAccordion.tsx`, `Contact.tsx` — the remaining section components, in page order.
- `BeforeAfterSlider.tsx` — the eyelash before/after reveal (range-input driven, no drag library).
- `MobileBookBar.tsx` — fixed mobile "Book Now" bar, shown once the hero scrolls out.
- `Footer.tsx`, `StructuredData.tsx` (JSON-LD) — page chrome, mounted from the layout.
- `business-info.ts` — the single seam for shop NAP (address/phone/hours) — currently placeholder, read by `Contact.tsx`, `Footer.tsx`, and `StructuredData.tsx` together so they never drift apart.
- `testimonials-content.ts` — curated/static quotes (not the `feedback` table, not a live Google API — see file header for why). Named `-content` to avoid a case-insensitive filename collision with `Testimonials.tsx` on Windows.

## Rules
- Sections read data passed down from `page.tsx`'s single fetch, or reach into `lib/data/*` directly only if genuinely section-local — don't call Supabase from a component body.
- Every image outside the Hero goes through `components/ui/figure-image.tsx`, never a raw `<img>`/`next/image`, so missing photography degrades to an on-brand placeholder, and real photos show `components/ui/razor-spinner.tsx` (via `components/ui/loaded-image.tsx`) until they've actually loaded. Drop real files into `public/images/...` — no code change needed when they land. The Hero is the one exception (its `next/image` fallback and canvas frames are guaranteed to exist, so it skips the placeholder primitive — see `Hero.tsx`'s own doc comment).
- No horizontal scroll anywhere on this surface — motion is vertical-only. Most sections use `components/ui/scroll-reveal.tsx` (IntersectionObserver → CSS reveal, no dependency); the Hero and `SmoothScrollProvider` are the two places that use a real library (`gsap`/`ScrollTrigger`, `lenis`) because scroll-scrubbing a 120-frame canvas sequence and inertia scrolling aren't achievable with CSS alone — deliberate, scoped exceptions to the "no animation dependency" default elsewhere on this surface.
- Interactive elements' hover states should visibly change color/background (not just opacity or a shadow) — the client asked for this explicitly. Cards use a `hover:bg-primary/10` + `hover:border-primary` wash; nav-style links/icons use a solid `hover:bg-primary hover:text-primary-foreground` pill.
- `[OPEN]`/placeholder content (About counters, FAQ policy copy, NAP) is clearly marked with a `TODO(shop)` comment at its source — never invent numbers or policy details.

See `features/CLAUDE.md` and `app/(marketing)/CLAUDE.md`.
