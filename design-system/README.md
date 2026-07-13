# Barbershop Design System

Tokens and core components shared by the customer booking flow and the owner/staff dashboard. Visual direction: classic barbershop — see `docs/` in the repo root for the product spec these components are built against.

## Install & build

```
npm install
npm run build
```

Emits `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts`, and `dist/index.css` (tokens + fonts + component styles, self-contained).

## Usage

```tsx
import { Button, StatusBadge, AppointmentCard } from 'barbershop-design-system';
import 'barbershop-design-system/styles.css';

<AppointmentCard
  service="Fade & Line-Up"
  provider="David"
  location="Chair 2"
  startLabel="Today, 2:30 PM – 3:00 PM"
  status="booked"
  amountDue={27.5}
/>;
```

No provider/wrapper is required — theming is pure CSS custom properties. Dark mode follows the OS via `prefers-color-scheme`, or can be forced with `data-theme="dark"` / `data-theme="light"` on `<html>`.

## Components

| Component | Purpose |
|---|---|
| `Button` | `primary` / `secondary` / `ghost` / `critical` variants |
| `Input` | Labeled text field with optional hint |
| `StatusBadge` | Renders `Appointment.status` (+ `waitlisted`) as a colored pill |
| `AppointmentCard` | Customer-facing booking summary |
| `ScheduleTable` | Dashboard roster with one-tap complete/late/no-show actions |
| `CreditChip` | Credit balance display |

## Tokens

All colors, spacing, radii, shadows, and font stacks are CSS custom properties prefixed `--bds-` (see `src/styles/tokens.css`). Display face is **Bevan** (headings only); body/UI face is **Archivo** (variable weight, tabular figures).
