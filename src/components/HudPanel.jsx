import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import styles from './HudPanel.module.css'

// Swipe-to-dismiss thresholds — tuned for iOS-like feel.
const SWIPE_DISTANCE_THRESHOLD = 80  // px — dismiss on a slow drag past this
const SWIPE_VELOCITY_THRESHOLD = 0.4 // px/ms — dismiss on a fast flick
const DISMISS_MS = 200               // slide-out animation
const SNAPBACK_MS = 300              // spring-back animation
const DAMPING = 0.4                  // resistance when over-swiping upward

export function HudPanel({ header, children, onDismiss }) {
  const panelRef = useRef(null)
  const headerRef = useRef(null)
  const contentInnerRef = useRef(null)
  const scrollRef = useRef(null)
  const [measuredHeight, setMeasuredHeight] = useState(null)

  // Stable reference to the latest onDismiss so the touch handler effect
  // doesn't re-attach listeners on every render.
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  // Measure the natural panel height (header + content) so the panel sizes
  // itself to fit its current tab exactly.
  useLayoutEffect(() => {
    const headerH = headerRef.current?.offsetHeight ?? 0
    const contentH = contentInnerRef.current?.offsetHeight ?? 0
    setMeasuredHeight(headerH + contentH)
  }, [children, header])

  // ── Swipe-to-dismiss gesture ──
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    // All gesture state in a single ref — zero React renders during the drag.
    let active = false     // in swipe mode
    let decided = false    // swipe vs scroll decided for this touch
    let animating = false  // dismiss/snapback transition in progress
    let startY = 0
    let prevY = 0
    let prevTime = 0
    let currentY = 0
    let currentTime = 0

    const handleTouchStart = (e) => {
      if (animating) return
      const t = e.touches[0]
      startY = t.clientY
      prevY = t.clientY
      prevTime = Date.now()
      currentY = t.clientY
      currentTime = Date.now()
      active = false
      decided = false
    }

    const handleTouchMove = (e) => {
      if (animating) return
      const t = e.touches[0]
      const deltaY = t.clientY - startY

      // First significant movement decides: swipe or scroll?
      if (!decided && Math.abs(deltaY) > 8) {
        const scrollTop = scrollRef.current?.scrollTop ?? 0
        const hasContent = (contentInnerRef.current?.offsetHeight ?? 0) > 0
        if (hasContent && scrollTop <= 0 && deltaY > 0) {
          active = true
          panel.style.willChange = 'transform'
        } else {
          active = false
        }
        decided = true
      }

      if (!active) return

      // Prevent native scroll while we own the gesture.
      e.preventDefault()

      // Track velocity via prev/current pairs.
      prevY = currentY
      prevTime = currentTime
      currentY = t.clientY
      currentTime = Date.now()

      // Allow downward drag freely. Upward past start gets rubber-band damping.
      const raw = t.clientY - startY
      const translateY = raw > 0 ? raw : raw * DAMPING
      panel.style.transform = `translateY(${translateY}px)`
    }

    const handleTouchEnd = () => {
      if (!active) {
        decided = false
        return
      }

      const deltaY = currentY - startY
      const dt = (currentTime - prevTime) || 1
      const velocity = (currentY - prevY) / dt // px/ms, positive = downward

      const shouldDismiss =
        deltaY > SWIPE_DISTANCE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD

      animating = true

      if (shouldDismiss) {
        // ── Dismiss: slide the panel out of view, then collapse ──
        const panelH = panel.offsetHeight
        panel.style.transition = `transform ${DISMISS_MS}ms cubic-bezier(0.2, 0, 0, 1)`
        panel.style.transform = `translateY(${panelH}px)`

        let done = false
        const cleanup = () => {
          if (done) return
          done = true

          // Hide panel so the reset + React re-render doesn't flash.
          panel.style.visibility = 'hidden'
          panel.style.transition = 'none'
          panel.style.transform = ''
          panel.style.willChange = ''

          onDismissRef.current?.()

          // Restore visibility after React has painted the collapsed state.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              panel.style.visibility = ''
              panel.style.transition = ''
              animating = false
              active = false
              decided = false
            })
          })
        }

        panel.addEventListener('transitionend', cleanup, { once: true })
        setTimeout(cleanup, DISMISS_MS + 50) // safety fallback
      } else {
        // ── Snap back: spring to original position ──
        panel.style.transition = `transform ${SNAPBACK_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        panel.style.transform = 'translateY(0)'

        let done = false
        const cleanup = () => {
          if (done) return
          done = true
          panel.style.transition = ''
          panel.style.transform = ''
          panel.style.willChange = ''
          animating = false
          active = false
          decided = false
        }

        panel.addEventListener('transitionend', cleanup, { once: true })
        setTimeout(cleanup, SNAPBACK_MS + 50)
      }
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: true })
    panel.addEventListener('touchmove', handleTouchMove, { passive: false })
    panel.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart)
      panel.removeEventListener('touchmove', handleTouchMove)
      panel.removeEventListener('touchend', handleTouchEnd)
    }
  }, []) // stable — onDismissRef keeps the callback fresh

  const height = measuredHeight != null ? `${measuredHeight}px` : 'auto'

  return (
    <div ref={panelRef} className={styles.panel} style={{ height }}>
      <div ref={headerRef} className={styles.header}>
        {header}
      </div>
      <div ref={scrollRef} className={styles.scrollArea}>
        <div ref={contentInnerRef}>
          {children}
        </div>
      </div>
    </div>
  )
}
