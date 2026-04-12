import bgPoster from '../assets/bg-poster.jpg'

// Per-layout typography. The default (no layout selected) mirrors the
// `pattern` entry — that matches the reference screenshots where nothing has
// been chosen yet but the text still reads as a bold sans-serif headline.
const LAYOUT_TYPOGRAPHY = {
  boxed: {
    fontFamily: 'Georgia, serif',
    fontSize: '28px',
    letterSpacing: '6px',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  wave: {
    fontFamily: '"Brush Script MT", "Apple Chancery", cursive',
    fontSize: '36px',
    letterSpacing: 'normal',
    fontWeight: 400,
    textTransform: 'none',
  },
  pattern: {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: '32px',
    letterSpacing: '4px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  circular: {
    fontFamily: 'Georgia, serif',
    fontSize: '24px',
    letterSpacing: '8px',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  hero: {
    fontFamily: 'Impact, "Haettenschweiler", "Arial Narrow Bold", sans-serif',
    fontSize: '48px',
    letterSpacing: '2px',
    fontWeight: 400,
    textTransform: 'uppercase',
  },
}
const DEFAULT_TYPOGRAPHY = LAYOUT_TYPOGRAPHY.pattern

// Swatch hex lookups — mirror the arrays in useConfigurator so PosterPreview
// doesn't need to receive the raw swatch data. Kept local because this is the
// only consumer and the lists are short. Both solid colors and patterns tint
// the content-zone background (they're mutually exclusive ways to set the
// same surface). `none` is intentionally not in SOLID_COLOR_HEX — the lookup
// returns undefined and the conditional below falls through to "no fill".
const SOLID_COLOR_HEX = {
  charcoal: '#2D2D2D',
  coral: '#E8745A',
  forest: '#4A6741',
  'slate-blue': '#3B5998',
  'saddle-brown': '#8B4513',
  goldenrod: '#DAA520',
  burgundy: '#7B1F2B',
  teal: '#2F6F6B',
}

const PATTERN_HEX = {
  cream: '#F5E6D3',
  blush: '#F8D7D1',
  sage: '#CFDBC5',
  sky: '#D6E4F0',
  butter: '#F5E6A8',
  lilac: '#E4D7EE',
}

// Poster text is always rendered in near-black. Color selection drives the
// *background* now (not the text), so there's no longer a user-controlled
// text color.
const TEXT_COLOR = '#2D2D2D'

// Ghost placeholder shown inside the poster frame before the user has typed
// anything. Uses the same typography as the currently-selected layout so the
// preview doubles as a live demonstration of what their text will look like.
const GHOST_PLACEHOLDER = 'YOUR TEXT'

export function PosterPreview({ text, layout, orientation, color, pattern, activeTab, onClick }) {
  const typography = layout ? LAYOUT_TYPOGRAPHY[layout] : DEFAULT_TYPOGRAPHY
  const isEmpty = text.length === 0
  const displayText = isEmpty ? GHOST_PLACEHOLDER : text

  // Content-zone background: solid fill wins over pattern (they're mutually
  // exclusive in the hook, but this order makes the precedence explicit). The
  // `none` color id intentionally has no entry in SOLID_COLOR_HEX so it falls
  // through to the pattern branch and, if no pattern either, to transparent.
  // Pattern rendering: 45° diagonal stripes, 3px band with 6px repeat, with a
  // soft dark overlay so the underlying hue stays dominant (per specs.md).
  const solidHex = color ? SOLID_COLOR_HEX[color] : null
  const patternHex = pattern ? PATTERN_HEX[pattern] : null
  let contentZoneBackground = 'transparent'
  if (solidHex) {
    contentZoneBackground = solidHex
  } else if (patternHex) {
    contentZoneBackground = `repeating-linear-gradient(45deg, ${patternHex} 0 3px, rgba(0, 0, 0, 0.08) 3px 6px)`
  }

  const isVertical = orientation === 'vertical'
  const isCircular = layout === 'circular'
  const showDots = activeTab !== 'product'

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-(--color-bg-warm)"
      onClick={onClick}
    >
      <div className="w-full aspect-[431/932] relative top-[-50px]">
        <img
          src={bgPoster}
          alt=""
          className="block w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
          decoding="async"
          fetchpriority="high"
        />
        <div
          className="absolute top-[13%] left-[16%] w-[68%] h-[62%] flex items-center justify-center p-(--spacing-lg) transition-[background] duration-(--duration-normal) ease-in-out"
          style={{ background: contentZoneBackground }}
        >
          <div
            className={[
              'max-w-full max-h-full text-center leading-[1.2] break-words whitespace-pre-wrap',
              'transition-[color,opacity] duration-(--duration-normal) ease-in-out',
              isVertical ? 'rotate-[-90deg] origin-center' : '',
              isCircular
                ? 'border-2 border-current rounded-full aspect-square w-auto p-(--spacing-xl) flex items-center justify-center'
                : '',
              isEmpty ? 'opacity-25' : '',
            ].filter(Boolean).join(' ')}
            style={{
              color: TEXT_COLOR,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize,
              fontWeight: typography.fontWeight,
              letterSpacing: typography.letterSpacing,
              textTransform: typography.textTransform,
            }}
            aria-hidden={isEmpty || undefined}
          >
            {displayText}
          </div>
        </div>
      </div>
      {showDots && (
        <div
          className="absolute left-1/2 bottom-4 -translate-x-1/2 flex items-center gap-[6px] px-[10px] py-1 bg-white/85 border border-black/15 rounded-[12px] pointer-events-none"
          aria-hidden="true"
        >
          <span className="w-2 h-2 rounded-full bg-white border border-black/[0.28]" />
          <span className="w-2 h-2 rounded-full bg-white/50 border border-black/[0.18]" />
          <span className="w-2 h-2 rounded-full bg-white/50 border border-black/[0.18]" />
        </div>
      )}
    </div>
  )
}
