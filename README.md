# Poster Configurator Prototype

Interactive prototype for a mobile-first poster personalization store. Built to explore and test UX patterns for complex product customization on small screens.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Use Chrome DevTools device emulation (iPhone 12/13/14 Pro, 390×844) for the intended experience.

## What This Is

A **standalone prototype** — not a production app. It simulates the poster configuration flow:

1. **Select product** (poster, t-shirt, etc.)
2. **Personalize** (type text that appears live on the poster)
3. **Choose layout** (typography style + orientation)
4. **Pick design** (text color + background pattern)

All on one page, with a bottom-anchored HUD that morphs between states.

## Project Structure

```
poster-store/
├── CLAUDE.md                  ← AI assistant instructions
├── README.md                  ← You are here
├── design/
│   ├── specs.md               ← Visual specs (colors, sizes, spacing)
│   ├── interactions.md        ← Animation & behavior specs
│   ├── screens/               ← Reference mockup screenshots
│   │   ├── 01-product.png
│   │   ├── 02-personalize.png
│   │   ├── 03-layout.png
│   │   └── 04-design.png
│   └── assets/
│       ├── bg-poster.jpg      ← Background image
│       ├── colors.md          ← Full color palette
│       └── icons/             ← SVG icon sources
├── src/
│   ├── App.jsx
│   ├── components/            ← One file per UI component
│   ├── hooks/                 ← Shared state logic
│   ├── assets/                ← Images used by components
│   └── styles/
│       └── variables.css      ← CSS custom properties
├── index.html
├── package.json
└── vite.config.js
```

## Design Docs

| Document | Purpose |
|----------|---------|
| [`design/specs.md`](design/specs.md) | Pixel-level measurements, colors, typography |
| [`design/interactions.md`](design/interactions.md) | Transitions, gestures, state machine behaviors |
| [`design/assets/colors.md`](design/assets/colors.md) | Complete color palette with CSS variable mapping |

## Architecture Decisions

- **React + Vite** — fast HMR, zero config, tiny footprint
- **No CSS framework** — CSS custom properties + modules/inline styles
- **No animation library** — CSS transitions only
- **No state library** — React hooks only
- **No icon library** — inline SVG components
- **Components are self-contained** — swap any component by changing one import

## Testing the Prototype

### On Desktop
Use Chrome DevTools → Toggle Device Toolbar → select a mobile device preset.

### On Mobile (same network)
1. Find your local IP: `ifconfig | grep inet`
2. Run `npm run dev -- --host`
3. Open `http://<your-ip>:5173` on your phone

### Sharing with Stakeholders
Build and serve the static output:
```bash
npm run build
npx serve dist
```
The `dist/` folder is a self-contained static site — drop it on any hosting (Netlify, Vercel, S3, etc.) for shareable review links.

## Component Isolation

Each component in `src/components/` is designed to work independently. To test a component in isolation or swap an alternative version:

1. Create a new version (e.g., `LayoutPickerV2.jsx`)
2. Change the import in `App.jsx`
3. No other files need to change

This makes A/B testing different UX approaches fast and safe.
