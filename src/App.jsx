import { useState } from 'react'
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
const KEYBOARD_DISMISS_MS = 350

export default function App() {
  const config = useConfigurator()
  const [hudCollapsed, setHudCollapsed] = useState(false)

  // Tapping the active tab toggles the HUD into a collapsed state where only
  // the TabBar + CartButton are visible (tab content is unmounted), giving
  // the user a clearer view of the poster preview behind. Tapping the same
  // tab again re-expands it; tapping a different tab switches tabs and
  // re-expands at the same time.
  //
  // If a textarea is currently focused (State 2), we blur it first and defer
  // the actual tab change by ~250ms so the iOS keyboard can finish dismissing
  // before the HUD starts animating — transitioning on top of a closing
  // keyboard looks chaotic on device.
  const handleTabChange = (nextTab) => {
    const apply = () => {
      if (nextTab === config.activeTab) {
        setHudCollapsed((prev) => !prev)
      } else {
        setHudCollapsed(false)
        config.setActiveTab(nextTab)
      }
    }

    const active = document.activeElement
    if (active && active.tagName === 'TEXTAREA') {
      active.blur()
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
