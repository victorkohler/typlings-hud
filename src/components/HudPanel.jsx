import { useRef, useState, useLayoutEffect, useEffect } from 'react'


// Swipe-to-dismiss thresholds — tuned for iOS-like feel.
const SWIPE_DISTANCE_THRESHOLD = 80  // px — dismiss on a slow drag past this
const SWIPE_VELOCITY_THRESHOLD = 0.4 // px/ms — dismiss on a fast flick
const DISMISS_MS = 200               // remaining-collapse animation
const SNAPBACK_MS = 300              // spring-back animation

export function HudPanel({ header, children, onDismiss }) {
  const panelRef = useRef(null)
  const headerRef = useRef(null)
  const contentInnerRef = useRef(null)
  const scrollRef = useRef(null)
  const [measuredHeight, setMeasuredHeight] = useState(null)

  // Stable reference so the touch handler effect doesn't re-attach on every render.
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useLayoutEffect(() => {
    const headerH = headerRef.current?.offsetHeight ?? 0
    const contentH = contentInnerRef.current?.offsetHeight ?? 0
    setMeasuredHeight(headerH + contentH)
  }, [children, header])

  // ── Swipe-to-dismiss gesture ──
  // Instead of translating the whole panel (which moves the tab bar off-screen),
  // we shrink the panel height. With flex-end layout the bottom stays anchored:
  // the content clips away from the bottom and the tab bar slides toward its
  // natural collapsed position — matching the existing tap-to-collapse animation.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let active = false
    let decided = false
    let animating = false
    let startY = 0
    let prevY = 0
    let prevTime = 0
    let currentY = 0
    let currentTime = 0
    let fullHeight = 0
    let minHeight = 0 // header-only

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
      fullHeight = panel.offsetHeight
      minHeight = headerRef.current?.offsetHeight ?? 0
    }

    const handleTouchMove = (e) => {
      if (animating) return
      const t = e.touches[0]
      const deltaY = t.clientY - startY

      // First significant movement decides: swipe-dismiss or scroll.
      if (!decided && Math.abs(deltaY) > 8) {
        const scrollTop = scrollRef.current?.scrollTop ?? 0
        const contentH = (contentInnerRef.current?.offsetHeight ?? 0)
        if (contentH > 0 && scrollTop <= 0 && deltaY > 0) {
          active = true
          // Disable the CSS height transition so the panel tracks the finger.
          // Hint will-change so the browser promotes the panel to its own
          // compositing layer for the duration of the gesture.
          panel.style.transition = 'none'
          panel.style.willChange = 'height'
        } else {
          active = false
        }
        decided = true
      }

      if (!active) return
      e.preventDefault()

      prevY = currentY
      prevTime = currentTime
      currentY = t.clientY
      currentTime = Date.now()

      const maxDelta = fullHeight - minHeight
      const clampedDelta = Math.max(0, Math.min(deltaY, maxDelta))
      panel.style.height = (fullHeight - clampedDelta) + 'px'
    }

    const handleTouchEnd = () => {
      if (!active) {
        decided = false
        return
      }

      const deltaY = currentY - startY
      const dt = (currentTime - prevTime) || 1
      const velocity = (currentY - prevY) / dt

      const shouldDismiss =
        deltaY > SWIPE_DISTANCE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD

      animating = true

      if (shouldDismiss) {
        // Animate the remaining collapse from current drag height → header-only.
        // Scale duration proportionally to the remaining distance so a near-
        // complete swipe finishes quickly.
        const remaining = (fullHeight - deltaY) - minHeight
        const contentH = fullHeight - minHeight
        const duration = prefersReducedMotion ? 0 : Math.max(80, Math.round(DISMISS_MS * (remaining / (contentH || 1))))

        panel.style.transition = `height ${duration}ms cubic-bezier(0.2, 0, 0, 1)`
        panel.style.height = minHeight + 'px'

        let done = false
        const cleanup = (e) => {
          if (e && e.propertyName !== 'height') return
          if (done) return
          done = true

          // Disable transition so React's re-render doesn't trigger a
          // second animation. Keep height at minHeight (don't clear it) —
          // clearing would expose React's stale measuredHeight (full height)
          // for one frame before the collapsed re-render lands.
          panel.style.transition = 'none'
          onDismissRef.current?.()

          // Restore the CSS transition after React has painted the collapsed
          // state — double-rAF guarantees the layout pass has completed.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              panel.style.transition = ''
              panel.style.willChange = ''
              animating = false
            })
          })
        }

        panel.addEventListener('transitionend', cleanup, { once: true })
        setTimeout(cleanup, duration + 50)
      } else {
        // Snap back to full height — CSS transition handles the spring.
        const snapDuration = prefersReducedMotion ? 0 : SNAPBACK_MS
        panel.style.transition = `height ${snapDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        panel.style.height = fullHeight + 'px'

        let done = false
        const cleanup = (e) => {
          if (e && e.propertyName !== 'height') return
          if (done) return
          done = true
          panel.style.transition = ''
          panel.style.height = ''
          panel.style.willChange = ''
          animating = false
          active = false
          decided = false
        }

        panel.addEventListener('transitionend', cleanup, { once: true })
        setTimeout(cleanup, snapDuration + 50)
      }

      active = false
      decided = false
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: true })
    panel.addEventListener('touchmove', handleTouchMove, { passive: false })
    panel.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart)
      panel.removeEventListener('touchmove', handleTouchMove)
      panel.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const height = measuredHeight != null ? `${measuredHeight}px` : 'auto'

  // Load-bearing: `PosterPreview.container` is `position: absolute; inset: 0`
  // — a full-viewport background layer. Under CSS 2.1 painting order,
  // positioned elements paint in step 8 after non-positioned blocks (step 4).
  // A static HudPanel would paint *behind* the absolute preview, and the
  // preview's bg + image would cover HudPanel entirely. Making HudPanel
  // `relative` puts it in step 8 alongside PosterPreview, where tree order
  // wins — HudPanel is the later sibling so it paints on top of the preview
  // (shadow + white body above image, rounded corner notches transparently
  // revealing image content behind).
  return (
    <div
      ref={panelRef}
      className="bg-(--color-white) rounded-t-(--radius-lg) shadow-(--shadow-hud) overflow-hidden transition-[height] duration-(--duration-panel) ease-(--ease-panel) flex-shrink-0 flex flex-col relative [contain:layout_style]"
      style={{ height }}
    >
      <div ref={headerRef} className="flex-shrink-0">
        {header}
      </div>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div ref={contentInnerRef}>
          {children}
        </div>
      </div>
    </div>
  )
}
