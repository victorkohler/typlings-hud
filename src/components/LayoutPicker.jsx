import { useLayoutEffect, useRef, useState } from 'react'
import styles from './LayoutPicker.module.css'

// `specs.md` State 3 — drag-to-scroll velocity multiplier
const DRAG_VELOCITY = 1.5
// Pixels of horizontal movement before we treat a pointer gesture as a drag
// (rather than a tap) and swallow the trailing click on the card under the
// pointer.
const DRAG_THRESHOLD = 5

// Per-layout preview icons rendered inside the card's gray thumb. Each is a
// simple currentColor glyph (gray by default, accent when the card is
// selected — see `.thumb` / `.card.selected .thumb` in the module CSS).
// Kept inline rather than pulled from `design/assets/icons/` because these
// are one-offs specific to LayoutPicker and the shapes are trivial.
function IconBoxed() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="20" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconWave() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 17 Q 10 9, 16 17 T 28 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function IconPattern() {
  const xs = [10, 16, 22]
  const ys = [10, 16, 22]
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {ys.flatMap((y) => xs.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />))}
    </svg>
  )
}

function IconCircular() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconHero() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="13" width="22" height="6" rx="1" />
    </svg>
  )
}

const LAYOUT_ICONS = {
  boxed: IconBoxed,
  wave: IconWave,
  pattern: IconPattern,
  circular: IconCircular,
  hero: IconHero,
}

export function LayoutPicker({
  layouts,
  selectedLayout,
  orientation,
  onSelectLayout,
  onSetOrientation,
}) {
  const scrollerRef = useRef(null)
  // Drag state lives in a ref — we don't want every pointermove to re-render.
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // Orientation pill — we measure each button's real offset + width so the
  // sliding indicator can grow/shrink to the exact label size ("Horizontal"
  // is wider than "Vertical"). A fixed 50% pill would mis-align on one side.
  const horizontalBtnRef = useRef(null)
  const verticalBtnRef = useRef(null)
  const indicatorRef = useRef(null)
  // Tracks whether we've done an initial placement yet. The first measurement
  // is applied with `transition: none` so the pill lands in the right spot on
  // mount instead of flying in from width/left = 0.
  const indicatorPlacedRef = useRef(false)

  useLayoutEffect(() => {
    const activeBtn =
      orientation === 'vertical' ? verticalBtnRef.current : horizontalBtnRef.current
    const indicator = indicatorRef.current
    if (!activeBtn || !indicator) return

    const applyPlacement = () => {
      indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`
      indicator.style.width = `${activeBtn.offsetWidth}px`
    }

    if (!indicatorPlacedRef.current) {
      // Skip the transition on the very first placement so the pill appears
      // already positioned under the active label. Forcing a reflow between
      // disabling and re-enabling transitions guarantees the browser commits
      // the no-transition frame before subsequent orientation changes tween.
      indicator.style.transition = 'none'
      applyPlacement()
      // eslint-disable-next-line no-unused-expressions
      indicator.offsetWidth
      indicator.style.transition = ''
      indicatorPlacedRef.current = true
    } else {
      applyPlacement()
    }
  }, [orientation])

  const handlePointerDown = (e) => {
    // Only hijack mouse drags. Touch scrolling already has native momentum
    // (`-webkit-overflow-scrolling: touch`) that feels better than anything
    // we can fake with scrollLeft math.
    if (e.pointerType !== 'mouse') return
    const el = scrollerRef.current
    if (!el) return
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (e) => {
    const state = dragRef.current
    if (!state.active) return
    const el = scrollerRef.current
    if (!el) return
    const dx = e.clientX - state.startX
    state.moved = Math.abs(dx)
    el.scrollLeft = state.startScroll - dx * DRAG_VELOCITY
  }

  const endDrag = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setIsDragging(false)
    // `moved` is intentionally *not* reset here — the click event that fires
    // immediately after pointerup still needs it to decide whether to swallow.
    // It gets cleared by the click handler, or by the next pointerdown.
  }

  const handleCardClick = (layoutId) => {
    const wasDragged = dragRef.current.moved > DRAG_THRESHOLD
    dragRef.current.moved = 0
    if (wasDragged) return
    onSelectLayout(layoutId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.orientationWrap}>
        <div className={styles.orientationToggle} role="group" aria-label="Orientation">
          {/* Sliding pill — absolutely positioned. Its `transform` (x-offset)
              and `width` are set inline from the useLayoutEffect above, based
              on the active button's measured offsetLeft/offsetWidth, so the
              pill exactly wraps whichever label is selected. */}
          <div ref={indicatorRef} className={styles.orientationIndicator} aria-hidden="true" />
          <button
            ref={horizontalBtnRef}
            className={`${styles.orientationButton} ${orientation === 'horizontal' ? styles.active : ''}`}
            onClick={() => onSetOrientation('horizontal')}
          >
            Horizontal
          </button>
          <button
            ref={verticalBtnRef}
            className={`${styles.orientationButton} ${orientation === 'vertical' ? styles.active : ''}`}
            onClick={() => onSetOrientation('vertical')}
          >
            Vertical
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={`${styles.scroller} ${isDragging ? styles.dragging : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {layouts.map((layout) => {
          const Icon = LAYOUT_ICONS[layout.id]
          return (
            <button
              key={layout.id}
              className={`${styles.card} ${selectedLayout === layout.id ? styles.selected : ''}`}
              onClick={() => handleCardClick(layout.id)}
            >
              <div className={styles.thumb}>
                {Icon && <Icon />}
              </div>
              <div className={styles.cardLabel}>{layout.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
