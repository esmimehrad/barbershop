# Design Tokens — Barbershop Design System

**The tokens are the real, SSR-safe visual contract** for the app (see `docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md` §10). Components — hand-written or generated — consume these; they never hard-code color, spacing, or type. The values below are the actual `--bds-*` custom properties compiled into `_ds_bundle.css`.

Structured per the three-layer model (`design-system` skill): **Primitive → Semantic → Component**. The `--bds-*` set already blends primitive + semantic; §3 adds the thin semantic-alias layer that lets shadcn/ui + Radix components adopt this palette with zero restyling.

---

## 1. Primitive / semantic tokens (`--bds-*`)

### Color — Light (default `:root`)

| Token | Value | Purpose |
|---|---|---|
| `--bds-ink` | `#1c1712` | primary text (warm near-black) |
| `--bds-ink-soft` | `#4a4038` | secondary text |
| `--bds-paper` | `#e8ddc6` | page background (warm cream) |
| `--bds-paper-raised` | `#f2e9d6` | cards, raised surfaces |
| `--bds-paper-deep` | `#ddd0b3` | recessed / muted surfaces |
| `--bds-line` | `rgba(28,23,18,0.15)` | hairline borders/dividers |
| `--bds-line-strong` | `rgba(28,23,18,0.28)` | strong borders, inputs |
| `--bds-red` | `#a53a2c` | **primary** — barber brick-red |
| `--bds-red-deep` | `#7d2a20` | primary pressed/hover |
| `--bds-red-ink` | `#ffffff` | text on red |
| `--bds-navy` | `#1f3a5c` | **secondary** |
| `--bds-navy-deep` | `#16293f` | secondary pressed/hover |
| `--bds-brass` | `#9c762e` | **accent + focus ring** |
| `--bds-brass-deep` | `#7a5b22` | accent pressed/hover |
| `--bds-success` | `#3f7a4a` | status: success |
| `--bds-warning` | `#9c762e` | status: warning |
| `--bds-critical` | `#a3321f` | status: destructive/error |
| `--bds-info` | `#2f5c8a` | status: info |

### Color — Dark (`prefers-color-scheme: dark` and `[data-theme="dark"]`)

| Token | Value | Token | Value |
|---|---|---|---|
| `--bds-ink` | `#ece3d1` | `--bds-red` | `#d97a67` |
| `--bds-ink-soft` | `#b9ac96` | `--bds-red-deep` | `#e69989` |
| `--bds-paper` | `#17130f` | `--bds-red-ink` | `#17130f` |
| `--bds-paper-raised` | `#211b14` | `--bds-navy` | `#7fa0c8` |
| `--bds-paper-deep` | `#0f0c09` | `--bds-brass` | `#d3ab5f` |
| `--bds-line` | `rgba(236,227,209,0.14)` | `--bds-success` | `#74b982` |
| `--bds-line-strong` | `rgba(236,227,209,0.26)` | `--bds-critical` | `#e07a5f` |
| | | `--bds-info` | `#82aedd` |

Dark mode is defined in the tokens — **never hand-roll dark colors.** Force a theme with `data-theme="dark"` / `data-theme="light"` on `<html>`; default follows the OS.

### Spacing (4/8 rhythm)

| Token | px | Token | px |
|---|---|---|---|
| `--bds-space-1` | 4 | `--bds-space-6` | 32 |
| `--bds-space-2` | 8 | `--bds-space-7` | 48 |
| `--bds-space-3` | 12 | `--bds-space-8` | 64 |
| `--bds-space-4` | 16 | `--bds-space-9` | 96 |
| `--bds-space-5` | 24 | | |

Density guidance: dashboard uses `1–5`, booking `2–6`, landing `5–9`.

### Radius · Shadow · Motion · Type

| Token | Value |
|---|---|
| `--bds-radius-sm` / `-md` / `-pill` | `4px` / `9px` / `999px` |
| `--bds-shadow-sm` | `0 1px 2px rgba(28,23,18,.1)` (dark: `…rgba(0,0,0,.3)`) |
| `--bds-shadow-md` | `0 6px 20px rgba(28,23,18,.14)` (dark: `…rgba(0,0,0,.45)`) |
| `--bds-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--bds-dur-fast` / `-base` | `120ms` / `200ms` |
| `--bds-font-display` | **Bevan** (slab-serif, headings only) |
| `--bds-font-body` | **Archivo** (variable, body/UI, tabular figures) |

---

## 2. Component tokens

Per-component values reference the semantic layer, e.g. the Button state model (`design-system` skill spec pattern):

| Property | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| Background | `--bds-red` | `--bds-red-deep` | `--bds-red-deep` | `--bds-paper-deep` |
| Text | `--bds-red-ink` | `--bds-red-ink` | `--bds-red-ink` | `--bds-ink-soft` |
| Focus ring | `--bds-brass` (2px) | — | — | — |
| Shadow | none | `--bds-shadow-sm` | none | none |

The seven shipped components (`components/general/*`) document their own prop/variant models in each `.prompt.md` / `.d.ts`. Treat those as the visual spec when re-implementing in `components/ui/`.

---

## 3. Semantic-alias layer (bridge to shadcn/Tailwind)

Add these aliases (in `styles/tokens.css` in the app) so shadcn/ui + Radix components inherit the barbershop palette unchanged:

```css
:root {
  --background: var(--bds-paper);
  --foreground: var(--bds-ink);
  --card: var(--bds-paper-raised);
  --card-foreground: var(--bds-ink);
  --muted: var(--bds-paper-deep);
  --muted-foreground: var(--bds-ink-soft);
  --primary: var(--bds-red);
  --primary-foreground: var(--bds-red-ink);
  --secondary: var(--bds-navy);
  --accent: var(--bds-brass);
  --border: var(--bds-line-strong);
  --input: var(--bds-line-strong);
  --ring: var(--bds-brass);
  --destructive: var(--bds-critical);
  --radius: var(--bds-radius-md);
}
```

See `INTEGRATION-NEXTJS.md` for the Tailwind `@theme` wiring.

---

## 4. Accessibility notes

- Contrast: ink-on-paper pairs pass WCAG AA/AAA comfortably. **Verify red/brass text-on-paper pairs at ≥4.5:1** before using them for body-size text; both are safe as fills with `--bds-*-ink` foregrounds.
- The brass focus ring is part of the contract — **never remove focus outlines.**
- Status is never color-only — pair `--bds-success/warning/critical/info` with an icon or label.
