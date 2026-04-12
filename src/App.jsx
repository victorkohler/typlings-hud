import { useState, useMemo } from 'react'
import { useConfigurator } from './hooks/useConfigurator'
import { useHud } from './hooks/useHud'
import { PosterPreview } from './components/PosterPreview'
import { HudPanel } from './components/HudPanel'
import { TabBar } from './components/TabBar'
import { ProductSelector } from './components/ProductSelector'
import { DetailsPanel } from './components/DetailsPanel'
import { TextPersonalizer } from './components/TextPersonalizer'
import { LayoutPicker } from './components/LayoutPicker'
import { DesignPicker } from './components/DesignPicker'
import { CartButton } from './components/CartButton'
import { CartConfirmModal } from './components/CartConfirmModal'

const TABS = ['product', 'personalize', 'layout', 'design', 'details']

export default function App() {
  const config = useConfigurator(useMemo(() => ({ tabs: TABS }), []))
  const hud = useHud(config.activeTab, config.setActiveTab)
  const [showCartModal, setShowCartModal] = useState(false)

  const tabContent = {
    product: (
      <ProductSelector
        products={config.PRODUCTS}
        selectedProduct={config.selectedProduct}
        selectedSize={config.selectedSize}
        selectedFrame={config.selectedFrame}
        onSelectProduct={config.selectProduct}
        onSelectSize={config.selectSize}
        onSelectFrame={config.selectFrame}
        showOptions={false}
        columns={2}
      />
    ),
    details: (
      <DetailsPanel
        product={config.product}
        selectedSize={config.selectedSize}
        selectedFrame={config.selectedFrame}
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
    if (config.activeTab === 'product' && !config.completions.product) {
      hud.setCollapsed(false)
      config.advanceFromProduct()
    } else {
      setShowCartModal(true)
    }
  }

  // PosterPreview is position:absolute inset-0 (full-viewport background layer),
  // so the remaining flex children (HUD + CTA) are stacked at the bottom via
  // justify-end — the tylko "persistent live preview + bottom-anchored HUD" model.
  // `h-screen` (100vh) is the fallback for browsers without dvh support (older
  // in-app WebViews). The inline `height: 100dvh` overrides it when supported,
  // tracking the iOS Safari URL bar so the CTA stays above it. Inline style is
  // needed because Tailwind v4 may generate h-screen after h-[100dvh] in the
  // CSS, causing 100vh to win — defeating the whole point of dvh.
  return (
    <div
      className="flex flex-col justify-end relative h-screen overflow-hidden antialiased bg-(--color-bg-warm) text-(--color-text-primary)"
      style={{ height: '100dvh', fontFamily: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <PosterPreview
        text={config.text}
        layout={config.selectedLayout}
        orientation={config.orientation}
        color={config.selectedColor}
        pattern={config.selectedPattern}
        activeTab={config.activeTab}
        onClick={hud.collapse}
      />

      <HudPanel
        header={
          <TabBar
            tabs={config.TABS}
            activeTab={config.activeTab}
            onTabChange={hud.handleTabChange}
            onTabPointerDown={hud.handleTabPointerDown}
            completions={config.completions}
            selectedProductId={config.selectedProduct}
            selectedProductName={config.product?.name}
          />
        }
        onDismiss={hud.collapse}
      >
        {hud.collapsed ? null : tabContent[config.activeTab]}
      </HudPanel>

      <CartButton
        activeTab={config.activeTab}
        totalPrice={config.totalPrice}
        hasProduct={!!config.selectedProduct}
        productName={config.product?.name}
        productConfirmed={config.completions.product}
        onAction={handleCtaAction}
      />

      {showCartModal && (
        <CartConfirmModal
          variant="panel"
          text={config.text}
          layout={config.selectedLayout}
          orientation={config.orientation}
          color={config.selectedColor}
          pattern={config.selectedPattern}
          productName={config.product?.name}
          selectedSize={config.selectedSize}
          basePrice={config.basePrice}
          frameName={config.frame?.name}
          framePrice={config.framePrice}
          totalPrice={config.totalPrice}
          optionsContent={
            <DetailsPanel
              product={config.product}
              selectedSize={config.selectedSize}
              selectedFrame={config.selectedFrame}
              onSelectSize={config.selectSize}
              onSelectFrame={config.selectFrame}
              flush
            />
          }
          onConfirm={() => setShowCartModal(false)}
          onCancel={() => setShowCartModal(false)}
        />
      )}
    </div>
  )
}
