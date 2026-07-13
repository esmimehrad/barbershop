> **▶ Building the Next.js app? Start here, not with the browser-global bundle below.**
> The app consumes the **tokens**, not `_ds_bundle.js`. The bundle is a browser global that can't render in Server Components and would break SSR/RSC.
> - **`TOKENS.md`** — the token layer (real `--bds-*` values, three-layer architecture, shadcn/Tailwind semantic-alias mapping).
> - **`INTEGRATION-NEXTJS.md`** — how to wire tokens via Tailwind `@theme` and build components in-repo (shadcn/Radix), using the seven components here as the visual reference.
>
> This folder is the **reference kit**; the app derives its token layer and component specs from it. See `docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md` §10.

---

## Barbershop Design System — conventions

**No provider or wrapper.** Every component is self-contained — import it and render it directly, no `<ThemeProvider>` or context setup. Theming is pure CSS custom properties that apply automatically once `styles.css` is loaded.

**Styling idiom: CSS custom properties, not utility classes.** Components style themselves internally (their class names like `bds-btn`, `bds-pill` are private implementation detail — never target or extend them from outside). For your OWN layout glue around the components (page containers, spacing between cards, custom sections), use the design system's `--bds-*` tokens as CSS custom properties, e.g. `style={{ padding: 'var(--bds-space-4)', borderRadius: 'var(--bds-radius-md)' }}` or in a stylesheet. Key families:

| Token group | Examples | Use for |
|---|---|---|
| Surface | `--bds-paper`, `--bds-paper-raised`, `--bds-paper-deep` | backgrounds, cards |
| Ink | `--bds-ink`, `--bds-ink-soft` | text |
| Lines | `--bds-line`, `--bds-line-strong` | borders, dividers |
| Brand/accent | `--bds-red`, `--bds-navy`, `--bds-brass` (+ `-deep` variants) | accents, matches Button `critical`/status colors |
| Semantic | `--bds-success`, `--bds-warning`, `--bds-critical`, `--bds-info` | status meaning outside StatusBadge |
| Spacing | `--bds-space-1` (4px) … `--bds-space-9` (96px) | margins, padding, gaps — always a token, never a raw px value |
| Radius | `--bds-radius-sm`, `--bds-radius-md`, `--bds-radius-pill` | corners |
| Shadow | `--bds-shadow-sm`, `--bds-shadow-md` | elevation |
| Type | `--bds-font-display` (Bevan — headings only), `--bds-font-body` (Archivo — everything else) | fonts |

Dark mode is automatic via `prefers-color-scheme`; force it with `data-theme="dark"` / `data-theme="light"` on `<html>` if the design calls for an explicit toggle — never hand-roll dark colors.

**Where the truth lives.** Read `styles.css` (imports the token file and `_ds_bundle.css`) before styling anything custom — it's the complete, self-contained token + font + component stylesheet. Each component's `.prompt.md` has real composed examples; read those before composing rather than guessing prop shapes.

**Composition example** (real, from a verified preview — `AppointmentCard` composing `StatusBadge` internally, page-level layout using tokens for the surrounding grid):

```tsx
import { AppointmentCard, Button } from 'barbershop-design-system';

<div style={{ display: 'grid', gap: 'var(--bds-space-4)', padding: 'var(--bds-space-5)' }}>
  <AppointmentCard
    service="Fade & Line-Up"
    provider="David"
    location="Chair 2"
    startLabel="Today, 2:30 PM – 3:00 PM"
    status="booked"
    amountDue={27.5}
  />
  <div style={{ display: 'flex', gap: 'var(--bds-space-2)' }}>
    <Button variant="primary">Confirm booking</Button>
    <Button variant="ghost">View details</Button>
  </div>
</div>
```

Never invent new `bds-*` class names or raw hex colors — every visual decision should trace back to a token in the table above.

# BarbershopDesignSystem (barbershop-design-system@0.1.0)

This design system is the published barbershop-design-system React library, bundled as a single
browser global. All 7 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.BarbershopDesignSystem`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.BarbershopDesignSystem.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { AppointmentCard } = window.BarbershopDesignSystem;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AppointmentCard />);
```

## Tokens

37 CSS custom properties from barbershop-design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **spacing** (9): `--bds-space-1`, `--bds-space-2`, `--bds-space-3`, …
- **typography** (2): `--bds-font-display`, `--bds-font-body`
- **radius** (3): `--bds-radius-sm`, `--bds-radius-md`, `--bds-radius-pill`
- **shadow** (2): `--bds-shadow-sm`, `--bds-shadow-md`
- **other** (21): `--bds-ink`, `--bds-ink-soft`, `--bds-paper`, …

## Components

### general
- `AppointmentCard`
- `Button`
- `CreditChip`
- `Input`
- `ScheduleTable`
- `SlotPicker`
- `StatusBadge`
