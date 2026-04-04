# Roadmap

Build phases for the poster configurator prototype. Each phase results in something visually testable.

---

## Phase 1: Project Scaffold

Set up Vite + React, file structure per CLAUDE.md, CSS variables, copy assets.

- [ ] Initialize Vite React project
- [ ] Create directory structure (`components/`, `hooks/`, `assets/`, `styles/`)
- [ ] Create `variables.css` from color palette template
- [ ] Copy `bg-poster.jpg` into `src/assets/`
- [ ] Initialize git repo
- [ ] Verify `npm run dev` works with a blank app

---

## Phase 2: Shell & Navigation

App layout, HUD panel, tab bar — the structural skeleton everything else mounts into.

- [ ] `useConfigurator.js` — shared state hook (active tab, selections, completions, pricing)
- [ ] `App.jsx` — full-height flex layout (preview area + HUD + CTA)
- [ ] `HudPanel.jsx` — white panel with border-radius, expand/collapse height transition
- [ ] `TabBar.jsx` — 4 tabs with icons, active state, completion badges
- [ ] `CartButton.jsx` — sticky CTA with two modes (black/coral), disabled state, press feedback
- [ ] Tab switching works, HUD height animates between expanded/collapsed

---

## Phase 3: State 1 — Product Selector

The most complex state: product grid, size picker, frame picker, CTA-driven advance.

- [ ] `ProductSelector.jsx` — section title, product grid, size selector, frame selector, description
- [ ] Product card selection with visual feedback
- [ ] Size pills with price display
- [ ] Frame cards with dynamic relative pricing
- [ ] CTA enables on product selection, shows computed price
- [ ] CTA tap advances to State 2 (tab switch + HUD collapse + CTA mode transition)

---

## Phase 4: Poster Preview

Background image with live content rendering inside the frame.

- [ ] `PosterPreview.jsx` — background image, content zone overlay
- [ ] Carousel dots (decorative, pill container, hidden in State 1)
- [ ] Live text rendering in content zone
- [ ] Typography style changes based on layout selection
- [ ] Text color changes based on design selection
- [ ] Pattern background applied to content zone
- [ ] Orientation (horizontal/vertical) rotation

---

## Phase 5: State 2 — Text Personalizer

- [ ] `TextPersonalizer.jsx` — label + textarea
- [ ] Live text → poster preview (zero-latency, no debounce)
- [ ] Focus border transition
- [ ] Completion badge triggers on first non-whitespace character
- [ ] Font size >=16px to prevent iOS zoom

---

## Phase 6: State 3 — Layout Picker

- [ ] `LayoutPicker.jsx` — horizontal scrollable card row + orientation toggle
- [ ] Drag-to-scroll with momentum (touch + mouse)
- [ ] Layout card selection applies typography style to poster
- [ ] Orientation toggle (horizontal/vertical) rotates poster text
- [ ] Completion badge on first layout selection

---

## Phase 7: State 4 — Design Picker

- [ ] `DesignPicker.jsx` — solid color swatches + pattern swatches
- [ ] Swatch selection feedback (border + scale)
- [ ] Mutual exclusivity (solid deselects pattern, vice versa)
- [ ] Solid color changes poster text color
- [ ] Pattern changes poster content zone background
- [ ] Completion badge on first selection

---

## Phase 8: Polish & Edge Cases

- [ ] All transitions feel smooth at 60fps
- [ ] 375px viewport (iPhone SE) — no overflow, no clipping
- [ ] All tap targets >= 44px
- [ ] CTA never overlaps HUD content
- [ ] Keyboard handling on mobile (textarea focus doesn't break layout)
- [ ] Test on real device via `--host`
