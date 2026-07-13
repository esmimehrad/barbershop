# Next.js Integration — Barbershop Design System

How the Next.js app consumes this design system. See `docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md` §10 for the rationale.

---

## TL;DR

**Consume the tokens, not the JS bundle.** Bring `_ds_bundle.css`'s `--bds-*` tokens into the app as the source of truth, bridge them into Tailwind with `@theme`, and build interactive components in-repo with **shadcn/ui + Radix** — all themed by the same tokens. The seven bundle components are the **visual reference** (`components/general/*/*.prompt.md`), re-implemented against the tokens.

---

## Why not consume `_ds_bundle.js` directly

This kit is a **design-sync bundle export** — a browser global (`window.BarbershopDesignSystem`) that:
- needs React on `window` and a **separate mount node** → a second React tree beside Next.js;
- **cannot render in Server Components** → breaks the server-first architecture (§4 of the architecture doc);
- ships React a second time.

The tokens have none of these problems: they are pure CSS custom properties — SSR-safe, zero JS, already themed for light/dark.

---

## Step 1 — Lift the tokens into the app

Copy the token declarations from `_ds_bundle.css` (the `:root`, `@media (prefers-color-scheme: dark)`, and `[data-theme]` blocks) plus the `@font-face` rules from `fonts/fonts.css` and the two `.woff2` files in `fonts/` into the app:

```
app-repo/
  styles/tokens.css        ← --bds-* tokens + semantic aliases (TOKENS.md §3)
  public/fonts/            ← Bevan-Regular…woff2, Archivo-Variable…woff2
```

Import `styles/tokens.css` once in the root layout. Fonts: prefer `next/font/local` for the two `.woff2` files (`font-display: swap`, self-hosted, no layout shift) and point `--bds-font-display` / `--bds-font-body` at the generated family variables.

## Step 2 — Bridge tokens into Tailwind (`@theme`)

Tailwind v4 `@theme` maps the semantic aliases (TOKENS.md §3) to utility names so `bg-primary`, `text-foreground`, `border-border`, `rounded-md`, `p-4`, etc. resolve to `--bds-*`:

```css
/* styles/tokens.css (after the --bds-* + alias declarations) */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --radius-md: var(--bds-radius-md);
  --font-display: var(--bds-font-display);
  --font-body: var(--bds-font-body);
  /* spacing: Tailwind's 4/8 scale already matches --bds-space-* */
}
```

Result: one token source. A shadcn Button (`bg-primary text-primary-foreground`) and a re-implemented `AppointmentCard` render with the identical heritage palette, light and dark.

## Step 3 — Build components in-repo (two-tier)

| Tier | Where | How |
|---|---|---|
| **Interactive / SSR-critical** — dialogs, forms, menus, sheets, the schedule actions, OTP input | `components/ui/` | `npx shadcn@latest add …` (Radix under the hood → focus mgmt, keyboard nav, aria for free), themed by the aliases above. |
| **Brand display** — `StatusBadge`, `CreditChip`, `AppointmentCard`, `SlotPicker`, `ScheduleTable` | `components/ui/` | Re-implement from the bundle's `components/general/<Name>/<Name>.prompt.md` + `.d.ts` (the visual + prop spec), using tokens. |

Keep prop names matching the shipped `.d.ts` so the documented API stays the contract.

## Step 4 — Dark mode

Tokens already define dark via `prefers-color-scheme` and `[data-theme]`. For an explicit toggle, set `data-theme="dark"|"light"` on `<html>` (e.g. via `next-themes` with `attribute="data-theme"`). **Do not** add a parallel dark palette — the tokens own it.

---

## What stays in `design-system/`

This folder remains the **reference kit**: the token source (`_ds_bundle.css`), the component specs (`components/general/*`), fonts, and previews. The app copies/derives from it. When the kit is refreshed, re-export it keeping the `--bds-*` families and the seven component names, and the app picks up new values by re-syncing `styles/tokens.css` — component code doesn't change.
