import { useRef, useState } from 'react'
import styles from './App.module.css'
import { useConfigurator } from './hooks/useConfigurator'
import { PosterPreview } from './components/PosterPreview'
import { HudPanel } from './components/HudPanel'
import { TabBar } from './components/TabBar'
import { ProductSelector } from './components/ProductSelector'
import { TextPersonalizer } from './components/TextPersonalizer'
import { LayoutPicker } from './components/LayoutPicker'
import { DesignPicker } from './components/DesignPicker'
import { CartButton } from './components/CartButton'

// iOS keyboard dismiss animation runs ~300ms end-to-end on recent devices.
// We wait for it to be 80–90% complete before kicking off the HUD/tab
// transition so the two animations don't overlap — overlapping reads as
// jittery on device. 280ms lands us at ~93% of the dismiss with a small
// safety margin before the HUD animation begins.
const KEYBOARD_DISMISS_MS = 1000

export default function App() {
  const config = useConfigurator()
  const [hudCollapsed, setHudCollapsed] = useState(false)

  // Captures whether a textarea was focused at the *start* of a tab tap
  // (pointerdown), before Safari has a chance to move focus onto the button
  // and implicitly blur the textarea. Read in `handleTabChange` below to
  // decide whether to stagger the tab transition behind the keyboard dismiss.
  //
  // Why not just check `document.activeElement` in the click handler? On
  // mobile Safari, pointerdown on a button moves focus away from the textarea
  // *before* the click event fires — so by the time onClick runs, the
  // textarea has already blurred and `activeElement` is the button (or body).
  // The old code checked activeElement in onClick and never entered the
  // deferred branch in practice, which is why bumping `KEYBOARD_DISMISS_MS`
  // had zero effect on timing.
  const textareaWasFocusedRef = useRef(false)

  const handleTabPointerDown = () => {
    textareaWasFocusedRef.current = document.activeElement?.tagName === 'TEXTAREA'
  }

  // Tapping the active tab toggles the HUD into a collapsed state where only
  // the TabBar + CartButton are visible (tab content is unmounted), giving
  // the user a clearer view of the poster preview behind. Tapping the same
  // tab again re-expands it; tapping a different tab switches tabs and
  // re-expands at the same time.
  //
  // If a textarea was focused at pointerdown (State 2), we blur it and defer
  // the actual tab change by `KEYBOARD_DISMISS_MS` so the iOS keyboard can
  // finish dismissing before the HUD starts animating — running both
  // animations simultaneously looks chaotic on device.
  const handleTabChange = (nextTab) => {
    const apply = () => {
      if (nextTab === config.activeTab) {
        setHudCollapsed((prev) => !prev)
      } else {
        setHudCollapsed(false)
        config.setActiveTab(nextTab)
      }
    }

    if (textareaWasFocusedRef.current) {
      textareaWasFocusedRef.current = false
      // Explicitly blur in case Safari hasn't already done so. On most mobile
      // browsers the pointerdown on the button has already blurred it, but
      // this makes the branch self-consistent across platforms.
      const el = document.activeElement
      if (el && typeof el.blur === 'function') el.blur()
      setTimeout(apply, KEYBOARD_DISMISS_MS)
    } else {
      apply()
    }
  }

  const tabContent = {
    product: (
      <ProductSelector
        products={config.PRODUCTS}
        frames={config.FRAMES}
        selectedProduct={config.selectedProduct}
        selectedSize={config.selectedSize}
        selectedFrame={config.selectedFrame}
        onSelectProduct={config.selectProduct}
        onSelectSize={config.selectSize}
        onSelectFrame={config.selectFrame}
      />
    ),
    personalize: (
      <TextPersonalizer
        text={config.text}
        onTextChange={config.updateText}
      />
    ),
    layout: (
      <LayoutPicker
        layouts={config.LAYOUTS}
        selectedLayout={config.selectedLayout}
        orientation={config.orientation}
        onSelectLayout={config.selectLayout}
        onSetOrientation={config.setOrientation}
      />
    ),
    design: (
      <DesignPicker
        solidColors={config.SOLID_COLORS}
        patterns={config.PATTERNS}
        selectedColor={config.selectedColor}
        selectedPattern={config.selectedPattern}
        onSelectColor={config.selectColor}
        onSelectPattern={config.selectPattern}
      />
    ),
  }

  const handleCtaAction = () => {
    if (config.activeTab === 'product') {
      setHudCollapsed(false)
      config.advanceFromProduct()
    }
  }

  return (
    <div className={styles.app}>
      <PosterPreview
        text={config.text}
        layout={config.selectedLayout}
        orientation={config.orientation}
        color={config.selectedColor}
        pattern={config.selectedPattern}
        activeTab={config.activeTab}
      />

      <HudPanel
        header={
          <TabBar
            tabs={config.TABS}
            activeTab={config.activeTab}
            onTabChange={handleTabChange}
            onTabPointerDown={handleTabPointerDown}
            completions={config.completions}
            selectedProductId={config.selectedProduct}
            selectedProductName={config.product?.name}
          />
        }
      >
        {hudCollapsed ? null : tabContent[config.activeTab]}
      </HudPanel>

      <CartButton
        activeTab={config.activeTab}
        totalPrice={config.totalPrice}
        hasProduct={!!config.selectedProduct}
        productName={config.product?.name}
        onAction={handleCtaAction}
      />
    </div>
  )
}
