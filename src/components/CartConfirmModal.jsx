import { useRef, useState, useCallback } from 'react'

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
      className="fixed inset-0 bg-black/[.92] z-[200] flex items-center justify-center touch-none animate-[fadeIn_var(--duration-normal)_ease]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
    >
      <button
        className="absolute top-(--spacing-lg) right-(--spacing-lg) w-10 h-10 flex items-center justify-center border-none rounded-full bg-white/[.15] text-(--color-white) cursor-pointer z-[1] [-webkit-tap-highlight-color:transparent]"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
      <div
        ref={contentRef}
        className="origin-center will-change-transform transition-none"
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
function PreviewBlock({ text, layout, orientation, onExpand, compact }) {
  const previewTextClasses = [
    'text-[28px] font-bold tracking-[4px] uppercase text-(--color-text-primary) text-center break-words whitespace-pre-wrap leading-[1.2]',
    orientation === 'vertical' ? '-rotate-90 origin-center' : '',
    layout === 'circular' ? 'border-2 border-(--color-text-primary) rounded-full aspect-square w-[70%] p-(--spacing-lg) flex items-center justify-center' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`relative${compact ? ' w-fit' : ''}`}>
      <div className={`bg-(--color-bg-warm) rounded-none flex items-center justify-center p-(--spacing-xl) overflow-hidden${compact ? ' aspect-[5/7] max-h-[35vh]' : ' aspect-[3/4]'}`}>
        <div
          className={previewTextClasses}
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          {text || 'YOUR TEXT'}
        </div>
      </div>
      <button
        className="absolute top-(--spacing-sm) right-(--spacing-sm) w-8 h-8 flex items-center justify-center border-none rounded-(--radius-sm) bg-white/85 text-(--color-text-primary) cursor-pointer [-webkit-tap-highlight-color:transparent]"
        onClick={onExpand}
        aria-label="View fullscreen"
      >
        <ExpandIcon />
      </button>
    </div>
  )
}

function PriceBlock({ productName, selectedSize, basePrice, frameName, framePrice, totalPrice, inPopup }) {
  const showFrame = frameName && frameName !== 'No Frame'
  return (
    <div className={`mt-(--spacing-lg) flex flex-col gap-(--spacing-xs)${inPopup ? ' mb-(--spacing-xl)' : ''}`}>
      <div className="flex justify-between text-(--text-sm) text-(--color-text-secondary) leading-[1.6]">
        <span>{productName} ({selectedSize})</span>
        <span>{basePrice}kr</span>
      </div>
      {showFrame && (
        <div className="flex justify-between text-(--text-sm) text-(--color-text-secondary) leading-[1.6]">
          <span>Frame: {frameName}</span>
          <span>{framePrice}kr</span>
        </div>
      )}
      <div className="flex justify-between text-(--text-sm) text-(--color-text-secondary) leading-[1.6] mt-(--spacing-xs) pt-(--spacing-sm) border-t border-(--color-border-input) font-semibold text-(--color-text-primary) text-(--text-md)">
        <span>Total</span>
        <span>{totalPrice}kr</span>
      </div>
    </div>
  )
}

function ActionButtons({ onConfirm, onCancel }) {
  return (
    <>
      <button
        className="w-full py-[16px] border-none rounded-(--radius-pill) bg-(--color-accent) text-(--color-white) font-[inherit] text-(--text-sm) uppercase tracking-[1px] cursor-pointer [-webkit-tap-highlight-color:transparent]"
        onClick={onConfirm}
      >
        Add to cart
      </button>
      <button
        className="w-full py-[16px] border border-(--color-border-input) rounded-(--radius-pill) bg-transparent text-(--color-text-primary) font-[inherit] text-(--text-sm) uppercase tracking-[1px] cursor-pointer [-webkit-tap-highlight-color:transparent]"
        onClick={onCancel}
      >
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
  const scrollRef = useRef(null)
  const prevSizeRef = useRef(selectedSize)
  const prevFrameRef = useRef(frameName)

  // Scroll to bottom when size or frame changes in panel mode.
  if (variant === 'panel' && (prevSizeRef.current !== selectedSize || prevFrameRef.current !== frameName)) {
    prevSizeRef.current = selectedSize
    prevFrameRef.current = frameName
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }

  const fullscreenPreviewTextClasses = [
    'text-[28px] font-bold tracking-[4px] uppercase text-(--color-text-primary) text-center break-words whitespace-pre-wrap leading-[1.2]',
    orientation === 'vertical' ? '-rotate-90 origin-center' : '',
    layout === 'circular' ? 'border-2 border-(--color-text-primary) rounded-full aspect-square w-[70%] p-(--spacing-lg) flex items-center justify-center' : '',
  ].filter(Boolean).join(' ')

  const fullscreenOverlay = fullscreen && (
    <FullscreenViewer onClose={() => setFullscreen(false)}>
      <div className="rounded-none w-[80vw] max-w-[400px] bg-(--color-bg-warm) flex items-center justify-center p-(--spacing-xl) overflow-hidden aspect-[3/4]">
        <div
          className={fullscreenPreviewTextClasses}
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          {text || 'YOUR TEXT'}
        </div>
      </div>
    </FullscreenViewer>
  )

  if (variant === 'panel') {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-[100] animate-[fadeIn_var(--duration-normal)_ease]" onClick={onCancel} />
        <div className="fixed inset-0 z-[101] flex flex-col bg-(--color-white) animate-[panelSlideUp_var(--duration-panel)_var(--ease-panel)]">
          <div className="flex-1 overflow-y-auto p-(--spacing-xl) pb-(--spacing-md)" ref={scrollRef}>
            <div className="flex items-center justify-between">
              <h2 className="text-(--text-lg) font-medium text-(--color-text-primary) text-left mb-(--spacing-xs)">Your finished design</h2>
              <button
                className="flex items-center justify-center w-9 h-9 shrink-0 border-none rounded-full bg-transparent text-(--color-text-secondary) cursor-pointer [-webkit-tap-highlight-color:transparent]"
                onClick={onCancel}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-(--text-sm) text-(--color-text-secondary) text-left mb-(--spacing-lg)">Take a final look so everything is correct</p>
            <PreviewBlock
              text={text}
              layout={layout}
              orientation={orientation}
              onExpand={() => setFullscreen(true)}
              compact
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
          <div className="shrink-0 flex flex-col gap-(--spacing-sm) p-(--spacing-md) px-(--spacing-xl) pb-(--spacing-xl) bg-(--color-white) border-t border-(--color-border-input)">
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
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-(--spacing-xl) animate-[fadeIn_var(--duration-normal)_ease]"
        onClick={onCancel}
      >
        <div
          className="bg-(--color-white) rounded-(--radius-md) p-(--spacing-xl) w-full max-w-[360px] animate-[slideUp_var(--duration-slow)_var(--ease-panel)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-(--text-lg) font-medium text-(--color-text-primary) text-left mb-(--spacing-xs)">Your finished design</h2>
          <p className="text-(--text-sm) text-(--color-text-secondary) text-left mb-(--spacing-lg)">Take a final look so everything is correct</p>
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
            inPopup
          />
          <div className="flex flex-col gap-(--spacing-sm)">
            <ActionButtons onConfirm={onConfirm} onCancel={onCancel} />
          </div>
        </div>
      </div>
      {fullscreenOverlay}
    </>
  )
}
