# design-sync notes — barbershop-design-system

- No Storybook in this repo — package shape. Component list comes from `dist/index.d.ts` (built via `tsup`, entry `src/index.ts`).
- `dist/` was already built when this sync ran (`npm run build` output present); no `buildCmd` needed unless `dist/` goes stale — re-run `npm run build` in `design-system/` before re-syncing if `src/` changed.
- No provider/wrapper needed — confirmed in the repo's own README ("No provider/wrapper is required — theming is pure CSS custom properties"). `cfg.provider` intentionally left unset.
- `dist/index.css` is self-contained (tokens + fonts + component styles) per the repo's README — used directly as `cfg.cssEntry`, no separate `tokensGlob` needed.
- All 7 components (AppointmentCard, Button, CreditChip, Input, ScheduleTable, SlotPicker, StatusBadge) were authored with rich previews in one pass, sourced from `demo/src/App.tsx` (the repo's own live demo — canonical usage for every component). All 17 preview cells graded `good` on first pass; no `[RENDER_BLANK]`/`[RENDER_THIN]`/grid-overflow issues after authoring (SlotPicker's initial floor-card blank-render warning resolved once its preview was authored with concrete, non-empty required array props).
- Docs: `docsDir` not set — this package has no per-component doc files, only a root `README.md` with a components table. `.prompt.md` files were synthesized from `.d.ts` + authored previews (0/7 doc matches, as expected).
- Token vocabulary (`--bds-*`, prefixed) fully documented in `.design-sync/conventions.md` — validated against the built `styles.css`/`_ds_bundle.css` before shipping.

## Re-sync risks

- If `demo/src/App.tsx` changes its example usage (props, copy), the authored previews in `.design-sync/previews/*.tsx` will drift from the "canonical" examples — no automatic detection for this, since previews are hand-owned. Worth a periodic diff against the demo app.
- This repo is not (yet) a git repository — `.design-sync/` durable files (config.json, NOTES.md, conventions.md, previews/) are on disk but not committed anywhere. If the repo is later git-initialized, commit `.design-sync/` (config.json, NOTES.md, conventions.md, previews/) and this `.gitignore` update.
- `dist/` is gitignored in this repo (build output) — a fresh clone will need `npm run build` before this sync's `--entry ./dist/index.js` resolves.
