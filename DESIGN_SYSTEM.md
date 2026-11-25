# DESIGN SYSTEM CONTRACT v2.0: GTA 6 Decoded - 100% Tracker

> Upgraded using `frontend-design`, `ui-ux-pro-max`, `anti-slop`, and competitive UX analysis of MapGenie, GTAWeb.eu, and GTABase.

## 1. Competitive UX Synthesis
- **From MapGenie:** Split-panel interactive map workspace with left filter sidebar, Show All / Hide All master toggles, Hide Completed switch, distinct SVG category pin markers, drag-to-pan + zoom, and instant pin inspector.
- **From GTAWeb.eu:** Companion toolkit density combining map tracking with live bankroll milestones and quick-preset heist payout splitting.
- **From GTABase:** Searchable, high-contrast database cards with category color coding, Grid/List view toggle, and clear Confirmed vs. Community source labels.

## 2. Palette (Miami Nocturne + Vice Daylight, WCAG AA Verified)
- **Dark Default:** Canvas `#070B12`, Surface `#101725`, Elevated `#182235`, Hairline `#253248`, Primary Text `#F4F6FA`, Secondary `#A8B5CB`.
- **Light Mode:** Canvas `#F3F0E8`, Surface `#FFFFFF`, Elevated `#E9E4D8`, Hairline `#D8D1C2`, Primary Text `#111827`, Secondary `#3E4A5E`.
- **Category & Functional Accents:**
  - Coral Primary (`#F2545B` dark / `#C9333A` light): Primary actions, active tab, Easter Eggs.
  - Turquoise Complete (`#10B981` dark / `#0A7B56` light): Completed state, Confirmed badge, Locations.
  - Amber Gold (`#F59E0B` dark / `#A16207` light): Community/Rumor badge, Money & Heist.
  - Sky Cyan (`#38BDF8` dark / `#0369A1` light): Rare Vehicles.
  - Crimson Steel (`#FB7185` dark / `#BE123C` light): Hidden Weapons.
  - Sand Violet (`#A78BFA` dark / `#6D28D9` light): Characters & Factions.

## 3. Typography
- **Display & Telemetry HUD:** `'Chakra Petch', 'Barlow Condensed', sans-serif` (Sharp angular gaming geometry).
- **Body & Controls:** `'Plus Jakarta Sans', system-ui, sans-serif` (Crisp readability on mobile & desktop).
- **Numbers:** `font-variant-numeric: tabular-nums` across all counters, percentages, and USD values.

## 4. Visual Craft & Anti-Slop Locks
- Custom AAA-style twilight key art (`assets/hero-leonida.jpg`) with left-scrim contrast protection (`fetchpriority="high"`).
- Top-down dark satellite tactical map (`assets/leonida-map-bg.jpg`) with precisely aligned coordinates and SVG category icons (zero emojis).
- Zero em dashes (`—`), zero fake stats, zero dead buttons, full keyboard navigation + `prefers-reduced-motion` support.
