# styles/ — the token layer (color seam)

`tokens.css` defines the **semantic** design tokens the whole app styles against (`--background`, `--primary`, `--border`, `--radius`, spacing…). `app/globals.css` bridges them to Tailwind utilities via `@theme`.

## Low-fi → brand
Values here are currently a **grayscale wireframe**. Applying the real heritage brand is a one-file swap: point each semantic token at its `--bds-*` equivalent from `design-system/TOKENS.md` §3. **No component changes** — this file is the single seam.

## Rules
- Components reference semantic tokens only — never edit component files to add color.
- Dark mode lives here (`prefers-color-scheme`); don't hand-roll dark colors elsewhere.
- Keep the spacing scale aligned with `--bds-space-*`.

See root `CLAUDE.md`.
