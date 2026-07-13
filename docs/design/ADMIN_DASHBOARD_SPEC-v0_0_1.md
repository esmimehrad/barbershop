# Admin Dashboard Spec — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · Feature Specs v0.0.1 · Landing Page Spec v0.0.1
**Counterpart:** Booking Page Spec v0.0.1 (customer-facing surfaces)
**Source:** `Barbershop_Wireframes_dc.html`
**Status:** Draft v0.0.1 · **Last updated:** July 9, 2026

**Scope:** All **staff and owner** screens — the web dashboard, appointment management, and admin configuration.

**Excluded:**
- Customer-facing website and booking flow → see **Booking Page Spec**
- Notification-channel screens (SMS / WhatsApp bubbles, delivery log) → cut per scope decision

---

## 0. Scope note — notifications excluded

The channel layer is out. Two staff-side consequences:

| Wireframe element | Disposition |
|---|---|
| Delivery log (system) | **Cut** |
| Flow 5.2b `no_show_followup queued` | **Cut** — the screen reduces to a status confirmation. Nothing sends. |
| Flow 4.2 `feedback_request queued` | **Cut** — feedback becomes customer-pulled, not staff-pushed |

The `Notification` entity and its state machine remain in the data model. Only the screens are out.

**Newly moot:** FS-4.4 (`[OPEN]` no-show follow-up wording — rebook vs. re-engage). There is no message to word.

---

## 1. Screen inventory

**12 admin screens across 4 flows.** All web.

| Flow | Screens | Feature Spec | Priority |
|---|---|---|---|
| 4 · Appointment Completion (staff half) | 2 | FS-5 | P0 |
| 5 · Late / No-Show | 3 | FS-4 | P0 |
| 10 · Owner Dashboard | 3 | FS-10 | P0 |
| 11 · Admin Configuration | 6 | FS-11 | P0 |
| 12 · Promotion Builder (owner half) | 1 | FS-14 | P2 |
| **Missing: Landing-page admin surfaces** | **0** | FS-11 ext. | **Gap** |

*(Flows 10 and 11 overlap on access-level configuration — Screen 11.1 configures what Screen 10.1 gates.)*

---

## 2. Flow specs

### Flow 4 — Appointment Completion (staff half) · **P0**
*FS-5 · User Flows Flow 4*
*(Customer credit-earned and feedback screens live in the Booking Page Spec.)*

| # | Screen | Key elements |
|---|---|---|
| 1 | Staff opens appointment | Chair · staff · time, client name, service + total, **saved prefs line** (`skin fade, #2 guard · usual: Marco`), **Mark completed**, `Late / no-show ›` |
| 2 | Marked completed → credit writes | `completed` chip; credit ledger visualized — **Cashback** (`RFM segment rate × $37` → `+$2.50`), **Referral** (`if pending — both parties`), **Promotion** (`grant / redeem`), resulting `credit_balance $20.50` |

**Deltas**
- **Screen 2 is a debug view, not a production screen.** It exposes the internal write sequence to a barber marking someone done. **Recommend reducing to a confirmation toast** (`Ray marked complete · +$2.50 credit`) and moving the ledger detail to the Activity feed (Flow 10.3).
- Screen 1's **prefs line** is the only place `Client.preferences` surfaces to staff. FS-7 covers customer-side pre-fill only. **Add an AC to FS-7 or FS-10.**
- Idempotency (FS-5.7 — re-marking must not double-write) has **no UI treatment.** The **Mark completed** button needs a disabled/completed state.

---

### Flow 5 — Late / No-Show · **P0**
*FS-4 · User Flows Flow 5*

| # | Screen | Key elements |
|---|---|---|
| 1 | Row actions on dashboard | Today's schedule rows, each with `Done · Late · No-show` |
| 2a | Confirm release *(late past grace)* | Modal: *"Ray is past the 10-min grace. Free the 9:30 chair? Record is kept."* → `Release` / `Wait`; `late_released`; *triggers waitlist check on freed slot* |
| 2b | Marked no-show *(no-show)* | `no_show` chip. **Nothing else.** |

**Deltas**
- **Screen 2b is now near-empty.** Its entire payload was the outbound follow-up message. Under the cut it reduces to a status confirmation. Consider **collapsing it into a toast** on Screen 1 rather than a full screen.
- **Screen 2a's confirm modal is not in FS-4.1** — but it should be. The action is destructive and irreversible from the customer's side. **Add the AC.**
- No auto-timer anywhere (FS-4.3 ✅). Both actions are staff-triggered.

---

