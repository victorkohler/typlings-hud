# Poster Configurator — Prototype

## What This Is

A **high-fidelity interactive prototype** of a mobile-first poster personalization configurator. This is NOT a production app — it's a design exploration tool for testing UX patterns around complex product customization on small screens.

The reference interaction model is the furniture configurator at tylko.com: a persistent live preview with a bottom-anchored HUD that morphs between configuration states, all on a single page with zero reloads.

## Role & Mindset

You are a **Senior UI/UX Engineer** building this prototype. You balance design fidelity with pragmatic code decisions. When making tradeoffs, favor:

1. **Interaction quality** over pixel perfection — how things *move and respond* matters more than static appearance
2. **Component isolation** over DRY code — duplicating a few lines is fine if it keeps components independent and testable
3. **Prototype speed** over production polish — we're testing ideas, not shipping to millions

## Architecture Rules

### Component Encapsulation

Every major UI piece must be a self-contained component with its own file:

```
src/
├── App.jsx                    ← Shell: layout, state orchestration, nothing else
├── components/
│   ├── PosterPreview.jsx      ← Background image + live poster content rendering
│   ├── HudPanel.jsx           ← The bottom panel shell (expand/collapse, tabs)
│   ├── TabBar.jsx             ← Navigation tabs with completion badges
│   ├── ProductSelector.jsx    ← Product grid, size selector, frame selector (State 1)
│   ├── TextPersonalizer.jsx   ← Text input (State 2)
│   ├── LayoutPicker.jsx       ← Layout cards + orientation toggle (State 3)
│   ├── DesignPicker.jsx       ← Color/pattern swatches (State 4)
│   └── CartButton.jsx         ← Sticky CTA button
├── hooks/
│   └── useConfigurator.js     ← All shared state: selections, completions, active tab
├── assets/
│   ├── bg-poster.jpg
│   └── icons/
└── styles/
    └── variables.css           ← CSS custom properties (colors, radii, timing)
```

### Key Principles

- **Props down, callbacks up.** Components receive state via props and emit changes via callback props. No component reaches into another's internals.
- **Single state owner.** The `useConfigurator` hook owns all configurator state. `App.jsx` calls the hook and passes slices to children.
- **No global CSS side effects.** Each component scopes its own styles (CSS modules, inline styles, or a `[data-component]` attribute pattern). Changing one component's styles must never break another.
- **Swappable components.** We should be able to replace `LayoutPicker` with `LayoutPickerV2` by changing one import in `App.jsx` — nothing else.

### Dependency Policy

Keep dependencies **minimal**. This is a prototype that needs to spin up fast on any machine.

- **Framework:** React (via Vite) — fast HMR, zero-config
- **Styling:** CSS custom properties + CSS modules or inline styles. No Tailwind, no styled-components, no UI libraries.
- **Animation:** CSS transitions and `@keyframes` only. No Framer Motion, no GSAP. If we need JS-driven animation, use `requestAnimationFrame` directly.
- **State:** React hooks only. No Redux, no Zustand, no context (unless a component tree gets 3+ levels deep, which it shouldn't in this prototype).
- **Icons:** Inline SVG components. No icon library.
- **Build:** Vite with default React template. Nothing else.

The entire project should install and run with:
```bash
npm install
npm run dev
```

## Design Reference

Before making ANY visual change, consult these files:

| File | What it covers |
|------|---------------|
| `design/specs.md` | Exact measurements, colors, typography, spacing |
| `design/interactions.md` | Transitions, animations, state change behaviors |
| `design/assets/colors.md` | Full color palette with semantic names |
| `design/screens/` | Reference screenshots for each configurator state |

When a design spec and a screenshot disagree, **the spec wins** (specs are updated more frequently).

## The Four States

| # | Tab | HUD Size | Key Interaction |
|---|-----|----------|-----------------|
| 1 | Product | Expanded (~65vh) | Grid of products, size selector, frame selector. User configures all options then taps CTA ("SELECT PRODUCT") to advance to State 2. Tab label changes from "Product" → product name (e.g., "Poster"). |
| 2 | Personalize | Collapsed (~240px) | Text input. Typed text renders live on the poster preview. |
| 3 | Layout | Collapsed (~240px) | Horizontally scrollable layout cards (drag-to-scroll). Horizontal/Vertical toggle. |
| 4 | Design | Collapsed (~240px) | Solid color swatches + pattern swatches. Selection applies live to poster. |

## Quality Checklist

Before considering any component "done":

- [ ] Works on 375px viewport (iPhone SE) without overflow or clipping
- [ ] Tap targets are ≥44px
- [ ] Animations feel snappy (≤400ms for state transitions, ≤200ms for micro-interactions)
- [ ] Component can be rendered in isolation without errors
- [ ] No hardcoded pixel values that should be CSS variables
- [ ] CTA button is always visible and never overlaps HUD content
