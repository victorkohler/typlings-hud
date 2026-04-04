# Interaction Specifications

This document describes **how things move and respond** — the behaviors that static screenshots cannot capture. Every transition, gesture, and state change is defined here.

---

## Page Model

The entire configurator lives on a **single page with zero navigation or page reloads**. All state changes happen in-place through animated transitions of the HUD panel and live updates to the poster preview.

---

## Tab Navigation

### Switching Tabs
- **Trigger:** Tap on any tab in the tab bar
- **Content transition:** Immediate swap (no crossfade or slide — content simply replaces)
- **HUD height:** Animates to target height over `400ms` with `cubic-bezier(0.4, 0, 0.2, 1)`
  - Product tab → expanded (~65vh)
  - Any other tab → collapsed (~240px)
- **Active tab indicator:** Color changes with `200ms ease` transition
- **Poster preview:** Adjusts to fill available space above HUD (flex layout handles this automatically)

### Completion Badges
- **Trigger:** First meaningful interaction within a tab's content
  - Product: selecting any product (badge appears immediately on selection, before advancing)
  - Personalize: typing any non-whitespace character
  - Layout: selecting any layout
  - Design: selecting any color or pattern
- **Badge appearance:** Immediate (no animation — badge simply appears)
- **Persistence:** Once set, a badge stays for the session. It does not unset if the user clears their choice.

---

## State 1: Product Selection & Configuration

### Product Card Selection
- **Trigger:** Tap on a product card
- **Immediately** (0ms):
  - Card gets selected styling (border color, background)
  - Product tab label changes to product name (e.g., "Product" → "Poster")
  - Product tab icon changes to product-specific icon
  - Completion badge appears on Product tab
- The user remains on State 1 to configure size and frame before advancing.

### Size Selection
- **Trigger:** Tap on a size pill
- **Immediately:** Selected pill gets accent border + warm background, previous deselects
- **Price update:** CTA price updates immediately to reflect new size + frame total
- **Default:** First size is pre-selected when a product is chosen

### Frame Selection
- **Trigger:** Tap on a frame card
- **Immediately:** Selected card gets accent border, previous deselects
- **Price deltas update:** All frame cards recalculate their displayed price delta relative to the new selection (see `specs.md` dynamic pricing)
- **CTA price update:** Total price updates immediately
- **Default:** "No Frame" is pre-selected

### State 1 → State 2: CTA-Driven Advance

Unlike States 2–4 where product auto-advances, State 1 requires the user to explicitly tap the CTA button to proceed.

#### Sequence
1. User taps "SELECT PRODUCT – {price}" CTA
2. **Immediately** (0ms):
   - Active tab switches to "Personalize"
   - HUD height animates from expanded to collapsed (400ms)
   - Tab bar active state transitions to Personalize tab
   - CTA button transitions: background `#2D2D2D` → `#e74024`, text changes to "ADD TO CART – {price}" (300ms)

### Why explicit advance matters
The product tab has multiple sub-selections (product, size, frame). Auto-advancing on product tap would skip the size/frame configuration. The CTA acts as a "confirm and continue" action.

---

## State 2: Live Text Rendering

### Text Input → Poster Preview
- **Latency:** Immediate (every keystroke updates the poster)
- **No debounce.** The preview must feel 1:1 connected to the input.
- **Empty state:** When textarea is empty, poster shows nothing (blank canvas inside frame)
- **Overflow behavior:** Long text wraps within the poster content zone. Max width ~70% of frame, `word-break: break-word`, `line-height: 1.2`

### Textarea Focus
- **Border color:** Transitions from `#E0DCD4` to `#D4402A` over 200ms on focus
- **No zoom on iOS:** Ensure font-size ≥ 16px to prevent Safari auto-zoom on focus
- **Keyboard management:** On mobile, the HUD should remain visible above the keyboard. The viewport should adjust naturally — do NOT manually reposition.

---

## State 3: Layout Picker

