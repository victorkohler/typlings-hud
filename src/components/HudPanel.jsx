import { useRef, useState, useLayoutEffect } from 'react'
import styles from './HudPanel.module.css'

const COLLAPSED_HEIGHT = 240
const MAX_VH_RATIO = 0.88

export function HudPanel({ isExpanded, children }) {
  const contentRef = useRef(null)
  const [measuredExpanded, setMeasuredExpanded] = useState(null)

  // Measure the natural content height so the panel can size itself to fit
  // without extra whitespace, capped at 88vh (beyond which content scrolls).
  useLayoutEffect(() => {
    if (!isExpanded || !contentRef.current) return
    const natural = contentRef.current.scrollHeight
    const max = window.innerHeight * MAX_VH_RATIO
    setMeasuredExpanded(Math.min(natural, max))
  }, [isExpanded, children])

  const height = isExpanded
    ? (measuredExpanded != null ? `${measuredExpanded}px` : `${MAX_VH_RATIO * 100}vh`)
    : `${COLLAPSED_HEIGHT}px`

  return (
    <div className={styles.panel} style={{ height }}>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </div>
  )
}
