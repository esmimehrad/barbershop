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
