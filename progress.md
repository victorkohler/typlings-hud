# Progress

Living log of what has been built. Updated as each phase/component is completed.

---

## Completed

### Phase 1: Project Scaffold (2026-04-04)
- Vite + React project initialized manually (non-empty dir)
- Directory structure created per CLAUDE.md architecture
- `variables.css` with full CSS custom properties from design palette
- `bg-poster.jpg` copied to `src/assets/`
- Git repo initialized with initial commit
- All component stubs created with CSS module files
- `useConfigurator.js` hook with all state, data constants, pricing logic

### Phase 2: Shell & Navigation (2026-04-04)
- `TabBar.jsx` — 4 tabs with inline SVG icons, active/inactive color states, completion badges (red circle + white checkmark), dynamic Product tab label/icon swap on product selection
- `HudPanel.jsx` — White panel with rounded top corners, shadow, CSS height transition (65vh expanded / 240px collapsed), inner flex layout for scrollable tab content
- `CartButton.jsx` — Two visual modes: dark "SELECT PRODUCT" (State 1) / coral "ADD TO CART" (States 2–4), disabled state at 0.45 opacity, scale(0.98) press feedback, dynamic price
- `App.jsx` — Full-height flex column shell wiring hook to all components
- Global reset added to `variables.css` (box-sizing, margin/padding, full-height body)

### Post-Phase 2 tweaks (2026-04-04)
- Replaced hand-drawn SVG tab icons with real icons from `design/assets/icons/`
- Product tab shows `product-icon-001` by default, swaps to `poster-icon-001` on product selection
- Removed 200ms color transition on tab switch — now instant
- Removed bold (`font-weight: 600`) on active tab label — differentiated by color only
- Changed CTA coral color from `#E8745A` to `#e74024` (updated variables.css + all design .md files; Coral swatch in Design Picker kept as `#E8745A`)
- Tab bar redesigned: `#f2f2f2` background, sliding `#fcfcfc` rounded indicator behind active tab. Indicator animates with 350ms cubic-bezier, tab state changes instantly.

---

## Current Phase

**Phase 3: State 1 — Product Selector**

---

## Notes & Decisions

- 2026-04-04: Design docs finalized. Added size selector, frame selector, and product description to State 1 spec. CTA has two modes: dark "SELECT PRODUCT" (State 1) and coral "ADD TO CART" (States 2-4). State 1 advance is CTA-driven, not auto-advance on product selection.
- 2026-04-04: Chose CSS Modules over Sass/Less — Vite supports them out of the box, no preprocessor dependency needed. One `.module.css` file per component.
- 2026-04-04: Vite scaffold done manually (not via `create-vite`) because directory already had design docs and CLAUDE.md.
- 2026-04-04: CTA coral changed to `#e74024` per user request. The Coral poster swatch remains `#E8745A` — these are different things (UI brand vs poster content color).
- 2026-04-04: Tab bar uses sliding indicator rather than per-tab background. Indicator position measured via refs + `useLayoutEffect` to handle variable label widths.