### Flow 10 — Owner Dashboard · **P0**
*FS-10 · User Flows Flow 10*

| # | Screen | Key elements |
|---|---|---|
| 1 | Access-gated overview | `access: owner` chip; metric cards — **Repeat visit ★ 61%**, No-show 8%, Utilization 74%, Credit liability $420; *a "staff" login hides pricing, metrics & credit sections* |
| 2 | Today's schedule · one-tap marking | Three columns — Marco · Sami · **Lena** (lash) — time rows, per-cell `✓ / late / n/s` and `open` states |
| 3 | Activity feed | Waitlist claimed · Referral credited · Feedback ★★★★☆ with comment |

**Deltas**
- Screen 1 **stars the North Star metric** in the UI. Good. Make it explicit in FS-10.3.
- Screen 2 renders **both tracks in one grid**, not two. FS-10.3 says "across both tracks" — the wireframe resolves the ambiguity. **Lock it.**
- **Screen 3 (Activity feed) is not in FS-10 at all.** Either add an AC or cut the screen. Recommend keeping it — it's the natural home for the Flow 4.2 ledger detail.
- Gating is by **hiding sections**, not disabling them. The wireframe assumes `staff` loses pricing + metrics + credit. **FS-10.5 permission matrix is still `[OPEN]`** and this is now blocking in two documents.

---

### Flow 11 — Admin Configuration · **P0**
*FS-11 · User Flows Flow 11*

| # | Screen | Key elements | Writes |
|---|---|---|---|
| 1 | Access levels | Per-user dropdowns (`staff` / `manager` / `owner`); *gates which dashboard sections each user sees*; `OPEN: permission set` | `Staff.access_level` |
| 2 | Staff & per-service assignment | Staff · role, **Can perform** checklist (Haircut ✓, Skin fade ✓, Beard trim ☐); *narrows role — only shows for assigned services* | `StaffService` |
| 3 | Schedule & holidays | Weekly working-hours toggles per staff; `Closure · Jul 14`; *removes bookable slots* | `AvailabilityRule`, `HolidayClosure` |
| 4 | Services, packages & pricing | Service rows (`Haircut · 30 min · barber · $25`), **+ Add**, package builder (`"The Works"` = Haircut + Beard, `+ child`), `$40 · auto-computes amount_due` | `Service`, `PackageItem` |
| 5 | RFM cashback | Three segment rows High / Mid / Low, each `TBD %`, `nightly re-segment` chip; `OPEN: segment boundaries` | `CustomerSegment` |
| 6 | Promotions | Rule row: `when [1st haircut done] → reward [free beard trim] → expires [TBD]`; `OPEN: stacks with cashback?` | `Promotion` |

**Deltas**
- **⚠️ Screen 4 contradicts FS-1.3.** The package `"The Works"` prices at `$40`, but its children (Haircut `$25` + Beard `$12`) sum to `$37`. FS-1.3 says package price "reflects combined child prices." The `$40` implies an **independently-set bundle price**. **Decide: derived sum, or independent price with implied markup/discount?**
- **⚠️ Screen 2 leaves add-on gating undefined.** `Beard trim` is *unchecked* for Marco — yet the customer booking flow offers Beard trim as a Marco add-on. **Are add-ons gated by `StaffService`, or only base services?** Unspecified in the model, the flows, and the specs.
- Screen 3's `HolidayClosure` removes *future* slots. FS-11 cross-cutting says existing appointments are **not auto-cancelled** — staff handle them manually, flagged on the dashboard. **No wireframe shows that flag.**
- Screens 1–6 are shown as six discrete screens. In practice this is **one settings area with six tabs.** Nav is unspecified.

---

### Flow 12 — Promotion Builder (owner half) · **P2**
*FS-14 · User Flows Flow 12*
*(Customer grant, redemption, and expiry screens live in the Booking Page Spec.)*

| # | Screen | Key elements |
|---|---|---|
| 1 | Owner defines promotion | `Trigger: After [1st haircut] completed` → `Reward: Free [beard trim] on next visit` → **Save promotion** |

**Deltas**
- The builder exposes only `first_completed_service` + `free_addon`. The Data Model also allows `nth_visit` / `manual` triggers and `fixed_credit` / `percent_off` rewards. **The UI scopes narrower than the model.** Either build the narrow version (and note the model over-provisions) or widen the UI.
- **No `is_featured_on_landing` toggle**, required by Landing Page Spec §3 and §6.2. See §3.

---

## 3. Relationship to the Landing Page Spec

The Landing Page Spec extends FS-11 with **four admin surfaces**. **None are wireframed.**

