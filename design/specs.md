# Design Specifications

All values are extracted from the reference mockups in `design/screens/`. This document is the source of truth — when screenshots and this spec disagree, follow this spec.

---

## Global

### Viewport & Frame
- **Target device:** 375–430px wide (iPhone SE through iPhone Pro Max)
- **Layout:** Single full-height column, no horizontal scroll
- **Background:** Warm off-white wall texture with directional shadow (see `assets/bg-poster.jpg`)

### Typography
- **UI labels & buttons:** `'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif`
- **Decorative/section titles:** `'Georgia', serif` — italic where used for section headers
- **Poster content (default layout):** `'Helvetica Neue', sans-serif`, 700 weight, uppercase, letter-spacing 4px
- **Base font size:** 15px for body text, 11px for tab labels, 12–13px for secondary labels

### Spacing Scale
Use consistent multiples of 4px:
- `4px` — tight (icon-to-label gap)
- `8px` — compact (between small elements)
- `12px` — standard (grid gaps, section padding)
- `16px` — comfortable (container padding)
- `24px` — generous (bottom safe area padding)

---

## Poster Preview Area

- **Position:** Top section of viewport, fills available space above HUD
- **Poster frame:** Visible in background image — wooden frame, slightly angled on wall
- **Content zone:** Approximately centered within the frame area
  - Top offset: ~13% from image top
  - Left offset: ~16% from image left
  - Width: ~68% of image width
  - Height: ~62% of image height
- **Live text:** Renders in real-time as user types in Personalize tab
- **Carousel dots:** 3 dots centered at bottom of preview area
  - **Container:** Pill-shaped, `background: rgba(255,255,255,0.85)`, border-radius 12px, padding `4px 10px`
  - Dot size: 8×8px, circular
  - Active dot: white, solid
  - Inactive dots: white at 50% opacity
  - Gap: 6px
  - Border: 1px solid rgba(0,0,0,0.15)
  - **Visibility:** Hidden when HUD is expanded (State 1). Visible in States 2–4 only.

---

## HUD Panel

### Container
- **Background:** `#FFFFFF`
- **Border radius:** `20px 20px 0 0` (top corners only)
- **Box shadow:** `0 -4px 24px rgba(0,0,0,0.08)`
- **Expanded height** (Product tab): `~65vh`
- **Collapsed height** (all other tabs): `~240px`
- **Height transition:** `400ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Overflow:** Hidden on container, scrollable on content area

### Tab Bar
- **Padding:** `14px 8px 8px`
- **Bottom border:** `1px solid #F0ECE4`
- **Layout:** Flex, space-around
- **Tab items:**
  - Direction: column (icon above label)
  - Gap: 4px
  - Padding: `4px 12px`
  - **Active color:** `#D4402A`
  - **Inactive color:** `#999999`
  - **Label font:** 11px, weight 400, letter-spacing 0.3px
  - **Color change:** Instant (no transition — snappier feel)

### Tab Icons (inline SVG, 22×22px)
| Tab | Icon | Description |
|-----|------|-------------|
| Product | Checkbox grid | Two overlapping rounded squares, front one has a checkmark. When product is selected, icon changes to product-specific (e.g., framed poster icon for "Poster") |
| Personalize | Typography T | Uppercase "T" with serif details |
| Layout | Grid | Four-square grid (2×2) |
| Design | Palette | Decorative rosette / diamond shape |

### Completion Badge
- **Size:** 12×12px
- **Position:** Top-right of icon, offset `top: -2px, right: -6px`
- **Background:** `#D4402A` circle
- **Checkmark:** White, stroke-width 1.8, round caps

---

## State 1: Product Selector

### Section Title
- Font: Georgia, italic, 16px
- Color: `#333333`
- Margin bottom: 16px
- Text: "Typling products"

### Product Grid
- **Layout:** 2-column grid
- **Gap:** 12px
- **Card:**
  - Background: `#E8E4DC`
  - Border radius: 12px
  - Border: 2px solid transparent (default), `2px solid #D4402A` (selected)
  - Selected background: `#FDF5F2`
  - **Thumbnail:** aspect-ratio 4:5, top corners radius 10px. Displays product photo; fallback background `#C8C4BC` while loading.
  - **Label:** Centered below thumbnail, padding `10px 12px`, 14px, weight 500, `#333333`

### Size Selector
- **Header row:** Flex, space-between
  - Left: "Select size" — 13px, weight 600, `#333333`
  - Right: "Size guide" — 12px, weight 400, `#D4402A` (non-functional in prototype, visual only)
- **Options:** Vertical stack, gap 8px
- **Size pill:**
  - Width: 100%
  - Padding: `12px 16px`
  - Border radius: 12px
  - Border: `1.5px solid #E0DCD4` (default), `1.5px solid #D4402A` (selected)
  - Background: `#FFFFFF` (default), `#FDF5F2` (selected)
  - Font: 14px, weight 500, `#333333`
  - **Price label:** Right-aligned, 14px, weight 600, `#333333` (shown on selected size)
  - Transition: `200ms ease`
- **Available sizes:**
  | Label | Price |
  |-------|-------|
  | 30x40cm | 399kr |
  | 50x70cm | 499kr |

### Product Description
- **Position:** Below size selector, margin top 8px
- **Layout:** Flex, space-between
- **Text:** 12px, italic, `#999999` — e.g., "Printed on high quality super heavy nice paper"
- **Price:** 12px, weight 600, `#333333` — mirrors selected size price

### Frame Selector
- **Header row:** Flex, space-between
  - Left: "Select Frame" — Georgia, italic, 16px, `#333333`
  - Right: "Our frames" — 12px, weight 400, `#D4402A` (non-functional in prototype, visual only)
