# Landing Page Spec — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · Feature Specs v0.0.1
**Status:** Draft v0.0.1 · **Last updated:** July 9, 2026
**Scope:** Public marketing landing page. Booking flow itself is out of scope here — the landing page is an entry point into it (FS-1).

---

## 1. Purpose

The landing page has one job: get a first-time visitor into the booking flow, and give a returning customer a reason to feel they know the shop. It is not a brochure. Every section either drives a booking or builds the familiarity that feeds the North Star (repeat-visit rate).

Two booking entry points exist on the page:
- **Hero** → haircut track (barbers)
- **Eyelash section** → eyelash track (lash specialist)

This mirrors the two-track availability engine (PRD §7). The page never mixes the tracks in a single CTA.

---

## 2. Section order

| # | Section | Primary motion |
|---|---|---|
| 0 | Preloader | Caesar icon fills to real asset load |
| 1 | Nav | Sticky, `top: 0` |
| 2 | Hero | Featured service chips + "Find times"; scale-down/darken on exit |
| — | *divider* | SVG line-draw |
| 3 | Featured promo *(conditional)* | Reveal only |
| 4 | Services | Staggered card reveal |
| 5 | Type-scale moment | Slogan scales to fill viewport, releases |
| 6 | About / differentiator | **Pinned 5-frame image sequence** + counter reveals |
| — | *divider* | SVG line-draw |
| 7 | Meet the barbers | Full-height panels, sticky name headers |
| 8 | Eyelash | Threshold color shift, split-reveal before/after, own booking CTA |
| — | *divider* | SVG line-draw |
| 9 | Gallery | **Sticky WORK / SPACE headers**, vertical scroll |
| 10 | Shop environment | **Horizontal pinned scroll** |
| 11 | Testimonials | Google reviews, simple fade |
| 12 | Contact | Map, phone, address |
| 13 | Footer | — |

**Rule: one pinned moment per page.** Section 6 is it. Sections 9 and 10 use sticky/horizontal techniques, not a scrubbed sequence. Two pinned sequences make the page read as a demo reel.

---

## 3. Section specs

### 0 — Preloader

- Caesar icon fills from outline to solid as a progress indicator. The logo **is** the progress bar; no separate bar.
- Progress is tied to **actual asset load**: hero image, above-fold fonts, and the five pinned-sequence frames.
- **Hard cap 1.5s** — dismisses regardless of load state, then continues loading behind the page.
- **Session-skip**: a `sessionStorage` flag suppresses the preloader on repeat views within the same session.
- Must never appear during in-app navigation, only on first document load.

### 1 — Nav

- Logo left · links center (Home · Services · About · Contact) · **Book Now** right.
- `position: sticky; top: 0`, opaque background (transparent sticky headers show scrolling content through them).
- Anchor targets must set `scroll-margin-top` equal to nav height, or links land under the bar.
- Section-level sticky headers (§7, §9) pin **below** the nav (`top: <nav-height>`), never at `top: 0`.

### 2 — Hero

- Full-bleed image: barber and client, warm, side-lit.
- Large slogan headline. Subtitle stating the differentiator.
- **Booking entry box**, not a lead-capture form:
  - 2–3 **featured service chips**, selected by admin (not algorithmically ranked)
  - "See all services" link → §4
  - Primary CTA: **Find times** → routes into the real booking flow (FS-1)
- Scroll-cue icon, bottom center.
- **Motion:** as §4 scrolls over it, the hero scales to ~0.94 and darkens. Reads as layered, not stacked.

**Explicitly not built:** name/email/phone/date fields. That is a contact form, not a booking. The hero must not create a parallel intake path the booking engine doesn't know about.

**Mobile:** the form does not overlay the image. Headline + subtitle over a darkened background, single "Book Now" button opening a sheet.

### 3 — Featured promo *(conditional)*

- Renders **only** when exactly one `Promotion` has `is_featured_on_landing = true`.
- One at a time. Setting a new featured promotion demotes the previous.
- Dismissible; dismissal remembered per session.
- If no featured promotion is active, the section does not render — no empty state, no reserved space.

### 4 — Services

- Card grid. Cards are the shop's services (haircut track). Eyelash services do not appear here.
- **Motion:** staggered reveal, 60–80ms offset, subtle y-translate. **No bounce.**
- Each card links into the booking flow with that service preselected.

### 5 — Type-scale moment

- The slogan scales from its resting size to fill the viewport as it passes through center, then releases.
- Pure CSS transform driven by scroll position. No assets, no weight.
- Serves as the tonal beat between the transactional Services grid and the atmospheric §6.

### 6 — About / differentiator — **the pinned sequence**

**Scenario: Hands Only (D).** Five frames, one continuous take, camera locked.

1. Scissors picked up off the counter
2. Comb lifting a section of hair
3. Scissors closing — hair falling
4. Brush sweeping the neckline
5. Hands lifting away, empty