| Landing admin surface | Would live in | Gated at | Status |
|---|---|---|---|
| Feature a service on landing (toggle + reorder, **max 3**) | Flow 11, Screen 4 | `manager`+ | **Unwireframed** |
| Feature a promotion on landing (single-select; **selecting demotes the current**) | Flow 11 Screen 6 *or* Flow 12 Screen 1 | `manager`+ | **Unwireframed** |
| Manage barber profile (portrait, bio, specialty, panel order) | Flow 11, Screen 2 | `[OPEN]` | **Unwireframed** |
| Manage gallery (upload, assign `work`/`space`, attach to barber, reorder, alt text) | New screen in Flow 11 | `manager`+ | **Unwireframed** |

These map to the **Data Model v0.0.3 bump** the Landing Page Spec §5 already calls for:

- `Service.is_featured_on_landing`, `Service.landing_display_order`
- `Promotion.is_featured_on_landing`
- `Staff.portrait_url`, `Staff.bio`, `Staff.specialty`, `Staff.landing_display_order`
- New `GalleryImage` entity (`url`, `group`, `staff_id`, `display_order`, `alt_text`)

**Constraint to enforce in the gallery admin:** the landing page's sticky headers require **≥ 6 images per group**. Below that, the section falls back to a static label. The admin UI should warn.

### Shared open questions

| Question | This spec | Landing spec |
|---|---|---|
| **Barber self-edit permission** — can a `staff` user manage their own portfolio? | Flow 11.1 `OPEN: permission set` | §6 `[OPEN]`, §9.4 |
| **Does the lash specialist get a barber panel?** | Flow 10.2 shows Lena as a third column | §9.5 |
| **Brand identity** | `Fadehouse` | `Caesar icon` (§3.0) |

Both documents block on the same **FS-10.5 permission matrix.**

---

## 4. Design language (admin surfaces)

| Pattern | Usage |
|---|---|
| **Status chips** — monospace, entity-state literal | `completed`, `no_show`, `late_released`, `access: owner` |
| **`TBD` chip** | Unresolved config value (`TBD %`, `TBD` expiry) |
| **`OPEN:` annotation** | Margin note flagging a PRD §10 question |
| **`↳` annotation** | Explains an invisible rule (*narrows role — only shows for assigned services*) |

Admin surfaces are **640px web shells**; customer surfaces are 300px phone shells. The two do not share a component set beyond the status chip.

Unlike the customer surfaces, **exposing enum literals here is correct** — `no_show` and `late_released` are the vocabulary staff will use. Keep them.

---

## 5. Open questions

1. **⚠️ Package pricing: sum of children, or independently set?** FS-1.3 says sum; Flow 11 Screen 4 shows `$40` against `$37` of children. *Blocks FS-1, FS-11.*
2. **⚠️ Are add-ons gated by `StaffService`?** Unspecified anywhere. *Blocks FS-11.*
3. **⚠️ FS-10.5 permission matrix** — what exactly does each of `owner` / `manager` / `staff` see? *Blocks FS-10, FS-11, and the landing-page admin surfaces.*
4. **Is the Activity feed (Flow 10.3) in scope?** Not in FS-10. *Blocks FS-10.*
5. **Should Flow 4.2 (credit-writes ledger) ship as a screen**, or reduce to a toast? *Design decision.*
6. **Should Flow 5.2b ship as a screen**, now that its payload is gone? *Design decision.*
7. **Where does the "holiday overlaps existing booking" flag render?** Required by FS-11 cross-cutting; unwireframed.
8. **Does the promotion builder widen to match the model** (`nth_visit`, `manual`, `fixed_credit`, `percent_off`)? *Blocks FS-14.*
9. **Settings navigation** — six screens or six tabs? *Unspecified.*
10. **Brand name** — `Fadehouse` vs. `Caesar`. *Blocks all visual work.*

**Newly moot under the notification cut:** FS-3 entirely, FS-4.4 (no-show follow-up wording), and the delivery log.

---

## 6. Next actions

1. **Resolve the FS-10.5 permission matrix.** It blocks three specs and both landing-page admin surfaces.
2. **Decide package pricing semantics** — derived or independent.
3. **Specify add-on gating** against `StaffService`.
4. **Wireframe the four landing-page admin surfaces** (§3) and bump **Data Model to v0.0.3**.
5. **Reduce Flow 4.2 and Flow 5.2b** to toasts; move ledger detail to the Activity feed.
6. **Add ACs** for the confirm-release modal, the Activity feed, staff-facing preferences, and the completed-state disabled button.
7. **Settle the brand** before high-fidelity work.
