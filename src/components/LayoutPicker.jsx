import { useRef, useState } from 'react'
import styles from './LayoutPicker.module.css'

// `specs.md` State 3 — drag-to-scroll velocity multiplier
const DRAG_VELOCITY = 1.5
// Pixels of horizontal movement before we treat a pointer gesture as a drag
// (rather than a tap) and swallow the trailing click on the card under the
// pointer.
const DRAG_THRESHOLD = 5

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
      <div
        ref={scrollerRef}
        className={`${styles.scroller} ${isDragging ? styles.dragging : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {layouts.map((layout) => (
          <button
            key={layout.id}
            className={`${styles.card} ${selectedLayout === layout.id ? styles.selected : ''}`}
            onClick={() => handleCardClick(layout.id)}
          >
            <div className={styles.thumb} />
            <div className={styles.cardLabel}>{layout.name}</div>
          </button>
        ))}
      </div>

      <div className={styles.orientationWrap}>
        <div className={styles.orientationToggle} role="group" aria-label="Orientation">
          <button
            className={`${styles.orientationButton} ${orientation === 'horizontal' ? styles.active : ''}`}
            onClick={() => onSetOrientation('horizontal')}
          >
            Horizontal
          </button>
          <button
            className={`${styles.orientationButton} ${orientation === 'vertical' ? styles.active : ''}`}
            onClick={() => onSetOrientation('vertical')}
          >
            Vertical
          </button>
        </div>
      </div>
    </div>
  )
}
