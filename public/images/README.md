# Landing page images

Most image slots already render an elegant placeholder and swap to the real photo automatically
the moment the file exists at the path below — no code change needed.

```
public/images/
  about.jpg                — About section image (currently the real barbershop interior shot)
  hero-final.jpg            — Reduced-motion hero fallback: the cinematic sequence's actual last
                              frame, extracted directly from the source video for continuity
  og-cover.jpg              — Social share image, 1200×630 (already generated from the video)
  eyelash/
    before.jpg              — Eyelash before/after slider, left side
    after.jpg                — Eyelash before/after slider, right side
```

```
public/hero-sequence/
  frame-0001.webp … frame-0120.webp   — the scroll-scrubbed cinematic hero (see features/marketing/Hero.tsx)
```

The hero sequence and `hero-final.jpg`/`og-cover.jpg` were extracted from
`assets/assets/video/Barbershop_camera_movement_*.mp4` (gitignored — raw source, not served).
Re-run the extraction if the source video changes; the exact ffmpeg commands are in the git history
of this file's introducing commit.

Staff portraits and gallery photos are DB-driven (`staff.portrait_url`, `staff_gallery_image.url`)
rather than fixed filenames — tell me the staff names / group ("work" or "space") for any new
photos and I'll wire the DB rows to point at whatever paths you use, e.g. `public/images/staff/marco.jpg`.

`logo.png` (processed from `assets/assets/photos/09-brand-logo-reference.jpg`) is **not currently
used** — the nav logo was switched to `components/ui/scissors-mark.tsx`, a hand-drawn animated SVG,
so it could actually open/close on a hinge (a flat raster image can't). The file is left here in
case it's wanted for something else later (favicon, footer mark, etc.).
