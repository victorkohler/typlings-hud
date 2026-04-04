# Color Palette

All colors used in the configurator, with semantic names. These map directly to CSS custom properties in `src/styles/variables.css`.

---

## Brand / Accent

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-accent` | `#D4402A` | Active tabs, selected borders, completion badges, focused input borders |
| `--color-cta` | `#e74024` | CTA button background (States 2–4, coral) |
| `--color-cta-product` | `#2D2D2D` | CTA button background (State 1, near black) |
| `--color-cta-disabled` | `#C8C4BC` | CTA button background (disabled state) |

## Neutrals

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-text-primary` | `#333333` | Primary text, product names/prices, section labels |
| `--color-text-secondary` | `#999999` | Inactive tab labels, placeholder text, secondary labels |
| `--color-text-muted` | `#666666` | Unselected layout labels |
| `--color-white` | `#FFFFFF` | HUD background, CTA text, badge checkmark |
| `--color-bg-warm` | `#F5F0E8` | Page background fallback (behind poster image) |

## Surfaces

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-surface-card` | `#E8E4DC` | Product card background, unselected layout card background |
| `--color-surface-card-selected` | `#FDF5F2` | Selected product card background |
| `--color-surface-card-accent` | `#FCE8E4` | Selected layout card background |
| `--color-surface-thumbnail` | `#C8C4BC` | Product thumbnail placeholder |
| `--color-border-subtle` | `#F0ECE4` | Tab bar bottom border |
| `--color-border-input` | `#E0DCD4` | Textarea border (default) |
| `--color-border-swatch` | `#D0CCC4` | Swatch border (default) |

## Poster Content Colors (User-Selectable)

### Solid Colors
| Hex | Name |
|-----|------|
| `#E8745A` | Coral |
| `#2D2D2D` | Charcoal |
| `#4A6741` | Forest |
| `#3B5998` | Slate Blue |
| `#8B4513` | Saddle Brown |
| `#DAA520` | Goldenrod |

### Pattern Backgrounds
| Hex | Name |
|-----|------|
| `#F5E6D3` | Cream |
| `#E8D5B7` | Wheat |
| `#D4C5A9` | Sand |
| `#C0B59B` | Khaki |
| `#ACA58D` | Sage |

## Shadows

| Variable | Value | Usage |
|----------|-------|-------|
| `--shadow-hud` | `0 -4px 24px rgba(0,0,0,0.08)` | HUD panel top shadow |

---

## CSS Variables Template

```css
:root {
  /* Brand */
  --color-accent: #D4402A;
  --color-cta: #e74024;
  --color-cta-product: #2D2D2D;
  --color-cta-disabled: #C8C4BC;

  /* Text */
  --color-text-primary: #333333;
  --color-text-secondary: #999999;
  --color-text-muted: #666666;
  --color-white: #FFFFFF;
  --color-bg-warm: #F5F0E8;

  /* Surfaces */
  --color-surface-card: #E8E4DC;
  --color-surface-card-selected: #FDF5F2;
  --color-surface-card-accent: #FCE8E4;
  --color-surface-thumbnail: #C8C4BC;
  --color-border-subtle: #F0ECE4;
  --color-border-input: #E0DCD4;
  --color-border-swatch: #D0CCC4;

  /* Shadows */
  --shadow-hud: 0 -4px 24px rgba(0,0,0,0.08);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;

  /* Radii */
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 28px;

  /* Timing */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-panel: 400ms;
  --ease-panel: cubic-bezier(0.4, 0, 0.2, 1);
}
```
