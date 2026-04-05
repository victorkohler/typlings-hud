import bgPoster from '../assets/bg-poster.jpg'
import styles from './PosterPreview.module.css'

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
// only consumer and the lists are short.
const SOLID_COLOR_HEX = {
  coral: '#E8745A',
  charcoal: '#2D2D2D',
  forest: '#4A6741',
  'slate-blue': '#3B5998',
  'saddle-brown': '#8B4513',
  goldenrod: '#DAA520',
}

const PATTERN_HEX = {
  cream: '#F5E6D3',
  wheat: '#E8D5B7',
  sand: '#D4C5A9',
  khaki: '#C0B59B',
  sage: '#ACA58D',
}

const DEFAULT_TEXT_COLOR = '#2D2D2D'

export function PosterPreview({ text, layout, orientation, color, pattern, activeTab }) {
  const typography = layout ? LAYOUT_TYPOGRAPHY[layout] : DEFAULT_TYPOGRAPHY
  const textColor = color ? SOLID_COLOR_HEX[color] ?? DEFAULT_TEXT_COLOR : DEFAULT_TEXT_COLOR
  const patternColor = pattern ? PATTERN_HEX[pattern] : null

  // Pattern background: 45° diagonal stripes, 3px band with 6px repeat (per
  // specs.md State 4). Alternating band is a soft overlay so the underlying
  // swatch hue is dominant.
  const contentZoneBackground = patternColor
    ? `repeating-linear-gradient(45deg, ${patternColor} 0 3px, rgba(0, 0, 0, 0.08) 3px 6px)`
    : 'transparent'

  const isVertical = orientation === 'vertical'
  const isCircular = layout === 'circular'
  const showDots = activeTab !== 'product'

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        <img
          src={bgPoster}
          alt=""
          className={styles.bgImage}
          draggable={false}
          decoding="async"
        />
        <div
          className={styles.contentZone}
          style={{ background: contentZoneBackground }}
        >
          <div
            className={[
              styles.textWrap,
              isVertical ? styles.vertical : '',
              isCircular ? styles.circular : '',
            ].filter(Boolean).join(' ')}
            style={{
              color: textColor,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize,
              fontWeight: typography.fontWeight,
              letterSpacing: typography.letterSpacing,
              textTransform: typography.textTransform,
            }}
          >
            {text}
          </div>
        </div>
      </div>
      {showDots && (
        <div className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.dotActive}`} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      )}
    </div>
  )
}