**Shooting requirements:**
- Tripod, locked. Manual exposure, manual white balance, manual focus. Any auto setting shifts between frames and the crossfade flickers.
- Shoot **video** at max resolution, extract stills. Do not shoot stills.
- 4K preferred — frames will be cropped.
- Single warm key light, camera-left. Practicals in frame.
- 3–4 takes of the full action.
- **Only one element changes between frames** (hand position). Everything else nailed down. The eye reads it as motion, not as cutting.

**Delivery:**
- Extract 5 frames at moments ~15–20% apart. Even spacing beats dramatic spacing.
- WebP, ~1800px wide, quality 80. ~200KB each, ~1MB total.
- **Preload all five during the preloader.** The pinned section must never show a loading frame.
- Pinned height ~180vh. Frames swap at 0 / 25 / 50 / 75 / 100% of scroll progress through the pin.
- Crossfade 150–200ms. Longer reads as a dissolve, not a cut.

**Also in this section:** counter reveals (e.g. cuts, years, clients, barbers), ticking up once on entry. **Only real numbers.** If the numbers aren't real, drop the counters.

**Fallback if the take can't be got:** scenario A (The Fade) with a real client, or drop to a static hero image and rely on §5 and §8 for motion. Do not fake continuity from five separate photos — it collapses into a slideshow.

### 7 — Meet the barbers

- **Full-height panel per staff member.** Portrait, name, specialty, short bio, "Book with [name]" CTA.
- Below each portrait: that barber's own work samples, scrolling.
- **Sticky name header** pins while their work scrolls past, releases when the next barber arrives (see §9 for mechanism).

**Content dependency:** each barber needs **4–6 work images of their own**. Without them the panel is empty and the sticky header has nothing to stick through — the section degrades into a card row, at which point sticky headers must be removed entirely.

This section directly supports per-barber service assignment (FS-11.3, FS-11.6): the customer is choosing a person, not just a time.

### 8 — Eyelash

- Own visual treatment, own booking CTA → eyelash track.
- **Centerpiece:** split-reveal before/after. A wipe divider driven by scroll position moves across a matched before/after pair. Two stills, no footage.
- **Threshold color shift:** the page background transitions into the section's palette on entry and back out on exit. The section owns its own color world without being bolted on.
- `[OPEN]` Visual relationship to the barbershop identity — **contrast** (inverted palette, distinct brand under one roof), **continuity** (same palette, different subject), or **threshold** (transition in/out, most work). Threshold assumed pending decision.

### 9 — Gallery — WORK / SPACE

- Two labeled groups, vertical scroll.
- **Sticky group header:** `WORK` pins while its images scroll, then `SPACE` pushes it up and takes over. The iOS contacts-list pattern.

**Sticky mechanics — the three traps:**
1. Any ancestor with `overflow: hidden|auto|scroll` becomes the scroll container and silently breaks sticky. Use `overflow: clip`.
2. The parent must be **taller than the sticky element** or it never activates. **Minimum 6 images per group** — below that the header flickers instead of pinning.
3. The sticky element's background must be **opaque**.

- Pins at `top: <nav-height>`, not `top: 0`.
- **Mobile:** vertical, same pattern, smaller image grid. Sticky still works.

### 10 — Shop environment

- **Horizontal pinned scroll.** The section pins vertically while a strip of 5–8 wide images scrolls sideways.
- Desktop only. **Mobile falls back to a plain vertical stack** — horizontal-scroll-on-pin is hostile on touch.
- This is where the horizontal moment lives. It does **not** live in the Gallery.

### 11 — Testimonials

- Google Places API. **Hard constraints:** max 5 reviews returned, no pagination, TOS requires attribution and forbids caching beyond 30 days.
- **Cache nightly** via `pg_cron` (already provisioned for the RFM job).
- Display 3–5, attribute, link out to the full Google profile.
- Do not build a carousel expecting 20 reviews. There are 5.
- Motion: simple fade. Let the content carry it.

### 12 — Contact

- Map, phone, address, hours.
- No motion.

### 13 — Footer

- Standard. No motion.

---

## 4. Motion inventory

### Layer 1 — Reveals (cheap, used liberally)
IntersectionObserver + CSS transforms. Zero weight, GPU-composited, degrade gracefully to "just visible" without JS.

| Effect | Where |
|---|---|
| Staggered card reveal (60–80ms, y-translate, no bounce) | §4 Services |
| Counter reveal (ticks up once on entry, real numbers only) | §6 About |
| SVG line-draw underline / divider | Between §2–3, §6–7, §8–9 |
| Text mask-wipe (line-by-line, behind a moving mask) | §2 headline, §6 |
| Image parallax (0.85× scroll speed) | §6 background |

### Layer 2 — Sticky / pinned transforms
| Effect | Where |
|---|---|
| Sticky hero scale-down + darken | §2 → §4 |
| Sticky section headers | §7 barbers, §9 gallery |
| Horizontal pinned scroll | §10 environment |
| Threshold color shift | §8 eyelash |
| Type-scale moment | §5 |

### Layer 3 — Pinned sequence
| Effect | Where |
|---|---|
| 5-frame Hands-Only image sequence, canvas or crossfade | §6 About |

**Ruled out:** true scroll-scrubbed `<video>` (`currentTime` driven by scroll). Requires a keyframe-heavy encode that balloons file size, and iOS Safari seeks paused video unreliably. A frame sequence is the same effect without the pain.

