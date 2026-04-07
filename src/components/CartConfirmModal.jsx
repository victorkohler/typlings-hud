import { useRef, useState, useCallback } from 'react'
import styles from './CartConfirmModal.module.css'

// Inline SVG icons — no icon library per dependency policy.
function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 1 1 1 1 6" />
      <polyline points="12 1 17 1 17 6" />
      <polyline points="6 17 1 17 1 12" />
      <polyline points="12 17 17 17 17 12" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  )
}

// Fullscreen poster viewer with pinch-to-zoom and drag-to-pan.
function FullscreenViewer({ children, onClose }) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const lastTouchRef = useRef(null)
  const lastDistRef = useRef(null)
  const contentRef = useRef(null)

  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      lastDistRef.current = getTouchDist(e.touches)
      lastTouchRef.current = null
    } else if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 2) {
      const dist = getTouchDist(e.touches)
      if (lastDistRef.current !== null) {
        const delta = dist / lastDistRef.current
        setScale((s) => Math.min(Math.max(s * delta, 1), 5))
      }
      lastDistRef.current = dist
      lastTouchRef.current = null
    } else if (e.touches.length === 1 && lastTouchRef.current && scale > 1) {
      const dx = e.touches[0].clientX - lastTouchRef.current.x
      const dy = e.touches[0].clientY - lastTouchRef.current.y
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }))
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [scale])

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = null
    lastTouchRef.current = null
  }, [])

  // Double-tap to toggle zoom
  const lastTapRef = useRef(0)
  const handleTap = useCallback((e) => {
    // Don't intercept close button taps
    if (e.target.closest('button')) return
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      if (scale > 1) {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
      } else {
        setScale(2.5)
      }
    }
    lastTapRef.current = now
  }, [scale])

  return (
    <div
      className={styles.fullscreen}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
    >
      <button className={styles.closeFullscreen} onClick={onClose}>
        <CloseIcon />
      </button>
      <div
        ref={contentRef}
        className={styles.fullscreenContent}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Shared inner content pieces used by both popup and panel layouts.
function PreviewBlock({ text, layout, orientation, onExpand }) {
  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewFrame}>
        <div
          className={[
            styles.previewText,
            orientation === 'vertical' ? styles.vertical : '',
            layout === 'circular' ? styles.circular : '',
          ].filter(Boolean).join(' ')}
        >
          {text || 'YOUR TEXT'}
        </div>
      </div>
      <button
        className={styles.expandBtn}
        onClick={onExpand}
        aria-label="View fullscreen"
      >
        <ExpandIcon />
      </button>
    </div>
  )
}

function PriceBlock({ productName, selectedSize, basePrice, frameName, framePrice, totalPrice }) {
  const showFrame = frameName && frameName !== 'No Frame'
  return (
    <div className={styles.priceBreakdown}>
      <div className={styles.priceRow}>
        <span>{productName} ({selectedSize})</span>
        <span>{basePrice}kr</span>
      </div>
      {showFrame && (
        <div className={styles.priceRow}>
          <span>Frame: {frameName}</span>
          <span>{framePrice}kr</span>
        </div>
      )}
      <div className={`${styles.priceRow} ${styles.priceTotal}`}>
        <span>Total</span>
        <span>{totalPrice}kr</span>
      </div>
    </div>
  )
}

function ActionButtons({ onConfirm, onCancel }) {
  return (
    <>
      <button className={styles.confirm} onClick={onConfirm}>
        Add to cart
      </button>
      <button className={styles.cancel} onClick={onCancel}>
        Continue editing
      </button>
    </>
  )
}

export function CartConfirmModal({
  text, layout, orientation, color, pattern,
  productName, selectedSize, basePrice, frameName, framePrice, totalPrice,
  optionsContent,
  variant = 'popup',
  onConfirm, onCancel,
}) {
  const [fullscreen, setFullscreen] = useState(false)

  const fullscreenOverlay = fullscreen && (
    <FullscreenViewer onClose={() => setFullscreen(false)}>
      <div className={`${styles.previewFrame} ${styles.previewFrameFullscreen}`}>
        <div
          className={[
            styles.previewText,
            orientation === 'vertical' ? styles.vertical : '',
            layout === 'circular' ? styles.circular : '',
          ].filter(Boolean).join(' ')}
        >
          {text || 'YOUR TEXT'}
        </div>
      </div>
    </FullscreenViewer>
  )

  if (variant === 'panel') {
    return (
      <>
        <div className={styles.panelBackdrop} onClick={onCancel} />
        <div className={styles.panel}>
          <div className={styles.panelScroll}>
            <div className={styles.panelHeader}>
              <h2 className={styles.heading}>Your finished design</h2>
              <button className={styles.panelClose} onClick={onCancel} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <p className={styles.subheading}>Take a final look so everything is correct</p>
            <PreviewBlock
              text={text}
              layout={layout}
              orientation={orientation}
              onExpand={() => setFullscreen(true)}
            />
            {optionsContent}
            <PriceBlock
              productName={productName}
              selectedSize={selectedSize}
              basePrice={basePrice}
              frameName={frameName}
              framePrice={framePrice}
              totalPrice={totalPrice}
            />
          </div>
          <div className={styles.panelActions}>
            <ActionButtons onConfirm={onConfirm} onCancel={onCancel} />
          </div>
        </div>
        {fullscreenOverlay}
      </>
    )
  }

  // Default: centered popup
  return (
    <>
      <div className={styles.backdrop} onClick={onCancel}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.heading}>Your finished design</h2>
          <p className={styles.subheading}>Take a final look so everything is correct</p>
          <PreviewBlock
            text={text}
            layout={layout}
            orientation={orientation}
            onExpand={() => setFullscreen(true)}
          />
          {optionsContent}
          <PriceBlock
            productName={productName}
            selectedSize={selectedSize}
            basePrice={basePrice}
            frameName={frameName}
            framePrice={framePrice}
            totalPrice={totalPrice}
          />
          <div className={styles.actions}>
            <ActionButtons onConfirm={onConfirm} onCancel={onCancel} />
          </div>
        </div>
      </div>
      {fullscreenOverlay}
    </>
  )
}