### Horizontal Scroll (Drag-to-Scroll)
- **Gesture:** Touch drag (or mouse drag on desktop) horizontally across the layout card row
- **Velocity multiplier:** 1.5× the drag distance
- **Momentum:** Use native `-webkit-overflow-scrolling: touch` on iOS, `scroll-behavior: smooth` fallback
- **Cursor:** `grab` default → `grabbing` while dragging
- **User select:** Disabled during drag (`user-select: none`)
- **Scroll snap:** None (free scrolling, no snapping to cards)

### Layout Selection
- **Trigger:** Tap on a layout card
- **Card feedback:** Border and background change with 200ms transition
- **Poster update:** Typography style changes immediately based on selected layout
- **No auto-advance.** User stays on Layout tab — they switch to Design manually.

### Orientation Toggle
- **Trigger:** Tap Horizontal or Vertical button
- **Button transition:** Background and text color swap over 250ms
- **Poster update:** Text rotates 90° (vertical) or resets (horizontal) — applied immediately
- **Transform:** `rotate(90deg)` on the poster text container for vertical mode

---

## State 4: Design Picker

### Swatch Selection
- **Trigger:** Tap on a color or pattern swatch
- **Feedback:** Border thickens to 2.5px + `scale(1.15)` transform, both over 200ms
- **Mutual exclusivity:** Selecting a solid color deselects any pattern, and vice versa
- **Poster update:** Immediate
  - Solid color → changes poster text color
  - Pattern → changes poster content zone background

### Swatch Deselection
- Tapping an already-selected swatch does NOT deselect it. Swatches can only be changed, not cleared.

---

## CTA Button

### Two Modes

The CTA has different behavior depending on the active tab:

#### State 1 mode ("SELECT PRODUCT")
- **Background:** `#2D2D2D` (near black)
- **Text:** `SELECT PRODUCT - {price}`
- **Disabled:** Shown before any product is selected — same background but opacity 0.45, non-interactive
- **Enabled:** When a product is selected (opacity 1, interactive)
- **Action on tap:** Advances to State 2 (Personalize tab)

#### States 2–4 mode ("ADD TO CART")
- **Background:** `#e74024` (coral)
- **Text:** `ADD TO CART - {price}`
- **Always enabled** (a product must be selected to reach these states)
- **Action on tap:** Adds to cart (visual feedback only in prototype)

### Mode Transition
- Triggered when leaving State 1 (either via CTA tap or direct tab navigation after product selection)
- Background, text, and color transition over `300ms ease`

### Press Feedback
- **On press (mousedown/touchstart):** `transform: scale(0.98)` — immediate
- **On release (mouseup/touchend):** `transform: scale(1)` — immediate

---

## Poster Preview

### Content Rendering Rules
1. Text appears centered within the poster frame's content zone
2. Typography style is determined by the selected layout (see `specs.md` layout table)
3. Text color is determined by the selected solid color (default: `#2D2D2D`)
4. Background tint is determined by the selected pattern (default: transparent)
5. Orientation (horizontal/vertical) applies a rotation transform to the text container
6. All updates are immediate — no debounce, no animation on content change

### Carousel Dots
- Currently decorative only (no swipe/carousel functionality in this prototype version)
- If carousel is implemented later: swipe left/right to see alternate preview angles

---

## Accessibility Notes (Prototype Scope)

These are nice-to-haves for the prototype, required for production:

- All interactive elements should be focusable and keyboard-navigable
- Swatches should have `aria-label` with color name
- Tab bar should use `role="tablist"` / `role="tab"` semantics
- CTA disabled state should use `aria-disabled="true"`
- Layout cards should be announced by screen readers with layout name

---

## Performance Targets

Even as a prototype, these should hold:

- **First paint:** < 1s on localhost
- **Tab switch render:** < 16ms (single frame — no layout thrash)
- **Text input → preview update:** < 16ms (must feel zero-latency)
- **HUD height animation:** 60fps, no jank (CSS transitions only, no JS-driven animation)
