import { useRef, useState, useLayoutEffect } from 'react'
import styles from './HudPanel.module.css'

const COLLAPSED_HEIGHT = 240
const MAX_VH_RATIO = 0.88

export function HudPanel({ isExpanded, header, children }) {
  const headerRef = useRef(null)
  const contentInnerRef = useRef(null)
  const [measuredExpanded, setMeasuredExpanded] = useState(null)

  // Measure the natural panel height (header + content) so the panel can size
  // itself to fit without extra whitespace, capped at 88vh. Beyond the cap,
  // only the inner scroll area scrolls — the header stays fixed.
  //
  // Note: we measure `contentInnerRef` (an intrinsic-sized wrapper inside the
  // scroll area), NOT the scroll area itself. The scroll area is `flex: 1 1
  // auto` and would report its flex-allocated height via scrollHeight whenever
  // content fits without overflowing — locking the panel at 88vh on mount.
  useLayoutEffect(() => {
    if (!isExpanded) return
    const headerH = headerRef.current?.offsetHeight ?? 0
    const contentH = contentInnerRef.current?.offsetHeight ?? 0
    const max = window.innerHeight * MAX_VH_RATIO
    setMeasuredExpanded(Math.min(headerH + contentH, max))
  }, [isExpanded, children, header])

  const height = isExpanded
    ? (measuredExpanded != null ? `${measuredExpanded}px` : `${MAX_VH_RATIO * 100}vh`)
    : `${COLLAPSED_HEIGHT}px`

  return (
    <div className={styles.panel} style={{ height }}>
      <div ref={headerRef} className={styles.header}>
        {header}
      </div>
      <div className={styles.scrollArea}>
        <div ref={contentInnerRef}>
          {children}
        </div>
      </div>
    </div>
  )
}
