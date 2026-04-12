import { useLayoutEffect, useRef, useState } from 'react'

// `specs.md` State 3 — drag-to-scroll velocity multiplier
const DRAG_VELOCITY = 1.5
// Pixels of horizontal movement before we treat a pointer gesture as a drag
// (rather than a tap) and swallow the trailing click on the card under the
// pointer.
const DRAG_THRESHOLD = 5

// Per-layout preview icons rendered inside the card's gray thumb. Each is a
// simple currentColor glyph (gray by default, accent when the card is
// selected). Kept inline rather than pulled from `design/assets/icons/`
// because these are one-offs specific to LayoutPicker and the shapes are trivial.
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
    <div className="py-(--spacing-lg)">
      {/* Orientation section */}
      <div className="flex justify-between items-baseline mb-(--spacing-md) px-(--spacing-lg)">
        <span className="text-(--text-xs) tracking-[1px] font-light uppercase text-(--color-text-primary)">Orientation</span>
      </div>
      <div className="flex justify-start mb-(--spacing-xl) px-(--spacing-lg)">
        <div
          className="relative inline-flex bg-(--color-surface-thumbnail) border-none rounded-(--radius-sm) p-[3px] overflow-hidden isolate"
          role="group"
          aria-label="Orientation"
        >
          <div
            ref={indicatorRef}
            className="absolute top-[3px] bottom-[3px] left-0 w-0 bg-(--color-white) rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] z-0 will-change-[transform,width] [transition:transform_300ms_cubic-bezier(0.4,0,0.2,1),width_300ms_cubic-bezier(0.4,0,0.2,1)]"
            aria-hidden="true"
          />
          <button
            ref={horizontalBtnRef}
            className={`relative z-10 px-4 py-2 text-(--text-sm) font-medium font-[inherit] border-none bg-transparent cursor-pointer [-webkit-tap-highlight-color:transparent] [transition:color_300ms_cubic-bezier(0.4,0,0.2,1)] ${orientation === 'horizontal' ? 'text-(--color-text-primary)' : 'text-(--color-text-secondary)'}`}
            onClick={() => onSetOrientation('horizontal')}
          >
            Horizontal
          </button>
          <button
            ref={verticalBtnRef}
            className={`relative z-10 px-4 py-2 text-(--text-sm) font-medium font-[inherit] border-none bg-transparent cursor-pointer [-webkit-tap-highlight-color:transparent] [transition:color_300ms_cubic-bezier(0.4,0,0.2,1)] ${orientation === 'vertical' ? 'text-(--color-text-primary)' : 'text-(--color-text-secondary)'}`}
            onClick={() => onSetOrientation('vertical')}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Layout section */}
      <div className="flex justify-between items-baseline mb-(--spacing-md) px-(--spacing-lg)">
        <span className="text-(--text-xs) tracking-[1px] font-light uppercase text-(--color-text-primary)">Layout</span>
      </div>
      <div
        ref={scrollerRef}
        className={`flex gap-(--spacing-md) overflow-x-auto overflow-y-hidden px-(--spacing-lg) select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {layouts.map((layout) => {
          const Icon = LAYOUT_ICONS[layout.id]
          const isSelected = selectedLayout === layout.id
          return (
            <button
              key={layout.id}
              className="w-[calc((100%-var(--spacing-md)*4)/4.5)] shrink-0 grow-0 flex flex-col bg-transparent border-none p-0 cursor-pointer text-left [-webkit-tap-highlight-color:transparent]"
              onClick={() => handleCardClick(layout.id)}
            >
              <div
                className={`w-full aspect-square rounded-(--radius-sm) border border-transparent flex items-center justify-center [transition:background_var(--duration-normal)_ease,border-color_var(--duration-normal)_ease,color_var(--duration-normal)_ease] ${isSelected ? 'bg-(--color-surface-card-selected) border-(--color-accent) text-(--color-accent)' : 'bg-(--color-surface-thumbnail) text-(--color-text-secondary)'}`}
              >
                {Icon && (
                  <span className="w-[42%] h-[42%] block [&>svg]:w-full [&>svg]:h-full [&>svg]:block">
                    <Icon />
                  </span>
                )}
              </div>
              <div
                className={`pt-[6px] text-(--text-sm) font-normal [transition:color_var(--duration-normal)_ease] ${isSelected ? 'text-(--color-accent)' : 'text-(--color-text-secondary)'}`}
              >
                {layout.name}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