- **Layout:** Horizontal row, gap 12px
- **Frame card:**
  - Width: ~72px
  - Border radius: 10px
  - Border: 2px solid transparent (default), `2px solid #D4402A` (selected)
  - **Thumbnail:** Square, aspect-ratio 1:1, background `#C8C4BC`, top corners radius 8px
  - **Label:** 11px, weight 500, `#333333`, centered below thumbnail, padding top 6px
  - **Price delta:** 10px, weight 400, `#999999`, centered below label
- **Available frames:**
  | Name | Base delta |
  |------|-----------|
  | Light Oak | +300kr |
  | Dark Oak | +300kr |
  | White | +300kr |
  | No Frame | +0kr |
- **Dynamic pricing:** Price deltas are relative to the current selection:
  - If no frame is selected (or "No Frame" selected): wooden frames show `+300kr`, "No Frame" shows `+0kr`
  - If a wooden frame is selected: other wooden frames show `+0kr`, "No Frame" shows `−300kr`

---

## State 2: Text Personalizer

### Label
- Font: Georgia, italic, 13px
- Color: `#999999`
- Margin bottom: 8px
- Text: "Write a name, a quote, a song lyric or anything else"

### Textarea
- Min height: 80px
- Border: `1.5px solid #E0DCD4` (default), `1.5px solid #D4402A` (focused)
- Border radius: 12px
- Padding: 14px
- Font: 15px, Helvetica Neue
- Color: `#333333`
- Background: white
- Resize: none
- Border transition: `200ms ease`

---

## State 3: Layout Picker

### Layout Card Row
- **Scroll:** Horizontal overflow, drag-to-scroll enabled
- **Scroll behavior:** Touch-friendly, momentum scrolling (`-webkit-overflow-scrolling: touch`)
- **Drag velocity multiplier:** 1.5x
- **Gap:** 10px
- **Card:**
  - Width: 64×64px
  - Border radius: 10px
  - Background: `#E8E4DC` (default), `#FCE8E4` (selected)
  - Border: 2px solid transparent (default), `2px solid #D4402A` (selected)
  - Transition: `200ms ease`
- **Card label:** 11px, `#666666` (default), `#D4402A` + weight 600 (selected)

### Orientation Toggle
- **Margin top:** 12px, centered
- **Container:** Inline-flex, border radius 20px, border `1.5px solid #D4402A`
- **Buttons:**
  - Padding: `8px 20px`
  - Font: 12px, weight 600
  - Active: background `#D4402A`, color white
  - Inactive: background transparent, color `#D4402A`
  - Transition: `250ms ease`

### Available Layouts
| ID | Name | Typography Style |
|----|------|-----------------|
| `boxed` | Boxed | Georgia, serif, 28px, letter-spacing 6px, uppercase |
| `wave` | Wave | Brush Script MT / cursive, 36px |
| `pattern` | Pattern | Helvetica Neue, 32px, 700 weight, letter-spacing 4px, uppercase |
| `circular` | Circular | Georgia, 24px, letter-spacing 8px, uppercase, circular border |
| `hero` | Hero | Impact, 48px, letter-spacing 2px, uppercase |

---

## State 4: Design Picker

### Section Labels
- Font: Georgia, italic, 13px, `#333333`
- Layout: Flex row, gap between "Solid color" (left) and "Pattern" (right)
- Margin bottom: 8px

### Color Swatches
- **Size:** 32×32px, circular
- **Border:** `1.5px solid #D0CCC4` (default), `2.5px solid #D4402A` (selected)
- **Selected transform:** `scale(1.15)`
- **Gap:** 10px
- **Transition:** `200ms ease` on border + transform

### Solid Colors
| Hex | Description |
|-----|-------------|
| `#E8745A` | Coral / primary accent |
| `#2D2D2D` | Near black |
| `#4A6741` | Forest green |
| `#3B5998` | Slate blue |
| `#8B4513` | Saddle brown |
| `#DAA520` | Goldenrod |

### Pattern Swatches
Same sizing as solid colors. Background rendered with `repeating-linear-gradient(45deg)` using 3px stripe width and 6px repeat.

| Hex | Description |
|-----|-------------|
| `#F5E6D3` | Cream |
| `#E8D5B7` | Wheat |
| `#D4C5A9` | Sand |
| `#C0B59B` | Khaki |
| `#ACA58D` | Sage |

---

## CTA Button

- **Position:** Fixed at bottom, below HUD, inside its own container
- **Container padding:** `12px 16px 24px` (24px bottom for iOS safe area)
- **Container background:** white (continuous with HUD)
- **Button width:** 100%
- **Padding:** `16px 0`
- **Border radius:** 28px
- **Font:** 15px, weight 700, uppercase, letter-spacing 1.2px
- **Press feedback:** `scale(0.98)` on mousedown/touchstart
- **Background transition:** `300ms ease`
- **CRITICAL:** Must never overlap or cover HUD content. Always anchored below.

### State 1 (Product tab) appearance
- **Background:** `#2D2D2D` (near black)
- **Color:** white
- **Text format:** `SELECT PRODUCT - {price}` (price = size price + frame delta)
- **Action:** Advances to State 2 (Personalize tab)
- **Disabled state:** Same background `#2D2D2D` but opacity 0.45, cursor default — shown when no product is selected

### States 2–4 appearance
- **Background:** `#e74024` (coral)
- **Color:** white
- **Text format:** `ADD TO CART - {price}` (price = size price + frame delta)
- **Action:** Adds to cart (visual feedback only in prototype)
- **Condition:** Only reachable after a product has been selected
