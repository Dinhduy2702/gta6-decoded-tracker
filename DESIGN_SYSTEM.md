# DESIGN SYSTEM CONTRACT: GTA 6 Decoded - 100% Tracker (SP #1)

> Locked before implementation per `anti-slop` and `frontend-ui-engineering`.
> Every visual choice below serves readability, operational density for gamers, and authentic Vice City / Leonida character without generic AI clichés.

## 1. Brand Identity & Tone
- **Product Name:** `GTA 6 Decoded` (Sub-label: `100% Tracker`)
- **Ecosystem Link:** Official companion web app for the `GTA 6 Decoded` YouTube channels and `GTA 6 Decoded` / `GTA 6 Loot & Guides` Facebook & Instagram pages.
- **Visual Direction:** Coastal Nocturne Dispatch & Florida Highway Telemetry. Sharp editorial framing inspired by Miami night dashboards and investigative field dossiers, avoiding purple/blue AI gradients, pill-everywhere badges, and excessive glow.
- **Copywriting Discipline:** Direct, gamer-native US English. Zero em dashes (`—`), zero fabricated user stats, zero fake testimonials, zero dead controls.

## 2. Color Tokens (WCAG AA Compliant in Both Themes)

### Dark Theme (Default: Leonida Night)
- `--bg-canvas`: `#0B0E14` (Main page background)
- `--bg-surface`: `#131823` (Primary panels, cards, map container)
- `--bg-elevated`: `#1B2232` (Interactive hover, active panels, modal)
- `--border-subtle`: `#263043` (1px hairline dividers)
- `--border-strong`: `#3A4863` (Input outlines, focused borders)
- `--text-primary`: `#F3F5F8` (Contrast > 14:1 on canvas)
- `--text-secondary`: `#A9B4C7` (Contrast > 7.5:1 on surface)
- `--text-muted`: `#7C8AA3` (Metadata, timestamps, contrast >= 4.6:1)
- `--accent-coral`: `#F25C54` (Primary action, active tab indicator)
- `--accent-coral-hover`: `#FF726B`
- `--accent-teal`: `#14B8A6` (Completed state, Confirmed source badge)
- `--accent-amber`: `#F59E0B` (Community/Rumor source badge, Money/Heist highlights)

### Light Theme (Vice Daylight)
- `--bg-canvas`: `#F5F2EB` (Warm coastal sand paper, reduces glare)
- `--bg-surface`: `#FFFFFF` (Crisp cards and tables)
- `--bg-elevated`: `#ECE7DC` (Subtle control wells)
- `--border-subtle`: `#DDD6C7`
- `--border-strong`: `#B8AE9A`
- `--text-primary`: `#121722` (Contrast > 15:1)
- `--text-secondary`: `#3E495C` (Contrast > 7.5:1)
- `--text-muted`: `#5B677D` (Contrast >= 4.8:1)
- `--accent-coral`: `#CF3A32` (Darkened for >= 4.5:1 text/button contrast)
- `--accent-coral-hover`: `#B52F28`
- `--accent-teal`: `#0E7C70`
- `--accent-amber`: `#A16207`

## 3. Typography
- **Display / Headings / KPI Numbers:** `'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif` (Strong highway-signage geometry suited to Leonida/Vice City).
- **Body / UI Controls:** `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif` (High legibility at 14px-16px on mobile screens).
- **Numeric Alignment:** `font-variant-numeric: tabular-nums` on all counters, percentages, and dollar values.
- **Hierarchy:** Single `<h1>` per document (`2.25rem` mobile, `3rem` desktop), `<h2>` section titles (`1.5rem`), `<h3>` card/panel titles (`1.125rem`), body (`0.9375rem`), caption (`0.8125rem`).

## 4. Spacing, Radius & Elevation
- **Spacing Scale:** `4px` base unit (`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`).
- **Corner Radius:** Disciplined technical radii (`4px` badges/tags, `6px` inputs/buttons, `10px` panels/cards). No pill-shaped cards or uniform `rounded-2xl` everywhere.
- **Elevation:** Flat 1px borders by default. Subtle drop shadow reserved strictly for floating modals and the active map inspector popover.
- **Motion:** Functional transitions only (`150ms ease` for state feedback), fully disabled under `prefers-reduced-motion: reduce`.

## 5. Responsive & Accessibility Contract
- **Breakpoints:** Mobile-first (`390px` primary phone check, `768px` tablet, `1024px` laptop, `1440px` desktop).
- **Zero Horizontal Overflow:** Verified at `390px` and `1440px`.
- **Touch Targets:** Minimum `44x44px` for checkboxes, filter buttons, map controls, and navigation tabs on mobile.
- **Keyboard & Focus:** Native `<button>`, `<a href>`, `<input>`, `<select>`. Visible `2px solid var(--accent-coral)` focus-visible ring with `2px` offset. Escape closes modals/drawers.
- **Required States:** Populated, Filtered Empty State (with one-click reset), Backup Import Error/Success feedback, and Light/Dark theme parity.
