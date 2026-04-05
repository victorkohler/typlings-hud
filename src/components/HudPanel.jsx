import { useRef, useState, useLayoutEffect } from 'react'
import styles from './HudPanel.module.css'

export function HudPanel({ header, children }) {
  const headerRef = useRef(null)
  const contentInnerRef = useRef(null)
  const [measuredHeight, setMeasuredHeight] = useState(null)

  // Measure the natural panel height (header + content) so the panel sizes
  // itself to fit its current tab exactly — no fixed collapsed height, no
  // viewport-based cap. Each state owns its own height; HudPanel is purely
  // a passive measurer.
  //
  // Note: we measure `contentInnerRef` (an intrinsic-sized wrapper inside the
  // scroll area), NOT the scroll area itself. The scroll area is `flex: 1 1
  // auto` and would report its flex-allocated height via scrollHeight whenever
  // content fits without overflowing.
  useLayoutEffect(() => {
    const headerH = headerRef.current?.offsetHeight ?? 0
    const contentH = contentInnerRef.current?.offsetHeight ?? 0
    setMeasuredHeight(headerH + contentH)
  }, [children, header])

  const height = measuredHeight != null ? `${measuredHeight}px` : 'auto'

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