**Ruled out:** card-stacking / peel-away on Services. Trendy now, first thing to look dated.

---

## 5. Data model additions

These are new to the landing page and belong in a **Data Model v0.0.3** bump.

### Service — new fields
| Field | Type | Notes |
|---|---|---|
| is_featured_on_landing | boolean | surfaces as a hero chip |
| landing_display_order | integer (nullable) | chip sequence; admin-controlled |

### Promotion — new field
| Field | Type | Notes |
|---|---|---|
| is_featured_on_landing | boolean | **exactly one at a time**; setting a new one demotes the previous |

### Staff — new fields (for §7)
| Field | Type | Notes |
|---|---|---|
| portrait_url | string (nullable) | full-height panel portrait |
| bio | text (nullable) | short |
| specialty | string (nullable) | display label |
| landing_display_order | integer (nullable) | panel sequence |

### GalleryImage — new entity
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| url | string | |
| group | enum(`work`,`space`) | drives the sticky header split |
| staff_id | FK → Staff (nullable) | non-null = appears under that barber's panel (§7) |
| display_order | integer | |
| alt_text | string | accessibility; required |
| created_at | timestamp | |

**Constraint:** the Gallery section requires ≥ 6 rows per `group` to render sticky headers. Below that, fall back to a static label.

---

## 6. Admin surface additions

Extends FS-11 (Admin Configuration). Gated at `manager` or above unless noted.

1. **Feature a service on the landing page** — toggle + reorder. Max 3.
2. **Feature a promotion on the landing page** — single-select; selecting demotes the current.
3. **Manage barber profile** — portrait, bio, specialty, panel order.
4. **Manage gallery** — upload, assign to `work` / `space`, optionally attach to a barber, reorder, alt text.

`[OPEN]` Whether a barber can edit their own profile/portfolio (`staff` level) or only `manager`+ can. Ties to the FS-10.5 permission matrix.

---

## 7. Asset checklist

Everything below is a **content dependency**. The design cannot ship ahead of it.

| Section | Assets | Status |
|---|---|---|
| §2 Hero | 1 barber+client image, high res | `[NEEDED]` |
| §6 Pinned sequence | 5 frames, one continuous take, hands only | `[NEEDED]` |
| §6 Counters | 4 real numbers | `[OPEN]` |
| §7 Barbers | Portrait **+ 4–6 work images per barber** | `[NEEDED]` |
| §8 Eyelash | Before/after pair, matched framing | `[NEEDED]` |
| §9 Gallery — Work | ≥ 6 images | `[NEEDED]` |
| §9 Gallery — Space | ≥ 6 images | `[NEEDED]` |
| §10 Environment | 5–8 wide images | `[NEEDED]` |
| §11 Testimonials | Live Google Business profile with reviews | `[VERIFY]` |

**Recommendation:** one half-day photo session with a photographer. The pinned sequence (§6) and the environment strip (§10) come from the same lighting setup. Barber portraits and work samples in the same session.

---

## 8. Performance budget

| Item | Budget |
|---|---|
| Preloader dismiss | ≤ 1.5s hard cap |
| Pinned sequence, 5 frames | ~1 MB total (WebP, q80, 1800px) |
| Hero image | ≤ 300 KB |
| Total above-fold | ≤ 600 KB |
| Motion library | prefer CSS + IntersectionObserver; no scroll library unless §10 forces it |

All Layer 1 motion must degrade to "content visible, no animation" with JS disabled or `prefers-reduced-motion: reduce`.

`prefers-reduced-motion` behavior:
- Layer 1 → no transform, immediate visibility
- Layer 2 → sticky headers remain (they are navigation, not decoration); scale/parallax/color-shift disabled
- Layer 3 → show frame 5 only, statically

---

## 9. Open questions

1. **Eyelash visual treatment** — contrast, continuity, or threshold? (§8) *Blocking design.*
2. **Counter numbers** — what are the four real figures? (§6) *Drop the counters if they don't exist.*
3. **Do the assets exist?** (§7) *Blocking build at §6.* If no shoot is planned, §6 falls back to a static image and the page loses its centerpiece.
4. **Barber self-edit permission** — can a `staff`-level user manage their own portfolio? (§6 admin) *Ties to FS-10.5.*
5. **Number of barber panels** — two barbers only, or does the lash specialist also get a panel in §7? (She already owns §8.) *Affects section height: 2 panels ≈ 2 viewports, 3 ≈ 3.*

---

## 10. Cross-references

| This spec | Existing artifact |
|---|---|
| Hero → booking flow | FS-1 (Core Booking), Flow 1 |
| §3 featured promo | FS-14 (Promotions), Flow 12 |
| §7 barber panels | FS-11.3 / FS-11.6 (per-staff service assignment) |
| §8 eyelash CTA | PRD §5.2 (eyelash as separate track) |
| §11 nightly review cache | Data Model §6 (nightly job / `pg_cron`) |
| §6 admin surface | FS-11 (Admin Configuration), Flow 11 |
| Two-track separation on both CTAs | Data Model §4 |
